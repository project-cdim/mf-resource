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

import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader } from '@/shared-modules/components';
import { APIresources } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';

import { ResourceListTable } from '@/components';

/**
 * Resource List Page
 *
 * @returns Page content
 */
const ResourceList = () => {
  const t = useTranslations();

  const { data, error, isValidating, mutate } = useSWRImmutable<APIresources>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`,
    fetcher
  );
  const loading = useLoading(isValidating);

  const selectedAccessors = ['id', 'type', 'health', 'state', 'cxlSwitchId', 'nodeIDs', 'resourceAvailable'];

  const items = [{ title: t('Resource Management') }, { title: t('Resources.list') }];

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('Resources.list')} items={items} mutate={mutate} loading={loading} />
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      <ResourceListTable selectedAccessors={selectedAccessors} data={data?.resources} loading={loading} />
    </Stack>
  );
};
export default ResourceList;
