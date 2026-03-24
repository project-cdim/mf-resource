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

import { useMemo, useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { CustomDataTable } from '@/shared-modules/components';
import { APIresource, APIresources } from '@/shared-modules/types';

import { APPResource } from '@/types';

import { useColumns } from '@/utils/hooks/resource-list/useColumns';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '@/shared-modules/utils';
import { useTableSettings } from '@/shared-modules/utils/hooks';
import { parseDevicePortList, parsePlacement } from '@/utils/parse';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import { calculateOverallStatus } from '@/utils/calculateOverallStatus';

/** Props for the ResourceListTable component */
export type ResourceListTableProps = {
  /** Selected default accessors for display */
  defaultAccessors?: string[];
  /** Data */
  data: APPResource[];
  /** Loading state */
  loading: boolean;
  /** Callback to notify parent of storage errors */
  onStorageError?: (error: Error | undefined) => void;
  /** Selected accessors to display */
  selectedAccessors?: string[];
  /** Show accessor selector */
  showAccessorSelector?: boolean;
  /** Show pagination */
  showPagination?: boolean;
  storeColumnsKey: string;
  /** Table name for column settings modal */
  tableName?: string;
};

/**
 * Component to display a resource list
 * @param props ResourceListTableProps
 * @returns JSX.Element to display the resource list
 */
export const ResourceListTable = (props: ResourceListTableProps) => {
  const {
    defaultAccessors,
    data,
    loading,
    onStorageError,
    selectedAccessors: selectedAccessorsProp,
    showAccessorSelector = true,
    showPagination = true,
    storeColumnsKey,
    tableName,
  } = props;
  const t = useTranslations();

  // Column definitions with labels
  const columnDefinitions = useMemo(
    () => [
      { id: 'id', label: t('ID'), fixed: true },
      { id: 'type', label: t('Type'), fixed: false },
      { id: 'status', label: t('Status'), fixed: false },
      { id: 'powerState', label: t('Power State'), fixed: false },
      { id: 'health', label: t('Health'), fixed: false },
      { id: 'state', label: t('State'), fixed: false },
      { id: 'detected', label: t('Detection Status'), fixed: false },
      { id: 'resourceAvailable', label: t('Maintenance'), fixed: false },
      { id: 'resourceGroups', label: t('Resource Group'), fixed: false },
      { id: 'placement', label: t('Placement'), fixed: false },
      { id: 'cxlSwitch', label: t('CXL Switch'), fixed: false },
      { id: 'nodeIDs', label: t('Node'), fixed: false },
      { id: 'composite', label: t('Composite Resource'), fixed: false },
    ],
    [t]
  );

  const {
    columns,
    defaultColumns,
    selectedAccessors: localSelectedAccessors,
    handleSaveTableSettings: handleSaveLocal,
    storageError,
  } = useTableSettings(columnDefinitions, defaultAccessors || [], storeColumnsKey);

  // Use prop if provided, otherwise fall back to stored columns
  const selectedAccessors = selectedAccessorsProp || localSelectedAccessors;

  // Notify parent component of storage errors
  useEffect(() => {
    if (onStorageError) {
      onStorageError(storageError);
    }
  }, [storageError, onStorageError]);

  /** Custom hook for DataTable */
  const { columns: tableColumns, records } = useColumnsAndRecords(data, selectedAccessors);

  return (
    <CustomDataTable
      records={records}
      columns={tableColumns}
      loading={loading}
      defaultSortColumn='id'
      noPagination={!showPagination}
      showSettingsButton={showAccessorSelector}
      tableName={tableName || t('Resources.list')}
      settingsColumns={columns}
      defaultColumns={defaultColumns}
      onSaveTableSettings={handleSaveLocal}
    />
  );
};

const useColumnsAndRecords = (data: APPResource[], selectedAccessors: string[] | []) => {
  // Generate records with added resourceGroupsText and placementText
  const dataWithTextFields = data.map((row) => ({
    ...row,
    resourceGroupsText: row.resourceGroups?.map((g) => (g.name !== '' ? g.name : g.id)).join(',') ?? '',
    placementText: parsePlacement(row.placement) ?? '',
  }));

  /** Custom hook for filtering */
  const userFilter = useResourceListFilter(dataWithTextFields);
  const { filteredRecords } = userFilter;

  /** Column configuration */
  // Pass selectedAccessors as is
  const columns = useColumnsWithTextFields(userFilter, selectedAccessors);

  return {
    columns,
    records: filteredRecords,
  };
};

// Wrapper to replace accessors for resourceGroups and placement columns with text versions
const useColumnsWithTextFields = (userFilter: any, selectedAccessors: string[]) => {
  const columns = useColumns(userFilter, selectedAccessors);
  return columns.map((col: any) => {
    if (col.accessor === 'resourceGroups') {
      return { ...col, accessor: 'resourceGroupsText' };
    }
    if (col.accessor === 'placement') {
      return { ...col, accessor: 'placementText' };
    }
    return col;
  });
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
  const { data, error, isValidating, mutate } = useSWRImmutable<APIresources>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`,
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
          status: calculateOverallStatus(resource.device.status.health, resource.device.status.state),
          powerState: resource.device.powerState,
          health: resource.device.status.health,
          state: resource.device.status.state,
          detected: resource.detected,
          resourceGroups: resource.resourceGroupIDs.map((id) => ({ id, name: getNameById(id) })),
          placement: resource.physicalLocation,
          cxlSwitch: parseDevicePortList(resource.device.devicePortList),
          nodeIDs: resource.nodeIDs,
          composite:
            (resource.device.constraints?.nonRemovableDevices?.length ?? 0) > 0 ? resource.deviceUnit?.id || '' : '',
          resourceAvailable: resource.deviceUnit.annotation.systemItems.available ? 'Available' : 'Unavailable',
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
