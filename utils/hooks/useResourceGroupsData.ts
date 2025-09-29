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

import { useMemo, useCallback } from 'react';
import { APIResourceGroups } from '@/types';
import { fetcher } from '@/shared-modules/utils';
import useSWRImmutable from 'swr/immutable';

/**
 * Custom hook to fetch resource groups data
 *
 * @returns Object containing resource groups data, error, validating status, mutate function and getResourceGroupName function
 */
export const useResourceGroupsData = () => {
  const { data, error, isValidating, mutate } = useSWRImmutable<APIResourceGroups>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups`,
    fetcher
  );

  // Memoize the resource group map to avoid recalculating on every render
  // and to ensure it only updates when data changes
  const resourceGroupMap = useMemo(() => {
    if (!data) return {};
    return data.resourceGroups.reduce(
      (map, resourceGroup) => {
        map[resourceGroup.id] = resourceGroup.name;
        return map;
      },
      {} as Record<string, string>
    );
  }, [data]);

  const resourceGroups = useMemo(() => {
    if (!data) return [];
    return data.resourceGroups;
  }, [data]);

  /**
   * Get resource group name by ID
   *
   * @param resourceGroupId - Resource group ID to find
   * @returns Resource group name if found, empty string otherwise
   */
  const getNameById = useCallback(
    (resourceGroupId: string): string => {
      return resourceGroupMap[resourceGroupId] || '';
    },
    [resourceGroupMap]
  );

  return {
    data: resourceGroups,
    error,
    validating: isValidating,
    mutate,
    getNameById,
  };
};
