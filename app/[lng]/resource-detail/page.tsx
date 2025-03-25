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

import { useEffect, useState } from 'react';

import { Box, Button, Group, LoadingOverlay, ScrollArea, Stack, Text, Title } from '@mantine/core';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import {
  CardLoading,
  ConfirmModal,
  DatePicker,
  GraphView,
  HorizontalTable,
  MessageBox,
  PageHeader,
  PageLink,
} from '@/shared-modules/components';
import { GRAPH_CARD_HEIGHT, LOADING_DURATION, MANAGE_RESOURCE } from '@/shared-modules/constant';
import { APIPromQL, APIresource, isAPIDeviceType } from '@/shared-modules/types';
import {
  fetcher,
  formatEnergyValue,
  formatNetworkTransferValue,
  formatPercentValue,
  parseGraphData,
} from '@/shared-modules/utils';
import { useConfirmModal, useIdFromQuery, useLoading, usePermission } from '@/shared-modules/utils/hooks';

import { AvailableToIcon, HealthToIcon, JsonTable, StateToIcon } from '@/components';

/**
 * Resource Detail Page
 *
 * @returns Page content
 */
const ResourceDetail = () => {
  const t = useTranslations();

  const resourceId = useIdFromQuery();
  const items = [
    { title: t('Resource Management') },
    { title: t('Resources.list'), href: '/cdim/res-resource-list' },
    { title: `${t('Resource Details')} <${resourceId}>` },
  ];

  // const mswInitializing = useMSW();
  const mswInitializing = false; // Not using MSW

  //** Get resource details */
  const { data, error, isValidating, mutate } = useSWRImmutable<APIresource>(
    !mswInitializing && resourceId && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources/${resourceId}`,
    fetcher
  );

  const [metricStartDate, setMetricStartDate] = useState<string>();
  const [metricEndDate, setMetricEndDate] = useState<string>();
  // Message display for constraint condition information
  const [successInfo, setSuccessInfo] = useState<{ operation: 'Exclude' | 'Include' } | undefined>(undefined);

  useEffect(() => {
    const currentDate = new Date();
    setMetricEndDate(currentDate.toISOString());
    const OneMonthBeforeDate = currentDate;

    OneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);
    setMetricStartDate(OneMonthBeforeDate.toISOString());
  }, []);

  const { graphData, graphError, graphValidating, graphMutate } = useGraphData(data, metricStartDate, metricEndDate);

  /** Function called when reload is pressed */
  const reload = () => {
    mutate();
    graphMutate();
    setSuccessInfo(undefined);
  };

  const resourceLoading = useLoading(isValidating || mswInitializing);
  const loading = useLoading(isValidating || graphValidating || mswInitializing);

  return (
    <>
      <Stack gap='xl'>
        <PageHeader pageTitle={t('Resource Details')} items={items} mutate={reload} loading={loading} />
        {/* Success message (for target inclusion/exclusion) */}
        <Messages successInfo={successInfo} setSuccessInfo={setSuccessInfo} error={error} graphError={graphError} />
        <Summary
          data={data}
          doOnSuccess={(axiosRes: AxiosResponse) => {
            // Function called on successful inclusion/exclusion configuration
            // axiosRes is the response from axios (put)
            const { available } = axiosRes.data;
            setSuccessInfo({ operation: available ? 'Include' : 'Exclude' }); // Show success dialog
            mutate(); // Retrieve data again and update display
          }}
          loading={resourceLoading}
        />
        <Performance
          data={data}
          graphData={graphData}
          metricStartDate={metricStartDate}
          metricEndDate={metricEndDate}
          loading={loading}
        />
        <DetailTable loading={resourceLoading} data={data} />
      </Stack>
    </>
  );
};

const Messages = (props: {
  successInfo: { operation: 'Exclude' | 'Include' } | undefined;
  setSuccessInfo: CallableFunction;
  error: { message: string; response: { data: { message: string } } } | undefined;
  graphError: { message: string } | undefined;
}) => {
  const t = useTranslations();
  const { successInfo, setSuccessInfo, error, graphError } = props;

  return (
    <>
      {successInfo && (
        <MessageBox
          type='success'
          title={t('The resource settings have been successfully updated to {operation}', {
            operation: t(successInfo.operation).toLowerCase(),
          })}
          message={undefined}
          close={() => setSuccessInfo(undefined)}
        />
      )}
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      {graphError && <MessageBox type='error' title={graphError.message} message={''} />}
    </>
  );
};

const useGraphData = (
  data: APIresource | undefined,
  metricStartDate: string | undefined,
  metricEndDate: string | undefined
) => {
  const energyMetric = data ? `${data.device.type}_metricEnergyJoules_reading` : undefined;
  const deviceID = data?.device.deviceID;
  /** Get graph data */
  const getUsageQuery = (deviceType: string | undefined) => {
    switch (deviceType) {
      case 'memory':
        // Memory usage rate: calculate the percentage from the capacity and round to 2 decimal places
        return `label_replace(round(({__name__=~"memory_usedMemory",job=~"${deviceID}"}/(${data?.device.capacityMiB}*1024)*100)*100)/100,"data_label","${data?.device.type}_usage","","")`;
      case 'storage':
        // Storage usage rate: calculate the percentage from the drive capacity and round to 2 decimal places
        return `label_replace(round(({__name__=~"storage_disk_amountUsedDisk",job=~"${deviceID}"}/(${data?.device.driveCapacityBytes})*100)*100)/100,"data_label","${data?.device.type}_usage","","")`;
      case 'networkInterface': {
        // Network transfer speed: get the increase in the last 1 hour and calculate the average increase per second (cannot be shorter than the Prometheus collection interval, e.g., 1s)
        const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
        const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
        return `label_replace(sum(increase({__name__=~"${bytesSent}|${bytesRecv}}",job=~"${deviceID}"}))[1h]/3600,"data_label","${data?.device.type}_usage","","")`;
      }
      default:
        return `label_replace({__name__=~"${deviceType}_usageRate",job=~"${deviceID}"},"data_label","${data?.device.type}_usage","","")`;
    }
  };
  const energyQuery = `label_replace(increase({__name__=~"${energyMetric}",job=~"${deviceID}"}[1h])/3600,"data_label","${data?.device.type}_energy","","")`;
  const usageQuery = getUsageQuery(data?.device.type);

  const {
    data: graphData,
    error: graphError,
    isValidating: graphValidating,
    mutate: graphMutate,
  } = useSWRImmutable<APIPromQL>(
    data &&
      isAPIDeviceType(data.device.type) &&
      `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range?query=${energyQuery} or ${usageQuery}&start=${metricStartDate}&end=${metricEndDate}&step=1h`,
    fetcher
  );

  return { graphData, graphError, graphValidating, graphMutate };
};

/**
 * Target inclusion/exclusion display and buttons
 *
 * @param props - The component props.
 * @returns The AvailableButton component.
 */
const AvailableButton = (props: {
  isAvailable: boolean | undefined;
  deviceId: string | undefined;
  doOnSuccess: CallableFunction;
}) => {
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const t = useTranslations();
  const { isAvailable, doOnSuccess } = props;
  const { openModal, closeModal, setError, isModalOpen, error } = useConfirmModal();
  const title = isAvailable ? t('Exclude') : t('Include');
  const availableIcon = AvailableToIcon(isAvailable ? 'Available' : 'Unavailable');
  const submitChangeEnabled = (props: { isAvailable: boolean | undefined; deviceId: string | undefined }) => {
    const reqData = { available: !isAvailable };
    axios
      .put(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources/${props.deviceId}/annotation`, reqData)
      .then((res) => {
        closeModal();
        // Show API request success message
        doOnSuccess(res);
        return;
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <>
      <ConfirmModal
        title={title}
        subTitle={`${t('Device ID')} : ${props.deviceId}`}
        message={isAvailable ? t('Do you want to exclude?') : t('Do you want to include?')}
        submit={() => submitChangeEnabled({ isAvailable: isAvailable, deviceId: props.deviceId })}
        errorTitle={t('Failed to configure {operation}', { operation: title.toLowerCase() })}
        closeModal={closeModal}
        error={error}
        isModalOpen={isModalOpen}
      />
      <Group>
        <Group gap={5}>
          {availableIcon}
          {isAvailable ? t('Included') : t('Excluded')}
        </Group>

        <Button size='xs' variant='outline' color='dark' onClick={openModal} disabled={!hasPermission}>
          <Text size='14'>{isAvailable ? t('Exclude') : t('Include')}</Text>
        </Button>
      </Group>
    </>
  );
};

/**
 * Renders the summary component for a resource.
 *
 * @param props - The component props.
 * @returns The rendered summary component.
 */
const Summary = (props: { data?: APIresource; doOnSuccess: CallableFunction; loading: boolean }) => {
  const t = useTranslations();

  let health;
  let state;
  let deviceType;
  let deviceSwitchInfo;
  let nodeIDs;
  let available;
  let deviceID;
  if (props.data) {
    health = props.data.device.status?.health;
    state = props.data.device.status?.state;
    deviceType = props.data.device.type;
    deviceSwitchInfo = props.data.device.deviceSwitchInfo;
    nodeIDs = props.data.nodeIDs;
    available = props.data.annotation.available;
    deviceID = props.data.device.deviceID;
  }

  const healthIcon = HealthToIcon(health);
  const stateIcon = StateToIcon(state);

  const tableData = [
    { columnName: t('Type'), value: _.upperFirst(deviceType) },
    {
      columnName: t('Health'),
      value: (
        <Group gap={5}>
          {healthIcon}
          {health}
        </Group>
      ),
    },
    {
      columnName: t('State'),
      value: (
        <Group gap={5}>
          {stateIcon}
          {state}
        </Group>
      ),
    },
    { columnName: t('CXL Switch'), value: deviceSwitchInfo },
    {
      columnName: t('Node'),
      value: (
        <Stack gap={0}>
          {nodeIDs?.map((nodeId) => (
            <PageLink path={'/cdim/res-node-detail'} query={{ id: nodeId }} key={nodeId}>
              {nodeId}
            </PageLink>
          ))}
        </Stack>
      ),
    },
    {
      columnName: t('Included in design'),
      value: props.data && (
        <AvailableButton isAvailable={available} deviceId={deviceID} doOnSuccess={props.doOnSuccess} />
      ),
    },
  ];
  return (
    <Stack>
      <CardLoading withBorder maw={'32em'} loading={props.loading}>
        <Text fz='sm'>{t('Device ID')}</Text>
        <Text fz='lg' fw={500}>
          {deviceID}
        </Text>
      </CardLoading>
      <HorizontalTable tableData={tableData} loading={props.loading} />
    </Stack>
  );
};

/**
 * Performance component displays the performance metrics for a resource.
 *
 * @param props - The component props.
 * @returns The Performance component.
 */
const Performance = (props: {
  data?: APIresource;
  graphData?: APIPromQL;
  metricStartDate?: string;
  metricEndDate?: string;
  loading: boolean;
}) => {
  const t = useTranslations();
  const currentLanguage = useLocale();

  const isNoData = !props.graphData?.data.result.length;

  return (
    <Stack>
      <Group justify='space-between'>
        <Title order={2} fz='lg'>
          {t('Performance')}
        </Title>
        <DatePicker />
      </Group>
      {isNoData ? (
        <Box pos='relative'>
          <Text>{t('No data')}</Text>
          <LoadingOverlay
            visible={props.loading}
            loaderProps={{ size: 'sm' }}
            transitionProps={{ duration: LOADING_DURATION }}
          />
        </Box>
      ) : (
        <Group gap='1em' grow={true} h={GRAPH_CARD_HEIGHT}>
          <GraphView
            title={t('Energy Consumptions')}
            data={parseGraphData(
              props.graphData,
              `${props.data?.device.type}_energy`,
              currentLanguage,
              props.metricStartDate,
              props.metricEndDate
            )}
            valueFormatter={formatEnergyValue}
            loading={props.loading}
          />
          {props.data?.device.type === 'networkInterface' ? (
            <GraphView
              title={t('Network Transfer Speed')}
              data={parseGraphData(
                props.graphData,
                `${props.data?.device.type}_usage`,
                currentLanguage,
                props.metricStartDate,
                props.metricEndDate
              )}
              valueFormatter={formatNetworkTransferValue}
              loading={props.loading}
            />
          ) : (
            <GraphView
              title={t('Usage')}
              data={parseGraphData(
                props.graphData,
                `${props.data?.device.type}_usage`,
                currentLanguage,
                props.metricStartDate,
                props.metricEndDate
              )}
              valueFormatter={formatPercentValue}
              loading={props.loading}
            />
          )}
        </Group>
      )}
    </Stack>
  );
};

/**
 * Renders a detail table component.
 *
 * @component
 * @param props - The component props.
 * @returns The rendered detail table component.
 */
const DetailTable = (props: { loading: boolean; data?: any[] | { [key: string]: any } }) => {
  const t = useTranslations();

  return (
    <Stack>
      <Title order={2} fz='lg'>
        {t('Details')}
      </Title>
      <CardLoading withBorder loading={props.loading}>
        <ScrollArea h={500} style={{ resize: 'vertical' }} type={'always'} pr={'sm'}>
          <JsonTable json={props.data} />
        </ScrollArea>
      </CardLoading>
    </Stack>
  );
};

export default ResourceDetail;
