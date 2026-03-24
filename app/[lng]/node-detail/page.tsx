/*
 * Copyright 2025-2026 NEC Corporation.
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

import React, { useMemo, useState } from 'react';

import { Box, Group, Stack, Text, Title } from '@mantine/core';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { CardLoading, GraphView, HorizontalTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { GRAPH_CARD_HEIGHT, deviceTypeOrder } from '@/shared-modules/constant';
import styles from '@/shared-modules/styles/styles.module.css';
import {
  APIDevicePowerState,
  APIDeviceType,
  APIPromQL,
  APInode,
  APIresource,
  APIresourceForNodeDetail,
} from '@/shared-modules/types';
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
  createPromQLParams,
} from '@/shared-modules/utils';
import { useIdFromQuery, useLoading, useMetricDateRange } from '@/shared-modules/utils/hooks';
import { getStepFromRange } from '@/shared-modules/utils/graphParsers';
import { DisplayPeriodPicker, PowerStateToIcon, ResourceListTable, useFormatResourceListTableData } from '@/components';
import { APPResource } from '@/types';

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

  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    return [oneMonthAgo, today];
  });
  const [metricStartDate, metricEndDate] = useMetricDateRange(dateRange);

  const [storageError, setStorageError] = useState<Error | undefined>();
  const { data, error, isValidating, mutate } = useSWRImmutable<APInode>(
    nodeId && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/nodes/${nodeId}`,
    fetcher
  );

  // NOTE: According to the backend API specification, there is a premise that each resource can only belong to one node.
  //       So nodeIDs will always be an array with a parent node id.
  const resources: APIresource[] = useMemo(
    () =>
      data?.resources.map((resource) => ({
        ...resource,
        nodeIDs: [nodeId],
      })) ?? [],
    [data, nodeId]
  );

  const { formattedData, rgError, rgIsValidating, rgMutate } = useFormatResourceListTableData(resources);

  const { graphData, graphError, graphMutate, graphValidating, deviceTypes } = useGraphData(
    data,
    metricStartDate,
    metricEndDate
  );

  /** Function called when reload button is pressed */
  const reload = () => {
    mutate();
    rgMutate();
    graphMutate();
  };

  const nodeLoading = useLoading(isValidating);
  const loading = useLoading(isValidating || graphValidating);

  return (
    <>
      <Stack gap='xl'>
        <PageHeader pageTitle={t('Node Details')} items={items} mutate={reload} loading={loading || rgIsValidating} />

        {storageError && <MessageBox type='error' title={storageError.message} message={''} />}
        <Messages error={error} graphError={graphError} rgError={rgError} />

        <Summary data={data} loading={nodeLoading} />
        {/* Resource Specifications */}
        <VolumeCards resources={data?.resources as APIresource[]} loading={nodeLoading} />
        <Performance
          graphData={graphData}
          types={deviceTypes}
          startDate={metricStartDate}
          endDate={metricEndDate}
          loading={loading}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <ResourceList
          resources={formattedData}
          loading={nodeLoading || rgIsValidating}
          setStorageError={setStorageError}
        />
      </Stack>
    </>
  );
};

const Messages = (props: { error: any; graphError: any; rgError: any }) => {
  const { error, graphError, rgError } = props;
  return (
    <>
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      {graphError && <MessageBox type='error' title={graphError.message} message={''} />}
      {rgError && <MessageBox type='error' title={rgError.message} message={rgError.response?.data.message || ''} />}
    </>
  );
};

const useGraphData = (data: APInode | undefined, metricStartDate: string, metricEndDate: string) => {
  // const [graphData, setGraphData] = useState<APIPromQL | undefined>(undefined);
  // const [graphError, setGraphError] = useState<Error | null>(null);
  // const [isValidating, setIsValidating] = useState<boolean>(false);

  /** Get graph data */
  // List of resource IDs under the node (pipe-separated)
  const deviceIds = data?.resources.map((resource) => resource.device.deviceID).join('|');
  // List of device types
  const deviceTypes: APIDeviceType[] = [...new Set(data?.resources.map((resource) => resource.device.type))];

  // Calculate step and window using getStepFromRange for consistency
  const step = getStepFromRange(metricStartDate, metricEndDate);

  /** Create queries to get energy consumption (total difference) for each type */
  const makeEnergyQuery = (): string => {
    const baseString = `label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~"${deviceIds}"}[${step}])/3600),"data_label","<type>_energy","","")`;
    const replacedStrings = deviceTypes.map((type) => baseString.replace(/<type>/g, type));
    return replacedStrings.join(' or ');
  };
  /** Create queries to get processor usage (average) for each processor type */
  const makeProcessorUsageQuery = (): string => {
    const processorTypes = deviceTypes.filter((type) =>
      ['Accelerator', 'CPU', 'DSP', 'FPGA', 'GPU', 'UnknownProcessor'].includes(type)
    );
    const baseString = `label_replace(avg({__name__=~"<type>_usageRate",job=~"${deviceIds}"}[${step}]),"data_label","<type>_usage","","")`;
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
      : `label_replace(round((sum({__name__=~"memory_usedMemory",job=~"${deviceIds}"}[${step}])/(${sumCapacityMiB}*1024)*100)*100)/100,"data_label","memory_usage","","")`;
  /** Get storage usage (average) query
      Calculate the percentage from the capacity and round to 2 decimal places */
  const sumDriveCapacityBytes = data
    ? data.resources
        .filter((resource) => resource.device.type === 'storage')
        .reduce((acc, resource) => acc + (resource.device.driveCapacityBytes ?? 0), 0)
    : 0;
  const usageStorageQuery =
    deviceTypes.includes('storage') && sumDriveCapacityBytes
      ? `label_replace(round((sum({__name__=~"storage_disk_amountUsedDisk",job=~"${deviceIds}"}[${step}])/(${sumDriveCapacityBytes})*100)*100)/100,"data_label","storage_usage","","")`
      : '';
  /** Get network transfer speed (total) query
     Get the increase per hour and calculate the average increase per second (cannot be shorter than the collection interval of Prometheus, such as 1s) */
  const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
  const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
  const usageNetworkInterfaceQuery = deviceTypes.includes('networkInterface')
    ? `label_replace(sum(rate({__name__=~"${bytesSent}|${bytesRecv}",job=~"${deviceIds}"}[${step}])),"data_label","networkInterface_usage","","")`
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

  // Create SWR key that includes metricStartDate and metricEndDate for re-fetching when they change
  const swrKey = data
    ? [
        `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`,
        performanceQueries,
        metricStartDate,
        metricEndDate,
        step,
      ]
    : null;

  const getParams = () => createPromQLParams(performanceQueries, metricStartDate, metricEndDate, step);

  const {
    data: graphData,
    error: graphError,
    mutate: graphMutate,
    isValidating,
  } = useSWRImmutable<APIPromQL>(swrKey, ([url]: [string, string, string | undefined, string | undefined, string]) =>
    fetcherForPromqlByPost(url, getParams())
  );

  return { graphData, graphError, graphMutate, graphValidating: isValidating, deviceTypes };
};

/**
 * Helper function to get node power state from CPU resource
 */
const getNodePowerState = (data: APInode | undefined): APIDevicePowerState | undefined => {
  const cpuResource = data?.resources.find(
    (resource) => resource.device.deviceID === data?.id && resource.device.type === 'CPU'
  );
  return cpuResource?.device.powerState;
};

/**
 * Helper function to calculate resource statistics for a node
 */
const calculateResourceStats = (data: APInode | undefined) => {
  if (!data) {
    return {
      numberOfResources: undefined,
      numberOfDisabledResources: undefined,
      numberOfWarningResources: undefined,
      numberOfCriticalResources: undefined,
      numberOfUnavailableResources: undefined,
      numberOfPowerOffResources: undefined,
    };
  }

  return {
    numberOfResources: data.resources.length,
    numberOfDisabledResources: data.resources.filter((item) => item.device.status.state === 'Disabled').length,
    numberOfWarningResources: data.resources.filter((item) => item.device.status.health === 'Warning').length,
    numberOfCriticalResources: data.resources.filter((item) => item.device.status.health === 'Critical').length,
    numberOfUnavailableResources: data.resources.filter(
      (item) => item.deviceUnit.annotation.systemItems.available === false
    ).length,
    numberOfPowerOffResources: data.resources.filter((item) => item.device.powerState === 'Off').length,
  };
};

/**
 * Get class name based on value and style
 * @param value - The value to check
 * @param styleClass - The style class to return if value is valid
 * @returns The class name or empty string
 */
const getClassNameIfValid = (value: number | undefined, styleClass: string): string => {
  return value !== 0 && value !== undefined ? styleClass : '';
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

  const id = data?.id;
  const powerState = getNodePowerState(data);
  const {
    numberOfResources,
    numberOfDisabledResources,
    numberOfWarningResources,
    numberOfCriticalResources,
    numberOfUnavailableResources,
    numberOfPowerOffResources,
  } = calculateResourceStats(data);

  const tableData = [
    {
      columnName: t('Node ID'),
      value: data && <Text>{id}</Text>,
    },
    {
      columnName: t('Power State'),
      value: data && (
        <Group gap={5}>
          <PowerStateToIcon powerState={powerState} target='Node' />
          {t.has(powerState) ? t(powerState) : powerState}
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      <HorizontalTable tableData={tableData} loading={loading} />
      <Title order={2} fz='lg'>
        {t('Resources.number')}
      </Title>
      <Group gap={'1em'}>
        <NumberOrVolumeCard title={t('Total')} value={numberOfResources} loading={loading} />
        <NumberOrVolumeCard
          title={t('Power Off')}
          value={numberOfPowerOffResources}
          loading={loading}
          className={getClassNameIfValid(numberOfPowerOffResources, styles.gray)}
        />
        <NumberOrVolumeCard
          title={t('Disabled')}
          value={numberOfDisabledResources}
          loading={loading}
          className={getClassNameIfValid(numberOfDisabledResources, styles.red)}
        />
        <NumberOrVolumeCard
          title={t('Warning')}
          value={numberOfWarningResources}
          loading={loading}
          className={getClassNameIfValid(numberOfWarningResources, styles.yellow)}
        />
        <NumberOrVolumeCard
          title={t('Critical')}
          value={numberOfCriticalResources}
          loading={loading}
          className={getClassNameIfValid(numberOfCriticalResources, styles.red)}
        />
        <NumberOrVolumeCard
          title={t('Under Maintenance')}
          value={numberOfUnavailableResources}
          loading={loading}
          className={getClassNameIfValid(numberOfUnavailableResources, styles.gray)}
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
export type PerformanceProps = {
  graphData?: APIPromQL;
  types: APIDeviceType[];
  startDate: string | undefined;
  endDate: string | undefined;
  loading: boolean;
  dateRange: [Date, Date];
  setDateRange: (range: [Date, Date]) => void;
};

const Performance = (props: PerformanceProps) => {
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
        <DisplayPeriodPicker value={props.dateRange} onChange={props.setDateRange} />
      </Group>
      <Box h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Energy Consumptions')}
          data={energyChartData}
          valueFormatter={formatEnergyValue}
          stack={true}
          loading={props.loading}
          dateRange={props.dateRange}
          showMenu={true}
        />
      </Box>
      <Group grow={true} align='strech' h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Processor Usage')}
          data={processorGraphData}
          valueFormatter={formatPercentValue}
          loading={props.loading}
          dateRange={props.dateRange}
          showMenu={true}
        />
        <GraphView
          title={t('Memory Usage')}
          data={parseGraphData(props.graphData, 'memory_usage', currentLanguage, props.startDate, props.endDate)}
          valueFormatter={formatPercentValue}
          loading={props.loading}
          dateRange={props.dateRange}
          showMenu={true}
        />
      </Group>
      <Group grow={true} h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Storage Usage')}
          data={parseGraphData(props.graphData, 'storage_usage', currentLanguage, props.startDate, props.endDate)}
          valueFormatter={formatPercentValue}
          loading={props.loading}
          dateRange={props.dateRange}
          showMenu={true}
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
          dateRange={props.dateRange}
          showMenu={true}
        />
      </Group>
    </Stack>
  );
};

/**
 * Calculate volume count for a specific device type
 * @param resources - Array of resources
 * @param type - Device type
 * @returns Volume count
 */
const calculateVolumeCount = (resources: APIresourceForNodeDetail[], type: APIDeviceType): number => {
  const typeKey = typeToVolumeKey[type];
  if (typeKey === false) {
    return 0;
  }
  return resources
    .filter((resource) => resource.device.type === type)
    .reduce((acc, resource) => {
      const value = resource.device[typeKey as keyof typeof resource.device];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
};

/**
 * Create a volume card component for a device type
 * @param type - Device type
 * @param index - Index for key
 * @param resources - Array of resources
 * @param loading - Loading state
 * @returns Volume card component or undefined
 */
const createVolumeCard = (
  type: APIDeviceType,
  index: number,
  resources: APIresourceForNodeDetail[],
  loading: boolean
): React.ReactElement | undefined => {
  const volumeCount = calculateVolumeCount(resources, type);
  const unit = typeToUnit(type, volumeCount);
  if (volumeCount) {
    return (
      <NumberOrVolumeCard
        key={index}
        title={_.upperFirst(type)}
        value={formatUnitValue(type, volumeCount, unit)}
        unit={unit}
        loading={loading}
      />
    );
  }
  return undefined;
};

/**
 * Component to display resource specifications
 * @param props
 * @returns JSX.Element to display resource specifications
 */
const VolumeCards = (props: {
  /** Resources */
  resources?: APIresourceForNodeDetail[];
  /** Loading state */
  loading: boolean;
}) => {
  const t = useTranslations();
  if (!props.resources || props.resources.length === 0) {
    return null;
  }
  // Array of volume types to display
  const Cards = deviceTypeOrder
    .map((type, index) => createVolumeCard(type, index, props.resources!, props.loading))
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

const ResourceList = (props: {
  resources: APPResource[];
  loading: boolean;
  setStorageError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}) => {
  const t = useTranslations();

  // Default selected accessors
  const defaultAccessors = [
    'id',
    'type',
    'status',
    'powerState',
    // 'health',          // Hidden by default
    // 'state',           // Hidden by default
    'detected',
    'resourceAvailable',
    'resourceGroups',
    'placement',
    'cxlSwitch',
    // 'nodeIDs',         // Hidden for node detail
    // 'composite',       // Hidden by default
  ];

  /** Key for storing column settings */
  const storeColumnsKey = 'node-details.resource-list';

  return (
    <Stack>
      <Title order={2} fz='lg'>
        {t('Resources.list')}
      </Title>
      <ResourceListTable
        data={props.resources}
        loading={props.loading}
        showAccessorSelector={true}
        showPagination={true}
        defaultAccessors={defaultAccessors}
        storeColumnsKey={storeColumnsKey}
        tableName={t('Resources.list')}
        onStorageError={props.setStorageError}
      />
    </Stack>
  );
};

export default NodeDetail;
