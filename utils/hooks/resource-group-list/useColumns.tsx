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

import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { PageLink, TextInputForTableFilter, DateRangePicker, DatetimeString } from '@/shared-modules/components';

import { APPResourceGroup } from '@/types';

import { ResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';

/**
 * Constructs columns for the resource group list
 *
 * @param groupFilter Filter information
 * @param selectedAccessors Columns to be displayed
 * @returns Columns with visibility toggled
 */
export const useColumns = (
  groupFilter: ResourceGroupListFilter,
  selectedAccessors: (string | null)[]
): DataTableColumn<APPResourceGroup>[] => {
  const t = useTranslations();

  return [
    {
      accessor: 'name',
      title: t('Name'),
      sortable: true,
      hidden: !selectedAccessors.includes('name'),
      render: ({ id, name }) => {
        return (
          <PageLink title={t('Resource Group Details')} path='/cdim/res-resource-group-detail' query={{ id }}>
            {name}
          </PageLink>
        );
      },
      filter: (
        <TextInputForTableFilter
          label={t('Name')}
          value={groupFilter.query.name}
          setValue={groupFilter.setQuery.name}
        />
      ),
      filtering: groupFilter.query.name !== '',
    },
    {
      accessor: 'description',
      title: t('Description'),
      sortable: true,
      hidden: !selectedAccessors.includes('description'),
      filter: (
        <TextInputForTableFilter
          label={t('Description')}
          value={groupFilter.query.description}
          setValue={groupFilter.setQuery.description}
        />
      ),
      filtering: groupFilter.query.description !== '',
    },
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      hidden: !selectedAccessors.includes('id'),
      filter: (
        <TextInputForTableFilter label={t('ID')} value={groupFilter.query.id} setValue={groupFilter.setQuery.id} />
      ),
      filtering: groupFilter.query.id !== '',
    },
    {
      accessor: 'createdAt',
      title: t('Created'),
      sortable: true,
      hidden: !selectedAccessors.includes('createdAt'),
      render: ({ createdAt }) => DatetimeString(createdAt),
      filter: ({ close }) => (
        <DateRangePicker value={groupFilter.query.createdAt} setValue={groupFilter.setQuery.createdAt} close={close} />
      ),
      filtering: groupFilter.query.createdAt.some((date) => Boolean(date)),
    },
    {
      accessor: 'updatedAt',
      title: t('Updated'),
      sortable: true,
      hidden: !selectedAccessors.includes('updatedAt'),
      render: ({ updatedAt }) => DatetimeString(updatedAt),
      filter: ({ close }) => (
        <DateRangePicker value={groupFilter.query.updatedAt} setValue={groupFilter.setQuery.updatedAt} close={close} />
      ),
      filtering: groupFilter.query.updatedAt.some((date) => Boolean(date)),
    },
  ];
};
