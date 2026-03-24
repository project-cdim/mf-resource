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

import { Box, Group, Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  PageLink,
  TextInputForTableFilter,
  MultiSelectForTableFilter,
  LongSentences,
} from '@/shared-modules/components';

import { APPNode } from '@/types';
import {
  AvailableToIconForNode,
  HealthToIconForNodeCritical,
  HealthToIconForNodeWarning,
  StateToIconForNode,
  PowerOffToIconForNode,
} from '@/components';

import { NodeListFilter, NumberOptionValue } from '@/utils/hooks/useNodeListFilter';

/**
 * Constructs columns for the node list
 *
 * @param nodeFilter Filter information
 * @param selectedAccessors Columns to be displayed
 * @returns Columns with visibility toggled
 */
export const useColumns = (
  nodeFilter: NodeListFilter,
  selectedAccessors: (string | null)[]
): DataTableColumn<APPNode>[] => {
  const t = useTranslations();

  return [
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      hidden: !selectedAccessors.includes('id'),
      render: ({ id }) => {
        return (
          <Stack gap={0}>
            <PageLink title={t('Node Details')} path='/cdim/res-node-detail' query={{ id }}>
              <LongSentences text={id} />
            </PageLink>
          </Stack>
        );
      },
      filter: <TextInputForTableFilter label={t('ID')} value={nodeFilter.query.id} setValue={nodeFilter.setQuery.id} />,
      filtering: nodeFilter.query.id !== '',
    },
    {
      accessor: 'device.connected',
      title: t('Resources.number'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.connected'),
      render: ({ id, device }) => {
        return device.connected ? (
          <PageLink title={t('Resources.list')} path={'/cdim/res-resource-list'} query={{ nodeId: id }} key={id}>
            {device.connected}
          </PageLink>
        ) : (
          <>{device.connected.toString()}</>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Resources.number')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.connected}
          setValue={(value: string[]) => nodeFilter.setQuery.connected(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.connected.length > 0,
    },
    {
      // Temporarily hide the Power Off Resources column
      accessor: 'device.poweroff',
      title: t('Power Off Resources'),
      sortable: true,
      // hidden: !selectedAccessors.includes('device.poweroff'),
      hidden: true,
      render: ({ id, device }) => {
        return device.poweroff ? (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <PowerOffToIconForNode poweroffNumber={device.poweroff} />
            </Box>
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ nodeId: id, power: 'Off' }}
              key={id}
            >
              {device.poweroff.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <PowerOffToIconForNode poweroffNumber={device.poweroff} />
            </Box>
            {device.poweroff.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Power Off Resources')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.poweroff}
          setValue={(value: string[]) => nodeFilter.setQuery.poweroff(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.poweroff.length > 0,
    },
    {
      accessor: 'device.disabled',
      title: t('Disabled Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.disabled'),
      render: ({ id, device }) => {
        return device.disabled ? (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StateToIconForNode disabledResources={device.disabled} />
            </Box>
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ nodeId: id, state: 'Disabled' }}
              key={id}
            >
              {device.disabled.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StateToIconForNode disabledResources={device.disabled} />
            </Box>
            {device.disabled.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Disabled Resources')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.disabled}
          setValue={(value: string[]) => nodeFilter.setQuery.disabled(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.disabled.length > 0,
    },
    {
      accessor: 'device.warning',
      title: t('Warning Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.warning'),
      render: ({ id, device }) => {
        return device.warning ? (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <HealthToIconForNodeWarning warningNumber={device.warning} />
            </Box>
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ nodeId: id, health: 'Warning' }}
              key={id}
            >
              {device.warning.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <HealthToIconForNodeWarning warningNumber={device.warning} />
            </Box>
            {device.warning.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Warning Resources')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.warning}
          setValue={(value: string[]) => nodeFilter.setQuery.warning(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.warning.length > 0,
    },
    {
      accessor: 'device.critical',
      title: t('Critical Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.critical'),
      render: ({ id, device }) => {
        return device.critical ? (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <HealthToIconForNodeCritical criticalNumber={device.critical} />
            </Box>
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ nodeId: id, health: 'Critical' }}
              key={id}
            >
              {device.critical.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <HealthToIconForNodeCritical criticalNumber={device.critical} />
            </Box>
            {device.critical.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Critical Resources')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.critical}
          setValue={(value: string[]) => nodeFilter.setQuery.critical(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.critical.length > 0,
    },
    {
      accessor: 'device.resourceUnavailable',
      title: t('Maintenance Resources'),
      sortable: true,
      hidden: !selectedAccessors.includes('device.resourceUnavailable'),
      render: ({ id, device }) => {
        return device.resourceUnavailable ? (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <AvailableToIconForNode unavailableNumber={device.resourceUnavailable} />
            </Box>
            <PageLink
              title={t('Resources.list')}
              path={'/cdim/res-resource-list'}
              query={{ nodeId: id, resourceAvailable: 'Unavailable' }}
              key={id}
            >
              {device.resourceUnavailable.toString()}
            </PageLink>
          </Group>
        ) : (
          <Group gap={5} wrap='nowrap'>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <AvailableToIconForNode unavailableNumber={device.resourceUnavailable} />
            </Box>
            {device.resourceUnavailable.toString()}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Maintenance Resources')}
          options={nodeFilter.selectOptions.number}
          value={nodeFilter.query.unavailable}
          setValue={(value: string[]) => nodeFilter.setQuery.unavailable(value as NumberOptionValue[])}
        />
      ),
      filtering: nodeFilter.query.unavailable.length > 0,
    },
  ];
};
