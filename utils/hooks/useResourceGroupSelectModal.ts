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

import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { APIResourceGroup } from '@/types';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';

/**
 * Custom hook for resource group selection modal
 * Manages modal open/close state, error state, and resource group data retrieval
 *
 * @returns State and functions related to modal operation
 */
export const useResourceGroupSelectModal = () => {
  const [isModalOpen, { open: setModalOpen, close: closeModal }] = useDisclosure(false);
  const [error, setError] = useState<AxiosError<{ code: string; message: string; details?: string }> | undefined>(
    undefined
  );
  const [dataFetchError, setDataFetchError] = useState<
    AxiosError<{ code: string; message: string; details?: string }> | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [allResourceGroups, setAllResourceGroups] = useState<APIResourceGroup[]>([]);

  const openModal = () => {
    setError(undefined);
    setDataFetchError(undefined);
    setModalOpen();
  };

  // Fetch resource group list using useResourceGroupsData hook
  const { data: resourceGroups, error: resourceGroupsError, validating: isValidating } = useResourceGroupsData();

  // Update state based on resource groups data
  useEffect(() => {
    // Update loading state
    setLoading(Boolean(isValidating));

    // Handle resource groups data
    if (Array.isArray(resourceGroups)) {
      setAllResourceGroups(resourceGroups);
    }

    // Handle errors
    if (resourceGroupsError) {
      setAllResourceGroups([]);

      if (resourceGroupsError instanceof Error) {
        const axiosError = resourceGroupsError as AxiosError<{ code: string; message: string; details?: string }>;
        setDataFetchError(axiosError);
      }
    } else {
      setDataFetchError(undefined);
    }
  }, [resourceGroups, resourceGroupsError, isValidating]);

  // Send resource group changes to server
  const submitResourceGroups = async (
    deviceId: string,
    selectedResourceGroupIds: string[],
    onSuccess: (response: AxiosResponse | { operation: string }) => void
  ) => {
    if (!deviceId) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources/${deviceId}/resource-groups`,
        selectedResourceGroupIds
      );
      setError(undefined);
      // On success, pass an object in the format { operation: 'UpdateResourceGroup' }
      onSuccess({ operation: 'UpdateResourceGroup' });
      closeModal();
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    openModal,
    closeModal,
    setError,
    setDataFetchError,
    isModalOpen,
    error,
    dataFetchError,
    loading,
    allResourceGroups,
    submitResourceGroups,
  };
};
