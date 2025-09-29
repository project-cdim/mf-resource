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

import { useState } from 'react';

import { ScrollArea, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';
import { AxiosResponse } from 'axios';

import { CardLoading, MessageBox, PageHeader } from '@/shared-modules/components';
import { APIresource } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils';
import { useIdFromQuery, useLoading, useMetricDateRange } from '@/shared-modules/utils/hooks';

import { JsonTable, ResourceDetailPerformance, ResourceDetailSummary } from '@/components';
import { useGraphData } from '@/utils/hooks/resource-detail/useGraphData';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';

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

  //** Get resource group data */
  const {
    error: resourceGroupsError,
    validating: resourceGroupsValidating,
    mutate: resourceGroupsMutate,
  } = useResourceGroupsData(); // Fetch resource groups data

  const [successInfo, setSuccessInfo] = useState<
    { operation: 'Exclude' | 'Include' | 'UpdateResourceGroup' } | undefined
  >(undefined);
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    return [oneMonthAgo, today];
  });
  const [metricStartDate, metricEndDate] = useMetricDateRange(dateRange);

  const { graphData, graphError, graphValidating, graphMutate } = useGraphData(data, metricStartDate, metricEndDate);

  /** Function called when reload is pressed */
  const reload = () => {
    mutate();
    graphMutate();
    resourceGroupsMutate();
    setSuccessInfo(undefined);
  };

  const loading = useLoading(isValidating || mswInitializing);
  const summaryLoading = useLoading(isValidating || resourceGroupsValidating || mswInitializing);
  const performanceLoading = useLoading(isValidating || graphValidating || mswInitializing);

  return (
    <>
      <Stack gap='xl'>
        <PageHeader pageTitle={t('Resource Details')} items={items} mutate={reload} loading={loading} />
        {/* Success message (for target inclusion/exclusion) */}
        <Messages
          successInfo={successInfo}
          setSuccessInfo={setSuccessInfo}
          error={error}
          graphError={graphError}
          resourceGroupsError={resourceGroupsError}
        />
        <ResourceDetailSummary
          data={data}
          doOnSuccess={(axiosResOrOperation: AxiosResponse | { operation: string }) => {
            // Branch processing based on parameter type: AxiosResponse or operation object
            if ('operation' in axiosResOrOperation) {
              // Object case (e.g., for resource group update)
              setSuccessInfo({
                operation: axiosResOrOperation.operation as 'Exclude' | 'Include' | 'UpdateResourceGroup',
              });
              mutate();
            } else {
              // AxiosResponse case (e.g., for Available change)
              const { available } = axiosResOrOperation.data;
              setSuccessInfo({ operation: available ? 'Include' : 'Exclude' });
              mutate();
            }
          }}
          loading={summaryLoading}
        />
        <ResourceDetailPerformance
          data={data}
          graphData={graphData}
          metricStartDate={metricStartDate}
          metricEndDate={metricEndDate}
          loading={performanceLoading}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <DetailTable loading={loading} data={data} />
      </Stack>
    </>
  );
};

const Messages = (props: {
  successInfo: { operation: 'Exclude' | 'Include' | 'UpdateResourceGroup' } | undefined;
  setSuccessInfo: CallableFunction;
  error: { message: string; response: { data: { message: string } } } | undefined;
  resourceGroupsError: { message: string } | undefined;
  graphError: { message: string } | undefined;
}) => {
  const t = useTranslations();
  const { successInfo, setSuccessInfo, error, graphError } = props;

  return (
    <>
      {successInfo && (
        <MessageBox
          type='success'
          title={
            successInfo.operation === 'UpdateResourceGroup'
              ? t('The resource group has been successfully {operation}', {
                  operation: t('Edit').toLowerCase(),
                })
              : t('The resource settings have been successfully updated to {operation}', {
                  operation: t(successInfo.operation).toLowerCase(),
                })
          }
          message={undefined}
          close={() => setSuccessInfo(undefined)}
        />
      )}
      {error && <MessageBox type='error' title={error.message} message={error.response?.data?.message || ''} />}
      {/* Resource group error */}
      {props.resourceGroupsError && <MessageBox type='error' title={props.resourceGroupsError.message} message={''} />}
      {/* Graph error */}
      {graphError && <MessageBox type='error' title={graphError.message} message={''} />}
    </>
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
