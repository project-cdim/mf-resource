/*
 * Copyright 2026 NEC Corporation.
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
import { useTranslations } from 'next-intl';
import { AxiosResponse } from 'axios';

import { HorizontalTable, PageLink } from '@/shared-modules/components';
import { APIDeviceUnit } from '@/shared-modules/types';

import { AvailableButton, AvailableToIcon } from '@/components';
import { parseDevicePortList, parsePlacement } from '@/utils/parse';

/**
 * Renders the summary component for a composite resource (device unit).
 *
 * @param props - The component props.
 * @returns The rendered summary component.
 */
/* eslint-disable complexity */
export const CompositeResourceDetailSummary = (props: {
  data?: APIDeviceUnit;
  doOnSuccess: (axiosRes: AxiosResponse) => void;
  loading: boolean;
}) => {
  const t = useTranslations();

  // Extract common information from first resource
  const firstResource = props.data?.resources?.[0];
  const placement = firstResource?.physicalLocation;
  const devicePortList = parseDevicePortList(firstResource?.device.devicePortList);
  const available = props.data?.annotation.systemItems.available;
  const unitID = props.data?.id;

  const tableData = [
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
            secondaryMessage={t('All resources within the composite resource will be targeted')}
            doOnSuccess={props.doOnSuccess}
          />
        </Group>
      ),
    },
  ];

  return <HorizontalTable tableData={tableData} loading={props.loading} />;
};
