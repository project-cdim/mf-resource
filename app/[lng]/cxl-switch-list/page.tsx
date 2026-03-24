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

import { useMemo } from 'react';

import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader, CustomDataTable } from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';
import { useLoading, useTableSettings } from '@/shared-modules/utils/hooks';

import { APIcxlswitches, APPCxlSwitch } from '@/types';

import { useCxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';
import { useColumns } from '@/utils/hooks/cxl-switch-list/useColumns';

/**
 * CXL Switch List Page
 *
 * @returns Page content
 */
const CxlSwitchList = () => {
  const t = useTranslations();
  const { data, error, isValidating, mutate } = useSWRImmutable<APIcxlswitches>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/cxlswitches`,
    fetcher
  );
  const loading = useLoading(isValidating);

  /** Data retrieval and update */
  const formattedData = useMemo(() => {
    // Convert the retrieved data for DataTable
    // Set [] if data cannot be retrieved
    return (
      data?.CXLSwitches.map((cxlSwitch) => ({
        id: `${cxlSwitch.fabricID}-${cxlSwitch.cxlSwitchID}`,
        device: {
          connected: cxlSwitch.resources.length,
          unallocated: cxlSwitch.resources.filter((item) => item.nodeIDs.length === 0).length,
          disabled: cxlSwitch.resources.filter((item) => item.device.status.state === 'Disabled').length,
          warning: cxlSwitch.resources.filter((item) => item.device.status.health === 'Warning').length,
          critical: cxlSwitch.resources.filter((item) => item.device.status.health === 'Critical').length,
          resourceUnavailable: cxlSwitch.resources.filter((item) => item.annotation.available === false).length,
        },
      })) || []
    );
  }, [data]);

  /** Default accessors for columns */
  const defaultAccessors = useMemo(
    () => [
      'id',
      'device.connected',
      'device.unallocated',
      'device.disabled',
      'device.warning',
      'device.critical',
      'device.resourceUnavailable',
    ],
    []
  );

  // Column definitions with labels
  const columnDefinitions = useMemo(
    () => [
      { id: 'id', label: 'ID', fixed: true },
      { id: 'device.connected', label: t('Resources.number'), fixed: false },
      { id: 'device.unallocated', label: t('Unallocated Resources'), fixed: false },
      { id: 'device.disabled', label: t('Disabled Resources'), fixed: false },
      { id: 'device.warning', label: t('Warning Resources'), fixed: false },
      { id: 'device.critical', label: t('Critical Resources'), fixed: false },
      { id: 'device.resourceUnavailable', label: t('Maintenance Resources'), fixed: false },
    ],
    [t]
  );

  const { columns, defaultColumns, selectedAccessors, handleSaveTableSettings, storageError } = useTableSettings(
    columnDefinitions,
    defaultAccessors,
    'cxl-switch-list.cxl-switch-list'
  );

  const items = [{ title: t('Resource Management') }, { title: t('CXL Switches') }];

  /** Custom hook for DataTable */
  const { records, columns: tableColumns } = useColumnsAndRecords(formattedData, selectedAccessors);

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('CXL Switches')} items={items} mutate={mutate} loading={loading} />
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      {storageError && <MessageBox type='error' title={storageError.message} message='' />}

      <CustomDataTable
        records={records}
        columns={tableColumns}
        loading={loading}
        defaultSortColumn='id'
        storeColumnsKey='cxl-switch-list.cxl-switch-list'
        showSettingsButton={true}
        tableName={t('CXL Switches')}
        settingsColumns={columns}
        defaultColumns={defaultColumns}
        onSaveTableSettings={handleSaveTableSettings}
      />
    </Stack>
  );
};

const useColumnsAndRecords = (data: APPCxlSwitch[], selectedAccessors: string[] | []) => {
  /** Custom hook for filtering */
  const userFilter = useCxlSwitchListFilter(data);
  const { filteredRecords } = userFilter;

  /** Column configuration */
  const columns = useColumns(userFilter, selectedAccessors);

  return {
    columns,
    records: filteredRecords,
  };
};

export default CxlSwitchList;
