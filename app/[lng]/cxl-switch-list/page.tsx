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

import { useMemo, useState } from 'react';

import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader, CustomDataTable } from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';

import { APIcxlswitchs, APPCxlSwitch } from '@/types';

import { useCxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';
import { useColumns } from '@/utils/hooks/cxl-switch-list/useColumns';

/**
 * CXL Switch List Page
 *
 * @returns Page content
 */
const CxlSwitchList = () => {
  const t = useTranslations();
  const { data, error, isValidating, mutate } = useSWRImmutable<APIcxlswitchs>(
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
        id: cxlSwitch.id,
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

  /** Select the columns to display */
  const [selectedAccessors, setSelectedAccessors] = useState([
    'id',
    'device.connected',
    'device.unallocated',
    'device.disabled',
    'device.warning',
    'device.critical',
    'device.resourceUnavailable',
  ]);

  const items = [{ title: t('Resource Management') }, { title: t('CXL Switches') }];

  /** Custom hook for DataTable */
  const { records, columns } = useColumnsAndRecords(formattedData, selectedAccessors);

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('CXL Switches')} items={items} mutate={mutate} loading={loading} />
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      <Group align='center' wrap='nowrap' gap='xl'>
        <Text fz='xs' style={{ flex: '0 0 auto' }}>
          {t('Visible')}
        </Text>
        <Checkbox.Group value={selectedAccessors} onChange={setSelectedAccessors}>
          <Group>
            <Checkbox value='id' label='ID' disabled />
            <Checkbox value='device.connected' label={t('Resources.number')} />
            <Checkbox value='device.unallocated' label={t('Unallocated Resources')} />
            <Checkbox value='device.disabled' label={t('Disabled Resources')} />
            <Checkbox value='device.warning' label={t('Warning Resources')} />
            <Checkbox value='device.critical' label={t('Critical Resources')} />
            <Checkbox value='device.resourceUnavailable' label={t('Excluded Resources')} />
          </Group>
        </Checkbox.Group>
      </Group>

      <CustomDataTable records={records} columns={columns} loading={loading} defaultSortColumn='id' />
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
