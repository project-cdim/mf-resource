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

import React, { useEffect, useState } from 'react';

import { Button, Grid, Group, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader } from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';

import { APIrack } from '@/types';

import { ChassisDetail, RackLayout, ResourceListTable, useFormatResourceListTableData } from '@/components';
import { useRackIdFromQuery } from '@/utils/hooks/useRackIdFromQuery';
import { RackChassisProvider, useRackChassisContext } from './RackChassisContext';

/**
 * Renders the Rack page component.
 * @returns The Rack page component.
 */
const Rack = () => {
  const t = useTranslations();
  const [queryRackId, queryChassisId] = useRackIdFromQuery();
  // const rackId = !queryRackId ? `${process.env.NEXT_PUBLIC_RACK_ELEVATIONS_ID}` || 'rack11' : queryRackId;
  const rackId = queryRackId || process.env.NEXT_PUBLIC_RACK_ELEVATIONS_ID || 'rack11';
  const items = [{ title: t('Resource Management') }, { title: t('Rack Elevations') }];

  const {
    data: rackData,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable<APIrack>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/racks/${rackId}?detail=true`,
    fetcher
  );

  const loading = useLoading(isValidating);

  return (
    <RackChassisProvider rackData={rackData}>
      <RackContent
        rackData={rackData}
        error={error}
        loading={loading}
        items={items}
        mutate={mutate}
        queryChassisId={queryChassisId || null}
      />
    </RackChassisProvider>
  );
};

/** Props for RackContent component */
type RackContentProps = {
  rackData: APIrack | undefined;
  error: any;
  loading: boolean;
  items: { title: string }[];
  mutate: () => void;
  queryChassisId: string | null;
};

/**
 * Inner content component for Rack page that uses RackChassisContext.
 * Separated to allow context consumption.
 *
 * @param props - RackContent props
 * @returns RackContent component
 */
const RackContent = ({ rackData, error, loading, items, mutate, queryChassisId }: RackContentProps) => {
  const t = useTranslations();

  const [storageError, setStorageError] = useState<Error | undefined>();
  const { setSelectedChassisId } = useRackChassisContext();

  useEffect(() => {
    setSelectedChassisId(queryChassisId || undefined);
  }, [queryChassisId, setSelectedChassisId]);

  return (
    <Stack gap='xl'>
      <Group justify='space-between' align='flex-end'>
        <PageHeader pageTitle={t('Rack Elevations')} items={items} mutate={mutate} loading={loading} />
        <Group>
          <div>
            {t('Rack Name')} : {rackData?.name || ''}
          </div>
          <Button
            variant='outline'
            size='xs'
            data-disabled
            style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}
            disabled={true}
          >
            {t('Import')}
          </Button>
        </Group>
      </Group>

      {storageError && <MessageBox type='error' title={storageError.message} message={''} />}
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}

      <Grid>
        <Grid.Col span={7}>
          <RackLayout loading={loading} chassisList={rackData?.chassis} />
        </Grid.Col>
        <Grid.Col span={5}>
          <ChassisDetail loading={loading} chassisList={rackData?.chassis} />
        </Grid.Col>
      </Grid>

      <RackResourceList loading={loading} setStorageError={setStorageError} />
    </Stack>
  );
};

/** Props for the RackResourceList component. */
type PropsRackResourceList = {
  loading: boolean;
  setStorageError: React.Dispatch<React.SetStateAction<Error | undefined>>;
};

/**
 * Renders a list of resources in a rack.
 * Uses RackChassisContext to access selected chassis and its resources.
 *
 * @param props - Component props
 * @returns List of resources in a rack.
 */
const RackResourceList = ({ loading, setStorageError }: PropsRackResourceList) => {
  const t = useTranslations();
  const { selectedChassis, selectedChassisResources } = useRackChassisContext();
  const { formattedData, rgError, rgIsValidating } = useFormatResourceListTableData(selectedChassisResources);

  /** Default accessors for columns */
  const defaultAccessors = [
    'id',
    'type',
    'status',
    'powerState',
    // 'health',             // Hidden by default
    // 'state',              // Hidden by default
    'detected',
    'resourceAvailable',
    'resourceGroups',
    // 'placement',          // Hidden for rack resource list
    'cxlSwitch',
    'nodeIDs',
    // 'composite',          // Hidden by default
  ];

  /** Key for storing column settings */
  const storeColumnsKey = 'rack-elevation.resource-list';

  return (
    <Stack>
      {rgError && <MessageBox type='error' title={rgError.message} message={rgError.response?.data.message || ''} />}
      <Title order={2} fz='lg'>
        {t('Resources in {target}', { target: selectedChassis?.name || t('Selected chassis') })}
      </Title>
      <ResourceListTable
        data={formattedData}
        loading={loading || rgIsValidating}
        defaultAccessors={defaultAccessors}
        storeColumnsKey={storeColumnsKey}
        tableName={t('Resources.list')}
        onStorageError={setStorageError}
      />
    </Stack>
  );
};

export default Rack;
