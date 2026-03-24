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

/* eslint-disable complexity */

import { Box, Divider, Group, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { AxiosResponse } from 'axios';

import { CardLoading, HorizontalTable, PageLink } from '@/shared-modules/components';
import { APIresource } from '@/shared-modules/types';

import {
  AvailableButton,
  AvailableToIcon,
  HealthToIcon,
  DetectionStatusToIcon,
  PowerStateToIcon,
  StateToIcon,
  StatusToIcon,
  ResourceGroupSelectButton,
} from '@/components';
import { calculateOverallStatus } from '@/utils/calculateOverallStatus';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import { parseDevicePortList, parsePlacement } from '@/utils/parse';

/**
 * Renders the summary component for a resource.
 *
 * @param props - The component props.
 * @returns The rendered summary component.
 */
export const ResourceDetailSummary = (props: {
  data?: APIresource;
  doOnSuccess: (axiosResOrOperation: AxiosResponse | { operation: string }) => void;
  loading: boolean;
}) => {
  const t = useTranslations();

  const deviceID = props.data?.device.deviceID;
  const deviceType = props.data?.device.type;
  const resourceGroupIDs = props.data?.resourceGroupIDs;
  const placement = props.data?.physicalLocation;
  const devicePortList = parseDevicePortList(props.data?.device.devicePortList);
  const nodeIDs = props.data?.nodeIDs;
  const unitID = props.data?.deviceUnit.id;
  const composite = (props.data?.device.constraints?.nonRemovableDevices?.length ?? 0) > 0;
  const health = props.data?.device.status?.health;
  const state = props.data?.device.status?.state;
  const powerState = props.data?.device.powerState;
  const detected = props.data?.detected;
  const available = props.data?.deviceUnit.annotation.systemItems.available;
  const overallStatus = health && state ? calculateOverallStatus(health, state) : undefined;

  const { getNameById: getResourceGroupName } = useResourceGroupsData();

  const tableData = [
    { columnName: t('Type'), value: _.upperFirst(deviceType) },
    {
      columnName: t('Resource Group'),
      value: (
        <Group gap='md'>
          <Stack gap={0}>
            {resourceGroupIDs?.map((id) => (
              <PageLink
                title={t('Resource Group Details')}
                path='/cdim/res-resource-group-detail'
                query={{ id: id }}
                key={id}
              >
                {getResourceGroupName(id) !== '' ? getResourceGroupName(id) : id}
              </PageLink>
            ))}
          </Stack>
          {props.data && (
            <ResourceGroupSelectButton
              deviceId={deviceID}
              currentResourceGroupIds={resourceGroupIDs ?? []}
              disabled={props.loading}
              doOnSuccess={() => {
                props.doOnSuccess({ operation: 'UpdateResourceGroup' });
              }}
            />
          )}
        </Group>
      ),
    },
    {
      columnName: t('Placement'),
      value: (
        <Stack gap={0}>
          {placement && Object.keys(placement).length > 0 && (
            <PageLink
              title={t('Rack Elevations')}
              path={'/cdim/res-rack'}
              query={{ rackId: placement.rack.id, chassisId: placement.rack.chassis.id }}
              key={placement.rack.id}
            >
              {parsePlacement(placement)}
            </PageLink>
          )}
        </Stack>
      ),
    },
    {
      columnName: t('CXL Switch'),
      value: (
        <Stack gap={0}>
          {devicePortList?.map((switchId) => (
            <span key={switchId}>{switchId}</span>
          ))}
        </Stack>
      ),
    },
    {
      columnName: t('Node'),
      value: (
        <Stack gap={0}>
          {nodeIDs?.map((nodeId) => (
            <PageLink title={t('Node Details')} path={'/cdim/res-node-detail'} query={{ id: nodeId }} key={nodeId}>
              {nodeId}
            </PageLink>
          ))}
        </Stack>
      ),
    },
    {
      columnName: t('Composite Resource'),
      value: (
        <Stack gap={0}>
          {composite && (
            <PageLink
              title={t('Composite Resource Details')}
              path={'/cdim/res-composite-resource-detail'}
              query={{ id: unitID || '' }}
              key={unitID}
            >
              {t('Composite')}
            </PageLink>
          )}
        </Stack>
      ),
    },
    {
      columnName: t('Power State'),
      value: props.data && (
        <Group gap={5}>
          <PowerStateToIcon powerState={powerState} />
          {powerState && t.has(powerState) ? t(powerState) : powerState}
        </Group>
      ),
    },
    {
      columnName: t('Health'),
      value: (
        <Group gap={5}>
          <HealthToIcon health={health} />
          {health}
        </Group>
      ),
    },
    {
      columnName: t('State'),
      value: (
        <Group gap={5}>
          <StateToIcon state={state} />
          {state}
        </Group>
      ),
    },
    {
      columnName: t('Detection Status'),
      value: props.data && (
        <Group gap={5}>
          <DetectionStatusToIcon detected={detected} />
          {detected ? t('Detected') : t('Not Detected')}
        </Group>
      ),
    },
    {
      columnName: t('Maintenance'),
      value: props.data && (
        <Group>
          <Group gap={5}>
            <AvailableToIcon resourceAvailable={available ? 'Available' : 'Unavailable'} />
            {available ? '' : t('Under Maintenance')}
          </Group>
          <AvailableButton
            isAvailable={available}
            unitId={unitID}
            secondaryMessage={
              composite
                ? t('All resources within the composite resource that this resource belongs to will be targeted')
                : ''
            }
            doOnSuccess={props.doOnSuccess}
          />
        </Group>
      ),
    },
  ];
  return (
    <Stack>
      <CardLoading withBorder maw={'32em'} loading={props.loading}>
        <Group align='flex-start' gap='md'>
          <Box>
            <Text fz='sm'>{t('Status')}</Text>
            <Group gap={5}>
              <StatusToIcon status={overallStatus} />
              <Text fz='lg' fw={500}>
                {overallStatus ? t(overallStatus) : ''}
              </Text>
            </Group>
          </Box>
          <Divider orientation='vertical' />
          <Box>
            <Text fz='sm'>{t('Device ID')}</Text>
            <Text fz='lg' fw={500}>
              {deviceID}
            </Text>
          </Box>
        </Group>
      </CardLoading>
      <HorizontalTable tableData={tableData} loading={props.loading} />
    </Stack>
  );
};
