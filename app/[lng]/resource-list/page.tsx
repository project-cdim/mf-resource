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

import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { MessageBox, PageHeader } from '@/shared-modules/components';
import { useLoading } from '@/shared-modules/utils/hooks';

import { ResourceListTable, useResourceListTableData } from '@/components';

/**
 * Resource List Page
 *
 * @returns Page content
 */
const ResourceList = () => {
  const t = useTranslations();

  const { data, errors, isValidating, mutate } = useResourceListTableData();

  const loading = useLoading(isValidating);

  const [storageError, setStorageError] = useState<Error | undefined>();

  const defaultAccessors = useMemo(
    () => [
      'id',
      'type',
      'status',
      'powerState',
      // 'health',         // Hidden by default
      // 'state',          // Hidden by default
      'detected',
      'resourceAvailable',
      'resourceGroups',
      'placement',
      'cxlSwitch',
      'nodeIDs',
      // 'composite',      // Hidden by default
    ],
    []
  );

  const storeColumnsKey = 'resource-list.resource-list';

  const items = [{ title: t('Resource Management') }, { title: t('Resources.list') }];

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('Resources.list')} items={items} mutate={mutate} loading={loading} />
      {errors.map(
        (error) =>
          error && (
            <MessageBox
              key={error.message}
              type='error'
              title={error.message}
              message={error.response?.data.message || ''}
            />
          )
      )}
      {storageError && <MessageBox type='error' title={storageError.message} message='' />}
      <ResourceListTable
        data={data}
        loading={loading}
        defaultAccessors={defaultAccessors}
        storeColumnsKey={storeColumnsKey}
        tableName={t('Resources.list')}
        onStorageError={setStorageError}
      />
    </Stack>
  );
};
export default ResourceList;
