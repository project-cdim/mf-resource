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

import { useMemo, useState } from 'react';

import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CustomDataTable } from '@/shared-modules/components';
import { APIresource, APIresourceForNodeDetail, isAPIresource } from '@/shared-modules/types';

import { APPResource } from '@/types';

import { useColumns } from '@/utils/hooks/resource-list/useColumns';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';

/** Props for the ResourceListTable component */
export type ResourceListTableProps = {
  /** Selected accessors for display */
  selectedAccessors: string[];
  /** Data */
  data: APIresource[] | APIresourceForNodeDetail[] | undefined;
  /** Loading state */
  loading: boolean;
  /** Show accessor selector */
  showAccessorSelector?: boolean;
  /** Show pagination */
  showPagination?: boolean;
};

/**
 * Component to display a resource list
 * @param props ResourceListTableProps
 * @returns JSX.Element to display the resource list
 */
export const ResourceListTable = (props: ResourceListTableProps) => {
  const { data, loading, showAccessorSelector = true, showPagination = true } = props;
  const t = useTranslations();

  /**  Data retrieval and formatting for DataTable */
  const formattedData = useMemo(() => {
    return (
      data?.map((resource) => {
        const returnDevice: APPResource = {
          id: resource.device.deviceID,
          type: resource.device.type,
          state: resource.device.status.state,
          health: resource.device.status.health,
          resourceAvailable: resource.annotation.available ? 'Available' : 'Unavailable',
          cxlSwitchId: resource.device.deviceSwitchInfo ?? '',
          nodeIDs: [],
        };
        if (isAPIresource(resource)) {
          // For APIresourceForNodeDetail, keep the initial value of []
          returnDevice.nodeIDs = resource.nodeIDs;
        }
        return returnDevice;
      }) || [] // Set [] if data cannot be retrieved
    );
  }, [data]);

  /** Select the columns to display */
  const [selectedAccessors, setSelectedAccessors] = useState(props.selectedAccessors);

  /** Custom hook for DataTable */
  const { columns, records } = useColumnsAndRecords(formattedData, selectedAccessors);

  return (
    <Stack gap='xl'>
      {showAccessorSelector && (
        <Group align='center' wrap='nowrap' gap='xl'>
          <Text fz='xs' style={{ flex: '0 0 auto' }}>
            {t('Visible')}
          </Text>
          <Checkbox.Group value={selectedAccessors} onChange={setSelectedAccessors}>
            <Group>
              <Checkbox value='id' label={t('ID')} disabled />
              <Checkbox value='type' label={t('Type')} />
              <Checkbox value='health' label={t('Health')} />
              <Checkbox value='state' label={t('State')} />
              <Checkbox value='cxlSwitchId' label={t('CXL Switch')} />
              <Checkbox value='nodeIDs' label={t('Node')} />
              <Checkbox value='resourceAvailable' label={t('Included in design')} />
            </Group>
          </Checkbox.Group>
        </Group>
      )}
      <CustomDataTable
        records={records}
        columns={columns}
        loading={loading}
        defaultSortColumn='id'
        noPagination={!showPagination}
      />
    </Stack>
  );
};

const useColumnsAndRecords = (data: APPResource[], selectedAccessors: string[] | []) => {
  /** Custom hook for filtering */
  const userFilter = useResourceListFilter(data);
  const { filteredRecords } = userFilter;

  /** Column configuration */
  const columns = useColumns(userFilter, selectedAccessors);

  return {
    columns,
    records: filteredRecords,
  };
};
