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

import { Group } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import { PageLink, TextInputForTableFilter, MultiSelectForTableFilter } from '@/shared-modules/components';

import { APPCxlSwitch } from '@/types';

import {
  AvailableToIconForNode,
  HealthToIconForNodeCritical,
  HealthToIconForNodeWarning,
  StateToIconForNode,
} from '@/components';

import { CxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';
import { NumberOptionValue } from '@/utils/hooks/useNodeListFilter';

// const defaultCol: DataTableColumn<APPCxlSwitch>[] = [
/**
 * Constructs columns for the CXL switch list
 *
 * @param cxlSwitchFilter Filter information
 * @param selectedAccessors Columns to be displayed
 * @returns Columns with toggled visibility
 */
export const useColumns = (
  cxlSwitchFilter: CxlSwitchListFilter,
  selectedAccessors: (string | null)[]
): DataTableColumn<APPCxlSwitch>[] => {
  const t = useTranslations();
  return [
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      hidden: !selectedAccessors.includes('id'),
      filter: (
        <TextInputForTableFilter
          label={t('ID')}
          value={cxlSwitchFilter.query.id}
          setValue={cxlSwitchFilter.setQuery.id}
        />
      ),
      filtering: cxlSwitchFilter.query.id !== '',
    },
    {
      accessor: 'device.connected',
      title: t('Resources.number'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.connected'),
      render: ({ id, device }) => {
        return device.connected ? (
          <PageLink title={t('Resources.list')} path={'/cdim/res-resource-list'} query={{ cxlSwitchId: id }} key={id}>
            {device.connected}
          </PageLink>
        ) : (
          <>{device.connected}</>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Resources.number')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.connected}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.connected(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.connected.length > 0,
    },
    {
      accessor: 'device.unallocated',
      title: t('Unallocated Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.unallocated'),
      render: ({ id, device }) => {
        return device.unallocated ? (
          <PageLink
            title={t('Resources.list')}
            path={'/cdim/res-resource-list'}
            query={{ cxlSwitchId: id, allocatednode: 'Unallocated' }}
            key={id}
          >
            {device.unallocated}
          </PageLink>
        ) : (
          <>{device.unallocated}</>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Unallocated Resources')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.unallocated}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.unallocated(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.unallocated.length > 0,
    },
    {
      accessor: 'device.disabled',
      title: t('Disabled Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.disabled'),
      render: ({ id, device }) => {
        return device.disabled ? (
          <Group>
            {StateToIconForNode(device.disabled)}
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ cxlSwitchId: id, state: 'Disabled' }}
              key={id}
            >
              {device.disabled.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group>
            {StateToIconForNode(device.disabled)}
            {device.disabled.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Disabled Resources')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.disabled}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.disabled(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.disabled.length > 0,
    },
    {
      accessor: 'device.warning',
      title: t('Warning Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.warning'),
      render: ({ id, device }) => {
        return device.warning ? (
          <Group>
            {HealthToIconForNodeWarning(device.warning)}
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ cxlSwitchId: id, health: 'Warning' }}
              key={id}
            >
              {device.warning.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group>
            {HealthToIconForNodeWarning(device.warning)}
            {device.warning.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Warning Resources')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.warning}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.warning(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.warning.length > 0,
    },
    {
      accessor: 'device.critical',
      title: t('Critical Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.critical'),
      render: ({ id, device }) => {
        return device.critical ? (
          <Group>
            {HealthToIconForNodeCritical(device.critical)}
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ cxlSwitchId: id, health: 'Critical' }}
              key={id}
            >
              {device.critical.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group>
            {HealthToIconForNodeCritical(device.critical)}
            {device.critical.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Critical Resources')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.critical}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.critical(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.critical.length > 0,
    },
    {
      accessor: 'device.resourceUnavailable',
      title: t('Excluded Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.resourceUnavailable'),
      render: ({ id, device }) => {
        return device.resourceUnavailable ? (
          <Group>
            {AvailableToIconForNode(device.resourceUnavailable)}
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ cxlSwitchId: id, resourceAvailable: 'Unavailable' }}
              key={id}
            >
              {device.resourceUnavailable.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group>
            {AvailableToIconForNode(device.resourceUnavailable)}
            {device.resourceUnavailable.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Excluded Resources')}
          options={cxlSwitchFilter.selectOptions.number}
          value={cxlSwitchFilter.query.unavailable}
          setValue={(value: string[]) => cxlSwitchFilter.setQuery.unavailable(value as NumberOptionValue[])}
        />
      ),
      filtering: cxlSwitchFilter.query.unavailable.length > 0,
    },
  ];
};
