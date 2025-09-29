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

import { Stack, Text, Title, Textarea } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { CardLoading, DatetimeString, HorizontalTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';
import { useIdFromQuery, useLoading } from '@/shared-modules/utils/hooks';

import { ResourceListTable, useFormatResourceListTableData } from '@/components';
import { APIResourceGroup, APPResource } from '@/types';

/**
 * Resource Group Detail Page
 *
 * @returns Page content
 */
const ResourceGroupDetail = () => {
  const t = useTranslations();
  const groupId = useIdFromQuery();
  const items = getItems(t, groupId);

  // const mswInitializing = useMSW();
  const mswInitializing = false; // Do not use MSW

  const { data, error, isValidating, mutate } = useSWRImmutable<APIResourceGroup>(
    groupId && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${groupId}`,
    fetcher
  );

  const { formattedData, rgError, rgIsValidating, rgMutate } = useFormatResourceListTableData(data?.resources);

  const loading = useLoading(isValidating || mswInitializing);

  const tableData = getTableData(t, data);
  return (
    <>
      <Stack gap='xl'>
        <PageHeader
          pageTitle={t('Resource Group Details')}
          items={items}
          mutate={() => {
            mutate();
            rgMutate();
          }}
          loading={loading || rgIsValidating}
        />
        <Message error={error} rgError={rgError} />
        <CardLoading withBorder maw={'32em'} loading={loading}>
          <Text fz='sm'>{t('Name')}</Text>
          <Text fz='lg' fw={500}>
            {data?.name}
          </Text>
        </CardLoading>
        <HorizontalTable tableData={tableData} loading={loading} />
        <ResourceList resources={formattedData} loading={loading || rgIsValidating} />
      </Stack>
    </>
  );
};

const Message = (props: { error: any; rgError: any }) => {
  return (
    <>
      {props.error && (
        <MessageBox type='error' title={props.error.message} message={props.error.response?.data.message || ''} />
      )}
      {props.rgError && (
        <MessageBox type='error' title={props.rgError.message} message={props.rgError.response?.data.message || ''} />
      )}
    </>
  );
};

const getItems = (t: any, groupId: string) => [
  { title: t('Resource Management') },
  { title: t('Resource Groups'), href: '/cdim/res-resource-group-list' },
  { title: `${t('Resource Group Details')} <${groupId}>` },
];

const getTableData = (t: any, data: APIResourceGroup | undefined) => [
  {
    columnName: t('Description'),
    value: <Textarea value={data?.description || ''} readOnly autosize maxRows={5} variant='unstyled' />,
  },
  { columnName: t('ID'), value: data?.id },
  { columnName: t('Created'), value: <DatetimeString date={data && new Date(data.createdAt)} /> },
  { columnName: t('Updated'), value: <DatetimeString date={data && new Date(data.updatedAt)} /> },
];

const ResourceList = (props: { resources: APPResource[]; loading: boolean }) => {
  const t = useTranslations();

  const selectedAccessors = [
    'id',
    'type',
    'health',
    'state',
    'detected',
    'cxlSwitchId',
    'nodeIDs',
    'resourceAvailable',
  ];

  return (
    <Stack>
      <Title order={2} fz='lg'>
        {t('Resources.list')}
      </Title>
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={props.resources}
        loading={props.loading}
        showAccessorSelector={true}
        showPagination={true}
      />
    </Stack>
  );
};

export default ResourceGroupDetail;
