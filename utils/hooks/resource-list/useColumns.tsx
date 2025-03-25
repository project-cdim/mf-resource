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

import { Group, Stack } from '@mantine/core';
import _ from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import { PageLink, TextInputForTableFilter, MultiSelectForTableFilter } from '@/shared-modules/components';
import { APIDeviceAvailable, APIDeviceHealth, APIDeviceState, APIDeviceType } from '@/shared-modules/types';

import { APPResource } from '@/types';

import { AvailableToIcon, HealthToIcon, StateToIcon } from '@/components';

import { ResourceListFilter } from '@/utils/hooks/useResourceListFilter';

/**
 * Constructs columns for the resource list
 *
 * @param resourceFilter Filter information
 * @param selectedAccessors Columns to be displayed
 * @returns Columns with toggleable visibility
 */
export const useColumns = (
  resourceFilter: ResourceListFilter,
  selectedAccessors: (string | null)[]
): DataTableColumn<APPResource>[] => {
  const t = useTranslations();
  return [
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      hidden: !selectedAccessors.includes('id'),
      render: ({ id }) => {
        return (
          <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id }}>
            {id}
          </PageLink>
        );
      },
      filter: (
        <TextInputForTableFilter
          label={t('ID')}
          value={resourceFilter.query.id}
          setValue={resourceFilter.setQuery.id}
        />
      ),
      filtering: resourceFilter.query.id !== '',
    },
    {
      accessor: 'type',
      title: t('Type'),
      sortable: true,
      hidden: !selectedAccessors.includes('type'),
      render: ({ type }) => {
        return _.upperFirst(type);
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Type')}
          options={resourceFilter.selectOptions.type}
          value={resourceFilter.query.types}
          setValue={(value) => resourceFilter.setQuery.types(value as APIDeviceType[])}
        />
      ),
      filtering: resourceFilter.query.types.length > 0,
    },
    {
      accessor: 'health',
      title: t('Health'),
      sortable: true,
      hidden: !selectedAccessors.includes('health'),
      render: ({ health }) => {
        return (
          <Group gap={5}>
            {HealthToIcon(health)}
            {health}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Health')}
          options={resourceFilter.selectOptions.health}
          value={resourceFilter.query.healths}
          setValue={(value) => resourceFilter.setQuery.healths(value as APIDeviceHealth[])}
        />
      ),
      filtering: resourceFilter.query.healths.length > 0,
    },
    {
      accessor: 'state',
      title: t('State'),
      sortable: true,
      hidden: !selectedAccessors.includes('state'),
      render: ({ state }) => {
        return (
          <Group gap={5}>
            {StateToIcon(state)}
            {state}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('State')}
          options={resourceFilter.selectOptions.state}
          value={resourceFilter.query.states}
          setValue={(value) => resourceFilter.setQuery.states(value as APIDeviceState[])}
        />
      ),
      filtering: resourceFilter.query.states.length > 0,
    },
    {
      accessor: 'cxlSwitchId',
      title: t('CXL Switch'),
      sortable: true,
      hidden: !selectedAccessors.includes('cxlSwitchId'),
      filter: (
        <>
          <TextInputForTableFilter
            label={t('CXL Switch')}
            value={resourceFilter.query.cxlSwitchId}
            setValue={resourceFilter.setQuery.cxlSwitchId}
          />
          <MultiSelectForTableFilter
            label={t('Allocate state')}
            options={resourceFilter.selectOptions.allocate}
            value={resourceFilter.query.allocatedCxl}
            setValue={(value: string[]) => resourceFilter.setQuery.allocatedCxl(value as string[])}
          />
        </>
      ),
      filtering: resourceFilter.query.allocatedCxl.length > 0 || resourceFilter.query.cxlSwitchId !== '',
    },
    {
      accessor: 'nodeIDs',
      title: t('Node'),
      sortable: true,
      hidden: !selectedAccessors.includes('nodeIDs'),
      render: ({ nodeIDs }) => (
        <Stack gap={0}>
          {nodeIDs.map((nodeId) => (
            <PageLink title={t('Node Details')} path={'/cdim/res-node-detail'} query={{ id: nodeId }} key={nodeId}>
              {nodeId}
            </PageLink>
          ))}
        </Stack>
      ),
      filter: (
        <>
          <TextInputForTableFilter
            label={t('Node')}
            value={resourceFilter.query.nodeIDs}
            setValue={resourceFilter.setQuery.nodeIDs}
          />
          <MultiSelectForTableFilter
            label={t('Allocate state')}
            options={resourceFilter.selectOptions.allocate}
            value={resourceFilter.query.allocatedNodes}
            setValue={(value: string[]) => resourceFilter.setQuery.allocatedNodes(value as string[])}
          />
        </>
      ),
      filtering: resourceFilter.query.allocatedNodes.length > 0 || resourceFilter.query.nodeIDs !== '',
    },
    {
      accessor: 'resourceAvailable',
      title: t('Included in design'),
      sortable: true,
      hidden: !selectedAccessors.includes('resourceAvailable'),
      render: ({ resourceAvailable }) => {
        return (
          <Group gap={5}>
            {AvailableToIcon(resourceAvailable)}
            {resourceAvailable === 'Available' ? t('Included') : t('Excluded')}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Included in design')}
          options={resourceFilter.selectOptions.available}
          value={resourceFilter.query.available}
          setValue={(value) => resourceFilter.setQuery.available(value as APIDeviceAvailable[])}
        />
      ),
      filtering: resourceFilter.query.available.length > 0,
    },
  ];
};
