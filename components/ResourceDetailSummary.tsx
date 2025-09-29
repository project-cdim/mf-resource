/* eslint-disable complexity */
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

import { Group, Stack, Text } from '@mantine/core';
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
  StateToIcon,
  ResourceGroupSelectButton,
} from '@/components';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';

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

  let health;
  let state;
  let deviceType;
  let deviceSwitchInfo;
  let nodeIDs;
  let available;
  let deviceID;
  let detected;
  let resourceGroupIDs;

  if (props.data) {
    health = props.data.device.status?.health;
    state = props.data.device.status?.state;
    deviceType = props.data.device.type;
    deviceSwitchInfo = props.data.device.deviceSwitchInfo;
    nodeIDs = props.data.nodeIDs;
    available = props.data.annotation.available;
    deviceID = props.data.device.deviceID;
    detected = props.data.detected;
    resourceGroupIDs = props.data.resourceGroupIDs;
  }

  const healthIcon = HealthToIcon(health);
  const stateIcon = StateToIcon(state);
  const detectedIcon = DetectionStatusToIcon(detected);
  const availableIcon = AvailableToIcon(available ? 'Available' : 'Unavailable');

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
    { columnName: t('CXL Switch'), value: deviceSwitchInfo },
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
      columnName: t('Health'),
      value: (
        <Group gap={5}>
          {healthIcon}
          {health}
        </Group>
      ),
    },
    {
      columnName: t('State'),
      value: (
        <Group gap={5}>
          {stateIcon}
          {state}
        </Group>
      ),
    },
    {
      columnName: t('Detection Status'),
      value: props.data && (
        <Group gap={5}>
          {detectedIcon}
          {detected ? t('Detected') : t('Not Detected')}
        </Group>
      ),
    },
    {
      columnName: t('Included in design'),
      value: props.data && (
        <Group>
          <Group gap={5}>
            {availableIcon}
            {available ? t('Included') : t('Excluded')}
          </Group>
          <AvailableButton isAvailable={available} deviceId={deviceID} doOnSuccess={props.doOnSuccess} />
        </Group>
      ),
    },
  ];
  return (
    <Stack>
      <CardLoading withBorder maw={'32em'} loading={props.loading}>
        <Text fz='sm'>{t('Device ID')}</Text>
        <Text fz='lg' fw={500}>
          {deviceID}
        </Text>
      </CardLoading>
      <HorizontalTable tableData={tableData} loading={props.loading} />
    </Stack>
  );
};
