/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use client';

import { useEffect, useState, useMemo } from 'react';

import { Box, Group, Stack, Text, Title } from '@mantine/core';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { CardLoading, DatePicker, GraphView, MessageBox, PageHeader } from '@/shared-modules/components';
import { GRAPH_CARD_HEIGHT, deviceTypeOrder } from '@/shared-modules/constant';
import styles from '@/shared-modules/styles/styles.module.css';
import { APIDeviceType, APIPromQL, APInode, APIresource, APIresourceForNodeDetail } from '@/shared-modules/types';
import {
  fetcher,
  fetcherForPromqlByPost,
  formatEnergyValue,
  formatNetworkTransferValue,
  formatPercentValue,
  formatUnitValue,
  mergeMultiGraphData,
  parseGraphData,
  typeToUnit,
  typeToVolumeKey,
} from '@/shared-modules/utils';
import { useIdFromQuery, useLoading } from '@/shared-modules/utils/hooks';

import { ResourceListTable } from '@/components';

/**
 * Node Detail Page
 *
 * @returns Page content
 */
const NodeDetail = () => {
  const t = useTranslations();
  const nodeId = useIdFromQuery();
  const items = [
    { title: t('Resource Management') },
    { title: t('Nodes'), href: '/cdim/res-node-list' },
    { title: `${t('Node Details')} <${nodeId}>` },
  ];

  // const mswInitializing = useMSW();
  const mswInitializing = false; // Do not use MSW

  const [metricStartDate, setMetricStartDate] = useState<string>();
  const [metricEndDate, setMetricEndDate] = useState<string>();
  useEffect(() => {
    const currentDate = new Date();
    setMetricEndDate(currentDate.toISOString());
    const OneMonthBeforeDate = currentDate;
    OneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);
    setMetricStartDate(OneMonthBeforeDate.toISOString());
  }, []);

  const { data, error, isValidating, mutate } = useSWRImmutable<APInode>(
    nodeId && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/nodes/${nodeId}`,
    fetcher
  );

  const { graphData, graphError, graphMutate, graphValidating, deviceTypes } = useGraphData(
    data,
    metricStartDate,
    metricEndDate
  );

  /** Function called when reload button is pressed */
  const reload = () => {
    mutate();
    graphMutate();
  };

  const nodeLoading = useLoading(isValidating || mswInitializing);
  const loading = useLoading(isValidating || mswInitializing || graphValidating);

  return (
    <>
      <Stack gap='xl'>
        <PageHeader pageTitle={t('Node Details')} items={items} mutate={reload} loading={loading} />
        <Messages error={error} graphError={graphError} />
        <Summary data={data} loading={nodeLoading} />
        {/* Resource Specifications */}
        <VolumeCards resources={data?.resources as APIresource[]} loading={nodeLoading} />
        <Performance
          graphData={graphData}
          types={deviceTypes}
          startDate={metricStartDate}
          endDate={metricEndDate}
          loading={loading}
        />
        <ResourceList resources={data?.resources as APIresource[]} loading={nodeLoading} />
      </Stack>
    </>
  );
};

const Messages = (props: { error: any; graphError: any }) => {
  const { error, graphError } = props;
  return (
    <>
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      {graphError && <MessageBox type='error' title={graphError.message} message={''} />}
    </>
  );
};

const useGraphData = (
  data: APInode | undefined,
  metricStartDate: string | undefined,
  metricEndDate: string | undefined
) => {
  // const [graphData, setGraphData] = useState<APIPromQL | undefined>(undefined);
  // const [graphError, setGraphError] = useState<Error | null>(null);
  // const [isValidating, setIsValidating] = useState<boolean>(false);

  /** Get graph data */
  // List of resource IDs under the node (pipe-separated)
  const deviceIds = data?.resources.map((resource) => resource.device.deviceID).join('|');
  // List of device types
  const deviceTypes: APIDeviceType[] = [...new Set(data?.resources.map((resource) => resource.device.type))];

  /** Create queries to get energy consumption (total difference) for each type */
  const makeEnergyQuery = (): string => {
    const baseString = `label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~"${deviceIds}"}[1h])/3600),"data_label","<type>_energy","","")`;
    const replacedStrings = deviceTypes.map((type) => baseString.replace(/<type>/g, type));
    return replacedStrings.join(' or ');
  };
  /** Create queries to get processor usage (average) for each processor type */
  const makeProcessorUsageQuery = (): string => {
    const processorTypes = deviceTypes.filter((type) =>
      ['Accelerator', 'CPU', 'DSP', 'FPGA', 'GPU', 'UnknownProcessor'].includes(type)
    );
    const baseString = `label_replace(avg({__name__=~"<type>_usageRate",job=~"${deviceIds}"}[1h]),"data_label","<type>_usage","","")`;
    const replacedStrings = processorTypes.map((type) => baseString.replace(/<type>/g, type));
    return replacedStrings.join(' or ');
  };
  /** Get memory usage (total) query
   *  Calculate the percentage from the capacity and round to 2 decimal places
   */
  const sumCapacityMiB = data
    ? data.resources
        .filter((resource) => resource.device.type === 'memory')
        .reduce((acc, resource) => acc + (resource.device.capacityMiB ?? 0), 0)
    : 0;
  const usageMemoryQuery =
    sumCapacityMiB === 0
      ? ''
      : `label_replace(round((sum({__name__=~"memory_usedMemory",job=~"${deviceIds}"})/(${sumCapacityMiB}*1024)*100)*100)/100,"data_label","memory_usage","","")`;
  /** Get storage usage (average) query
      Calculate the percentage from the capacity and round to 2 decimal places */
  const sumDriveCapacityBytes = data
    ? data.resources
        .filter((resource) => resource.device.type === 'storage')
        .reduce((acc, resource) => acc + (resource.device.driveCapacityBytes ?? 0), 0)
    : 0;
  const usageStorageQuery =
    deviceTypes.includes('storage') && sumDriveCapacityBytes
      ? `label_replace(round((sum({__name__=~"storage_disk_amountUsedDisk",job=~"${deviceIds}"})/(${sumDriveCapacityBytes})*100)*100)/100,"data_label","storage_usage","","")`
      : '';
  /** Get network transfer speed (total) query
     Get the increase per hour and calculate the average increase per second (cannot be shorter than the collection interval of Prometheus, such as 1s) */
  const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
  const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
  const usageNetworkInterfaceQuery = deviceTypes.includes('networkInterface')
    ? `label_replace(sum(increase({__name__=~"${bytesSent}|${bytesRecv}",job=~"${deviceIds}"}))[1h]/3600,"data_label","networkInterface_usage","","")`
    : '';

  const performanceQueries = [
    makeEnergyQuery(),
    makeProcessorUsageQuery(),
    usageMemoryQuery,
    usageStorageQuery,
    usageNetworkInterfaceQuery,
  ]
    .filter((item) => item !== '')
    .join(' or ');

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('query', performanceQueries);
    p.append('start', metricStartDate ?? '');
    p.append('end', metricEndDate ?? '');
    p.append('step', '1h');
    return p;
  }, [performanceQueries, metricStartDate, metricEndDate]);

  const {
    data: graphData,
    error: graphError,
    mutate: graphMutate,
    isValidating,
  } = useSWRImmutable<APIPromQL>(
    data && [`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`, params],
    ([url, params]: [string, URLSearchParams]) => fetcherForPromqlByPost(url, params)
  );

  return { graphData, graphError, graphMutate, graphValidating: isValidating, deviceTypes };
};

/**
 * Renders a summary of node details.
 *
 * @component
 * @param  props - The component props.
 * @param  props.data - The node data.
 * @returns JSX.Element, The rendered summary component.
 */
const Summary = ({ data, loading }: { data?: APInode; loading: boolean }) => {
  const t = useTranslations();

  let id: string | undefined;
  let numberOfResources: number | undefined;
  let numberOfDisabledResources: number | undefined;
  let numberOfWarningResources: number | undefined;
  let numberOfCriticalResources: number | undefined;
  let numberOfExcludedResources: number | undefined;

  if (data) {
    id = data.id;
    numberOfResources = data.resources.length;
    numberOfDisabledResources = data.resources.filter((item) => item.device.status.state === 'Disabled').length;
    numberOfWarningResources = data.resources.filter((item) => item.device.status.health === 'Warning').length;
    numberOfCriticalResources = data.resources.filter((item) => item.device.status.health === 'Critical').length;
    numberOfExcludedResources = data.resources.filter((item) => item.annotation.available === false).length;
  }

  return (
    <Stack>
      <CardLoading withBorder w={'43em'} loading={loading}>
        <Text fz='sm'>{t('Node ID')}</Text>
        <Text fz='lg' fw={500}>
          {id}
        </Text>
      </CardLoading>
      <Title order={2} fz='lg'>
        {t('Resources.number')}
      </Title>
      <Group gap={'1em'}>
        <NumberOrVolumeCard title={t('Total')} value={numberOfResources} loading={loading} />
        <NumberOrVolumeCard
          title={t('Disabled')}
          value={numberOfDisabledResources}
          loading={loading}
          className={numberOfDisabledResources !== 0 && numberOfDisabledResources !== undefined ? styles.red : ''}
        />
        <NumberOrVolumeCard
          title={t('Warning')}
          value={numberOfWarningResources}
          loading={loading}
          className={numberOfWarningResources !== 0 && numberOfWarningResources !== undefined ? styles.yellow : ''}
        />
        <NumberOrVolumeCard
          title={t('Critical')}
          value={numberOfCriticalResources}
          loading={loading}
          className={numberOfCriticalResources !== 0 && numberOfCriticalResources !== undefined ? styles.red : ''}
        />
        <NumberOrVolumeCard
          title={t('Excluded from design')}
          value={numberOfExcludedResources}
          loading={loading}
          className={numberOfExcludedResources !== 0 && numberOfExcludedResources !== undefined ? styles.gray : ''}
        />
      </Group>
    </Stack>
  );
};

const NumberOrVolumeCard = (props: {
  title: string;
  value?: string | number;
  unit?: string;
  loading: boolean;
  className?: string;
}) => {
  return (
    <CardLoading withBorder miw={'10em'} loading={props.loading} display='block' className={props.className}>
      <Text fz='sm'>{props.title}</Text>
      <Text fz='lg' fw={500} span>
        {props.value}
      </Text>
      <Text fz='md' fw={500} pl='0.3em' span>
        {props.unit}
      </Text>
    </CardLoading>
  );
};

/**
 * Performance component displays various performance metrics for a node.
 *
 * @param props - The component props.
 * @param props.graphData - The graph data containing performance metrics.
 * @param props.types - The types of devices.
 * @param props.startDate - The start date for the performance data.
 * @param props.endDate - The end date for the performance data.
 * @param props.loading - Loading state.
 * @returns The Performance component.
 */
const Performance = (props: {
  graphData?: APIPromQL;
  types: APIDeviceType[];
  startDate: string | undefined;
  endDate: string | undefined;
  loading: boolean;
}) => {
  const t = useTranslations();
  const currentLanguage = useLocale();

  const energyChartData =
    props.graphData &&
    mergeMultiGraphData(
      props.types.map((type) =>
        parseGraphData(props.graphData, `${type}_energy`, currentLanguage, props.startDate, props.endDate)
      )
    );
  const processorTypes: APIDeviceType[] = ['Accelerator', 'CPU', 'DSP', 'FPGA', 'GPU', 'UnknownProcessor'];
  const processorGraphData =
    props.graphData &&
    mergeMultiGraphData(
      processorTypes.map((type) =>
        parseGraphData(props.graphData, `${type}_usage`, currentLanguage, props.startDate, props.endDate)
      )
    );

  return (
    <Stack>
      <Group justify='space-between'>
        <Title order={2} fz='lg'>
          {t('Performance')}
        </Title>
        <DatePicker />
      </Group>
      <Box h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Energy Consumptions')}
          data={energyChartData}
          valueFormatter={formatEnergyValue}
          stack={true}
          loading={props.loading}
        />
      </Box>
      <Group grow={true} align='strech' h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Processor Usage')}
          data={processorGraphData}
          valueFormatter={formatPercentValue}
          loading={props.loading}
        />
        <GraphView
          title={t('Memory Usage')}
          data={parseGraphData(props.graphData, 'memory_usage', currentLanguage, props.startDate, props.endDate)}
          valueFormatter={formatPercentValue}
          loading={props.loading}
        />
      </Group>
      <Group grow={true} h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Storage Usage')}
          data={parseGraphData(props.graphData, 'storage_usage', currentLanguage, props.startDate, props.endDate)}
          valueFormatter={formatPercentValue}
          loading={props.loading}
        />
        <GraphView
          title={t('Network Transfer Speed')}
          data={parseGraphData(
            props.graphData,
            'networkInterface_usage',
            currentLanguage,
            props.startDate,
            props.endDate
          )}
          valueFormatter={formatNetworkTransferValue}
          loading={props.loading}
        />
      </Group>
    </Stack>
  );
};

/**
 * Component to display resource specifications
 * @param props
 * @returns JSX.Element to display resource specifications
 */
const VolumeCards = (props: {
  /** Resources */
  resources: APIresourceForNodeDetail[];
  /** Loading state */
  loading: boolean;
}) => {
  const t = useTranslations();
  if (!props.resources) {
    return null;
  }
  // Array of volume types to display
  const Cards = deviceTypeOrder
    .map((type, index) => {
      // Aggregate the number of volumes for each type
      const typeKey = typeToVolumeKey[type];
      const volumeCount = !typeKey
        ? 0
        : props.resources
            .filter((resource) => resource.device.type === type)
            .reduce((acc, resource) => acc + (resource.device[typeKey] ?? 0), 0);
      const unit = typeToUnit(type, volumeCount);
      if (volumeCount) {
        return (
          <NumberOrVolumeCard
            key={index}
            title={_.upperFirst(type)}
            value={formatUnitValue(type, volumeCount, unit)}
            unit={unit}
            loading={props.loading}
          />
        );
      }
    })
    .filter((item) => item); // Exclude undefined
  if (!Cards.length) {
    return null;
  }
  return (
    <Stack>
      <Title order={2} fz='lg'>
        {t('Resource Specifications')}
      </Title>
      <Group gap={'1em'}>{Cards}</Group>
    </Stack>
  );
};

const ResourceList = (props: { resources: APIresourceForNodeDetail[]; loading: boolean }) => {
  const t = useTranslations();

  const selectedAccessors = ['id', 'type', 'health', 'state', 'cxlSwitchId', 'resourceAvailable'];
  return (
    <Stack>
      <Title order={2} fz='lg'>
        {t('Resources.list')}
      </Title>
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={props.resources}
        loading={props.loading}
        showAccessorSelector={false}
        showPagination={true}
      />
    </Stack>
  );
};

export default NodeDetail;
