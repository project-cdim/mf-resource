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
import {
  PageLink,
  TextInputForTableFilter,
  DateRangePicker,
  DatetimeString,
  LongSentences,
} from '@/shared-modules/components';

import { APPResourceGroup } from '@/types';

import { ResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';
import { ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useColorStyles } from '@/shared-modules/styles/styles';
import { usePermission } from '@/shared-modules/utils/hooks';
import { MANAGE_RESOURCE } from '@/shared-modules/constant';
import { useResourceGroupModal } from '@/components';

/**
 * Constructs columns for the resource group list
 *
 * @param groupFilter Filter information
 * @param selectedAccessors Columns to be displayed
 * @returns Columns with visibility toggled
 */
export const useColumns = (
  groupFilter: ResourceGroupListFilter,
  selectedAccessors: (string | null)[],
  openModal: ReturnType<typeof useResourceGroupModal>['openModal']
): DataTableColumn<APPResourceGroup>[] => {
  const DEFAULT_GROUP_ID = '00000000-0000-7000-8000-000000000000';
  const t = useTranslations();
  const { red, blue } = useColorStyles();
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const isButtonDisabled = (id: string) => id === DEFAULT_GROUP_ID || !hasPermission;
  return [
    {
      accessor: 'name',
      title: t('Name'),
      sortable: true,
      hidden: !selectedAccessors.includes('name'),
      render: ({ id, name }) => {
        return (
          // <Group gap={5} wrap='nowrap'>
          <Group wrap='nowrap'>
            <PageLink title={t('Resource Group Details')} path='/cdim/res-resource-group-detail' query={{ id }}>
              <LongSentences text={name} />
            </PageLink>
          </Group>
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
      render: ({ description }) => <LongSentences text={description} lines={3} />,
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
      noWrap: true,
    },
    {
      accessor: 'createdAt',
      title: t('Created'),
      sortable: true,
      hidden: !selectedAccessors.includes('createdAt'),
      render: ({ createdAt }) => <DatetimeString date={createdAt} />,
      filter: ({ close }) => (
        <DateRangePicker value={groupFilter.query.createdAt} setValue={groupFilter.setQuery.createdAt} close={close} />
      ),
      filtering: groupFilter.query.createdAt.some((date) => Boolean(date)),
      noWrap: true,
    },
    {
      accessor: 'updatedAt',
      title: t('Updated'),
      sortable: true,
      hidden: !selectedAccessors.includes('updatedAt'),
      render: ({ updatedAt }) => <DatetimeString date={updatedAt} />,
      filter: ({ close }) => (
        <DateRangePicker value={groupFilter.query.updatedAt} setValue={groupFilter.setQuery.updatedAt} close={close} />
      ),
      filtering: groupFilter.query.updatedAt.some((date) => Boolean(date)),
      noWrap: true,
    },
    {
      accessor: 'actions',
      title: '',
      width: 80,
      render: (rg) => (
        <Group gap={10} justify='right' wrap='nowrap'>
          <ActionIcon
            variant='default'
            bd={`1px solid ${isButtonDisabled(rg.id) ? undefined : blue.color}`}
            disabled={isButtonDisabled(rg.id)}
            title={t('Edit')}
            onClick={() => openModal({ operation: 'edit', rg })}
          >
            <IconPencil size={20} color={isButtonDisabled(rg.id) ? undefined : blue.color} />
          </ActionIcon>
          <ActionIcon
            variant='default'
            bd={`1px solid ${isButtonDisabled(rg.id) ? undefined : red.color}`}
            disabled={isButtonDisabled(rg.id)}
            title={t('Delete')}
            onClick={() => openModal({ operation: 'delete', rg })}
          >
            <IconTrash size={20} color={isButtonDisabled(rg.id) ? undefined : red.color} />
          </ActionIcon>
        </Group>
      ),
    },
  ];
};
