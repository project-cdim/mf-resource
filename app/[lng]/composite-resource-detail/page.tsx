/*
 * Copyright 2026 NEC Corporation.
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

import { Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';
import { AxiosResponse } from 'axios';

import { CardLoading, MessageBox, PageHeader } from '@/shared-modules/components';
import { APIDeviceUnit } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils';
import { useIdFromQuery, useLoading } from '@/shared-modules/utils/hooks';

import { CompositeResourceDetailSummary, ResourceListTable, useFormatResourceListTableData } from '@/components';
import { APPResource } from '@/types';

/**
 * Composite Resource Detail Page
 *
 * @returns Page content
 */
const CompositeResourceDetail = () => {
  const t = useTranslations();
  const unitId = useIdFromQuery();
  const items = [
    { title: t('Resource Management') },
    { title: t('Resources.list'), href: '/cdim/res-resource-list' },
    { title: `${t('Composite Resource Details')} <${unitId}>` },
  ];

  const [successInfo, setSuccessInfo] = useState<{ operation: 'Start' | 'End' } | undefined>(undefined);
  const [storageError, setStorageError] = useState<Error | undefined>();

  // Get device unit details
  const { data, error, isValidating, mutate } = useSWRImmutable<APIDeviceUnit>(
    unitId && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/device-units/${unitId}?detail=true`,
    fetcher
  );

  // Convert APIresourceForDeviceUnit[] to APIresource[] by adding deviceUnit property
  const resourcesWithDeviceUnit = data?.resources.map((resource) => ({
    ...resource,
    deviceUnit: {
      id: data.id,
      annotation: data.annotation,
    },
  }));

  // Format resources for table display
  const { formattedData, rgError, rgIsValidating, rgMutate } = useFormatResourceListTableData(resourcesWithDeviceUnit);

  /** Function called when reload is pressed */
  const reload = () => {
    mutate();
    rgMutate();
    setSuccessInfo(undefined);
  };

  const loading = useLoading(isValidating);

  return (
    <Stack gap='xl'>
      <PageHeader
        pageTitle={t('Composite Resource Details')}
        items={items}
        mutate={reload}
        loading={loading || rgIsValidating}
      />
      {/* Success message (for maintenance start/end) */}
      <Messages successInfo={successInfo} setSuccessInfo={setSuccessInfo} error={error} rgError={rgError} />
      {storageError && <MessageBox type='error' title={storageError.message} message={''} />}

      <CardLoading withBorder maw={'32em'} loading={loading}>
        <Text fz='sm'>{t('Composite Resource ID')}</Text>
        <Text fz='lg' fw={500}>
          {data?.id}
        </Text>
      </CardLoading>
      <CompositeResourceDetailSummary
        data={data}
        doOnSuccess={(axiosRes: AxiosResponse) => {
          const { available } = axiosRes.data;
          setSuccessInfo({ operation: available ? 'End' : 'Start' });
          mutate();
          rgMutate();
        }}
        loading={loading}
      />
      <ResourceList resources={formattedData} loading={loading || rgIsValidating} setStorageError={setStorageError} />
    </Stack>
  );
};

/**
 * Renders messages component for success and error messages
 *
 * @param props - The component props
 * @returns The Messages component
 */
/* eslint-disable complexity */
const Messages = (props: {
  successInfo: { operation: 'Start' | 'End' } | undefined;
  setSuccessInfo: React.Dispatch<React.SetStateAction<{ operation: 'Start' | 'End' } | undefined>>;
  error: any;
  rgError: any;
}) => {
  const t = useTranslations();

  const successMessage =
    props.successInfo?.operation === 'Start'
      ? t('The settings have been successfully updated to {operation} maintenance', {
          operation: t('Start').toLowerCase(),
        })
      : t('The settings have been successfully updated to {operation} maintenance', {
          operation: t('End').toLowerCase(),
        });

  return (
    <>
      {/* Success message */}
      {props.successInfo && (
        <MessageBox type='success' title={successMessage} message={''} close={() => props.setSuccessInfo(undefined)} />
      )}
      {/* Device unit error */}
      {props.error && (
        <MessageBox type='error' title={props.error.message} message={props.error.response?.data?.message || ''} />
      )}
      {/* Resource group error */}
      {props.rgError && (
        <MessageBox type='error' title={props.rgError.message} message={props.rgError.response?.data?.message || ''} />
      )}
    </>
  );
};

/**
 * Renders the resource list component
 *
 * @param props - The component props
 * @returns The ResourceList component
 */
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
    // 'health',             // Hidden by default
    // 'state',              // Hidden by default
    'detected',
    // 'resourceAvailable',  // Hidden for composite resource detail
    'resourceGroups',
    // 'placement',          // Hidden for composite resource detail
    // 'cxlSwitch',        // Hidden for composite resource detail
    'nodeIDs',
    // 'composite',          // Hidden by default and for composite resource detail
  ];

  /** Key for storing column settings */
  const storeColumnsKey = 'composite-resource-details.resource-list';

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

export default CompositeResourceDetail;
