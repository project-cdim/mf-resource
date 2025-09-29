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
import { Button, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader, CustomDataTable } from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';
import { useLoading, usePermission } from '@/shared-modules/utils/hooks';

import { APIResourceGroups, APPResourceGroup } from '@/types';

import { useColumns } from '@/utils/hooks/resource-group-list/useColumns';
import { useResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';
import { MANAGE_RESOURCE } from '@/shared-modules/constant';
import { ModalWithErrorProvider, useResourceGroupModal, ModalSuccessMessage } from '@/components';

/**
 * Resource Group List Page
 *
 * @returns Page content
 */
const Wrapper = () => {
  return (
    <ModalWithErrorProvider>
      <ResourceGroupList />
    </ModalWithErrorProvider>
  );
};

const ResourceGroupList = () => {
  // const mswInitializing = useMSW();
  const mswInitializing = false; // Not using MSW

  const t = useTranslations();

  const { data, error, isValidating, mutate } = useSWRImmutable<APIResourceGroups>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups?withResources=true`,
    fetcher
  );
  const { successMessage, setSuccessMessage, openModal } = useResourceGroupModal(mutate);

  // Display loading indicator
  const loading = useLoading(isValidating);
  const hasPermission = usePermission(MANAGE_RESOURCE);

  /** Data retrieval and formatting for DataTable */
  const formattedData = useMemo(() => {
    return (
      data?.resourceGroups.map((resource) => ({
        id: resource.id,
        name: resource.name,
        description: resource.description,
        createdAt: new Date(resource.createdAt),
        updatedAt: new Date(resource.updatedAt),
      })) || []
    );
  }, [data]);

  const [selectedAccessors] = useState(['id', 'name', 'description', 'createdAt', 'updatedAt']);

  const items = [{ title: t('Resource Management') }, { title: t('Resource Groups') }];

  /** Custom hook for DataTable */
  const { columns, records } = useColumnsAndRecords(formattedData, selectedAccessors, openModal);

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('Resource Groups')} items={items} mutate={mutate} loading={loading} />
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      <ModalSuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage} />
      <Button
        type='button'
        onClick={() => openModal({ operation: 'add' })}
        disabled={!hasPermission || isValidating}
        w={100}
        variant='default'
      >
        {t('Add')}
      </Button>
      <CustomDataTable records={records} columns={columns} loading={loading} defaultSortColumn='name' />
    </Stack>
  );
};

const useColumnsAndRecords = (
  data: APPResourceGroup[],
  selectedAccessors: string[] | [],
  openModal: ReturnType<typeof useResourceGroupModal>['openModal']
) => {
  /** Custom hook for filtering */
  const userFilter = useResourceGroupListFilter(data);
  const { filteredRecords } = userFilter;

  /** Column configuration */
  const columns = useColumns(userFilter, selectedAccessors, openModal);

  return {
    columns,
    records: filteredRecords,
  };
};

export default Wrapper;
