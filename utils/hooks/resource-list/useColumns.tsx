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
import _ from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  PageLink,
  TextInputForTableFilter,
  MultiSelectForTableFilter,
  LongSentences,
} from '@/shared-modules/components';
import {
  APIDeviceAvailable,
  APIDeviceDetection,
  APIDeviceHealth,
  APPDeviceOverallStatus,
  APIDevicePowerState,
  APIDeviceState,
  APIDeviceType,
} from '@/shared-modules/types';

import { APPResource } from '@/types';

import {
  AvailableToIcon,
  DetectionStatusToIcon,
  HealthToIcon,
  PowerStateToIcon,
  StateToIcon,
  StatusToIcon,
} from '@/components';

import { ResourceListFilter } from '@/utils/hooks/useResourceListFilter';
import { parsePlacement } from '@/utils/parse';

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
          <Stack gap={0}>
            <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id }}>
              <LongSentences text={id} />
            </PageLink>
          </Stack>
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
      noWrap: true,
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
      accessor: 'status',
      title: t('Status'),
      sortable: true,
      hidden: !selectedAccessors.includes('status'),
      render: ({ status }) => {
        const displayStatus = status ? t(status) : '';
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StatusToIcon status={status} />
            </Box>
            {displayStatus}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Status')}
          options={resourceFilter.selectOptions.status}
          value={resourceFilter.query.statuses}
          setValue={(value) => resourceFilter.setQuery.statuses(value as APPDeviceOverallStatus[])}
        />
      ),
      filtering: resourceFilter.query.statuses.length > 0,
    },
    {
      accessor: 'powerState',
      title: t('Power State'),
      sortable: true,
      hidden: !selectedAccessors.includes('powerState'),
      render: ({ powerState }) => {
        const displayPowerState = t.has(powerState) ? t(powerState) : powerState;
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <PowerStateToIcon powerState={powerState} />
            </Box>
            {displayPowerState}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Power State')}
          options={resourceFilter.selectOptions.powerState}
          value={resourceFilter.query.powerStates}
          setValue={(value) => resourceFilter.setQuery.powerStates(value as APIDevicePowerState[])}
        />
      ),
      filtering: resourceFilter.query.powerStates.length > 0,
    },
    {
      accessor: 'health',
      title: t('Health'),
      sortable: true,
      hidden: !selectedAccessors.includes('health'),
      render: ({ health }) => {
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <HealthToIcon health={health} />
            </Box>
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
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StateToIcon state={state} />
            </Box>
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
      accessor: 'detected',
      title: t('Detection Status'),
      sortable: true,
      hidden: !selectedAccessors.includes('detected'),
      render: ({ detected }) => {
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <DetectionStatusToIcon detected={detected} />
            </Box>
            {detected ? t('Detected') : t('Not Detected')}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Detection Status')}
          options={resourceFilter.selectOptions.detection}
          value={resourceFilter.query.detection}
          setValue={(value) => resourceFilter.setQuery.detection(value as APIDeviceDetection[])}
        />
      ),
      filtering: resourceFilter.query.detection.length > 0,
    },
    {
      accessor: 'resourceAvailable',
      title: t('Maintenance'),
      sortable: true,
      hidden: !selectedAccessors.includes('resourceAvailable'),
      render: ({ resourceAvailable }) => {
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <AvailableToIcon resourceAvailable={resourceAvailable} />
            </Box>
            {resourceAvailable === 'Available' ? '' : t('Under Maintenance')}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Maintenance')}
          options={resourceFilter.selectOptions.available}
          value={resourceFilter.query.available}
          setValue={(value) => resourceFilter.setQuery.available(value as APIDeviceAvailable[])}
        />
      ),
      filtering: resourceFilter.query.available.length > 0,
    },
    {
      accessor: 'resourceGroups',
      title: t('Resource Group'),
      sortable: true,
      hidden: !selectedAccessors.includes('resourceGroups'),
      filter: (
        <>
          <TextInputForTableFilter
            label={t('Resource Group')}
            value={resourceFilter.query.resourceGroups}
            setValue={resourceFilter.setQuery.resourceGroups}
          />
        </>
      ),
      render: ({ resourceGroups }) => (
        <Stack gap={0}>
          {resourceGroups.map(({ id, name }) => (
            <PageLink
              title={t('Resource Group Details')}
              path={'/cdim/res-resource-group-detail'}
              query={{ id: id }}
              key={id}
            >
              <LongSentences text={name !== '' ? name : id} />
            </PageLink>
          ))}
        </Stack>
      ),
      filtering: resourceFilter.query.resourceGroups !== '',
    },
    {
      accessor: 'placement',
      title: t('Placement'),
      sortable: true,
      hidden: !selectedAccessors.includes('placement'),
      render: ({ placement }) => {
        if (!placement || Object.keys(placement).length === 0) {
          return undefined;
        }
        // Extract chassis name from placement string (format: "RackName/ChassisName")
        const showPlacement = parsePlacement(placement);

        return (
          <Stack gap={0}>
            <PageLink
              title={t('Rack Elevations')}
              path={'/cdim/res-rack'}
              query={{ rackId: placement.rack.id, chassisId: placement.rack.chassis.id }}
            >
              {showPlacement && <LongSentences text={showPlacement} />}
            </PageLink>
          </Stack>
        );
      },
      filter: (
        <TextInputForTableFilter
          label={t('Placement')}
          value={resourceFilter.query.placement}
          setValue={resourceFilter.setQuery.placement}
        />
      ),
      filtering: resourceFilter.query.placement !== '',
    },
    {
      accessor: 'cxlSwitch',
      title: t('CXL Switch'),
      sortable: true,
      hidden: !selectedAccessors.includes('cxlSwitch'),
      render: ({ cxlSwitch }) => (
        <Stack gap={0}>
          {cxlSwitch.map((switchId) => (
            <LongSentences key={switchId} text={switchId} />
          ))}
        </Stack>
      ),
      filter: (
        <>
          <TextInputForTableFilter
            label={t('CXL Switch')}
            value={resourceFilter.query.cxlSwitch}
            setValue={resourceFilter.setQuery.cxlSwitch}
          />
          <MultiSelectForTableFilter
            label={t('Allocate state')}
            options={resourceFilter.selectOptions.allocate}
            value={resourceFilter.query.allocatedCxl}
            setValue={(value: string[]) => resourceFilter.setQuery.allocatedCxl(value as string[])}
          />
        </>
      ),
      filtering: resourceFilter.query.allocatedCxl.length > 0 || resourceFilter.query.cxlSwitch !== '',
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
              <LongSentences text={nodeId} />
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
      accessor: 'composite',
      title: t('Composite Resource'),
      sortable: true,
      noWrap: true,
      hidden: !selectedAccessors.includes('composite'),
      render: ({ composite }) =>
        composite ? (
          <PageLink
            title={t('Composite Resource Details')}
            path={'/cdim/res-composite-resource-detail'}
            query={{ id: composite }}
          >
            {t('Composite')}
          </PageLink>
        ) : (
          ''
        ),
      filter: (
        <MultiSelectForTableFilter
          label={t('Composite Resource')}
          options={resourceFilter.selectOptions.composite}
          value={resourceFilter.query.composite}
          setValue={(value) => resourceFilter.setQuery.composite(value as string[])}
        />
      ),
      filtering: resourceFilter.query.composite.length > 0,
    },
  ];
};
