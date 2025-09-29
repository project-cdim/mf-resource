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
import { APIresource, APIresources } from '@/shared-modules/types';

import { APPResource } from '@/types';

import { useColumns } from '@/utils/hooks/resource-list/useColumns';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '@/shared-modules/utils';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
// import { useMSW } from '@/shared-modules/utils/hooks';

/** Props for the ResourceListTable component */
export type ResourceListTableProps = {
  /** Selected accessors for display */
  selectedAccessors: string[];
  /** Data */
  data: APPResource[];
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

  /** Select the columns to display */
  const [selectedAccessors, setSelectedAccessors] = useState(props.selectedAccessors);

  /** Custom hook for DataTable */
  const { columns, records } = useColumnsAndRecords(data, selectedAccessors);

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
              <Checkbox value='detected' label={t('Detection Status')} />
              <Checkbox value='resourceGroups' label={t('Resource Group')} />
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
  // Generate records with added resourceGroupsText
  const dataWithResourceGroupsText = data.map((row) => ({
    ...row,
    resourceGroupsText: row.resourceGroups?.map((g) => (g.name !== '' ? g.name : g.id)).join(',') ?? '',
  }));

  /** Custom hook for filtering */
  const userFilter = useResourceListFilter(dataWithResourceGroupsText);
  const { filteredRecords } = userFilter;

  /** Column configuration */
  // Pass selectedAccessors as is
  const columns = useColumnsWithResourceGroupsText(userFilter, selectedAccessors);

  return {
    columns,
    records: filteredRecords,
  };
};

// Wrapper to replace only the accessor of the resourceGroups column with resourceGroupsText
const useColumnsWithResourceGroupsText = (userFilter: any, selectedAccessors: string[]) => {
  const columns = useColumns(userFilter, selectedAccessors);
  return columns.map((col: any) =>
    col.accessor === 'resourceGroups' ? { ...col, accessor: 'resourceGroupsText' } : col
  );
};

/**
 * Custom hook to fetch, format, and manage the state of resource list data.
 *
 * This hook retrieves resource data from the backend using SWR, formats it for table display,
 * and provides loading, error, and mutation utilities for resource management.
 *
 * @returns {Object} An object containing:
 * - `data`: The formatted resource data for table consumption.
 * - `errors`: An array of errors from both the data fetch and formatting processes.
 * - `isValidating`: A boolean indicating if either the fetch or formatting is in a loading state.
 * - `mutate`: A function to revalidate and refresh both the raw and formatted resource data.
 */
export const useResourceListTableData = () => {
  // const mswInitializing = useMSW();
  const mswInitializing = false;

  const { data, error, isValidating, mutate } = useSWRImmutable<APIresources>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`,
    fetcher
  );

  const { formattedData, rgError, rgIsValidating, rgMutate } = useFormatResourceListTableData(data?.resources);

  const loading = isValidating || rgIsValidating;
  const mutates = () => {
    mutate();
    rgMutate();
  };

  return {
    data: formattedData,
    errors: [error, rgError],
    isValidating: loading,
    mutate: mutates,
  };
};

/**
 * Custom hook to format resource table data for display in a resource list table.
 *
 * This hook takes an optional array of `APIresource` objects
 * and transforms them into an array of `APPResource` objects, enriching each resource with
 * additional metadata such as resource group names and availability status.
 *
 * It also provides resource group loading state, error, and mutation utilities from
 * `useResourceGroupsData`.
 *
 * @param data - Optional array of resources to be formatted. Can be of type `APIresource[]`.
 * @returns An object containing:
 *   - `formattedData`: The formatted array of `APPResource` objects.
 *   - `rgError`: Any error encountered while fetching resource group data.
 *   - `rgIsValidating`: Boolean indicating if resource group data is being validated.
 *   - `rgMutate`: Function to revalidate or mutate the resource group data.
 */
export const useFormatResourceListTableData = (data?: APIresource[]) => {
  const { error: rgError, validating: rgIsValidating, mutate: rgMutate, getNameById } = useResourceGroupsData();

  const formattedData = useMemo(() => {
    return (
      data?.map((resource) => {
        const returnDevice: APPResource = {
          id: resource.device.deviceID,
          type: resource.device.type,
          health: resource.device.status.health,
          state: resource.device.status.state,
          detected: resource.detected,
          resourceGroups: resource.resourceGroupIDs.map((id) => ({ id, name: getNameById(id) })),
          cxlSwitchId: resource.device.deviceSwitchInfo ?? '',
          nodeIDs: resource.nodeIDs,
          resourceAvailable: resource.annotation.available ? 'Available' : 'Unavailable',
        };

        return returnDevice;
      }) || [] // Set [] if data cannot be retrieved
    );
  }, [data, getNameById]);

  return {
    formattedData,
    rgError,
    rgIsValidating,
    rgMutate,
  };
};
