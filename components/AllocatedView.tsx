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

import { Group, Progress, Stack, Text, Title } from '@mantine/core';

import { PERCENT } from '@/shared-modules/constant';
import { CardLoading, PageLink } from '@/shared-modules/components';
import { useTranslations } from 'next-intl';
import { APIDeviceType } from '@/shared-modules/types';

/**
 * For AllocatedView.item
 */
export type AllocatedViewProps = {
  /** Title */
  title: string;
  item:
    | {
        device: {
          type: APIDeviceType | 'summary';
          /** Allocated resource count */
          allocated: number;
          /** Total resource count */
          all: number;
        };
        volume?: {
          /** Allocated volume count */
          allocated: string;
          /** Total volume count */
          all: string;
          /** Volume display unit */
          unit: string;
        };
      }
    | undefined;
  /** Loading state */
  loading: boolean;
};

/**
 * Component that displays the number of allocated resources in a node configuration
 * @param props
 * @returns JSX.Element displaying the number of allocated resources in a node configuration
 */
export const AllocatedView = (props: AllocatedViewProps) => {
  return (
    <CardLoading withBorder h={'100%'} loading={props.loading}>
      <AllocatedViewInner {...props} />
    </CardLoading>
  );
};

export const AllocatedViewInner = (props: Exclude<AllocatedViewProps, 'loading'>) => {
  const { device, volume } = props.item ?? {};
  const t = useTranslations();

  const query: { allocatednode: string[]; type?: string[] } = {
    allocatednode: ['Allocated'],
  };
  if (device && device?.type !== 'summary') {
    query.type = [device.type];
  }
  return (
    <Stack justify='flex-end' h={'100%'} gap={5}>
      <PageLink
        title={t('Resources.list')}
        path='/cdim/res-resource-list'
        query={query}
        color='rgb(55 65 81 / var(--tw-text-opacity))'
        display='block'
      >
        <Title size='h4' fw={500}>
          {props.title}
        </Title>
      </PageLink>
      {device && (
        <>
          <Progress value={(device.allocated / device.all) * PERCENT} size='xl' mt='xs' />
          <Group align='baseline' gap={'0.5em'} wrap='nowrap'>
            {/* ex. 25 / 100 Devices */}
            <PageLink
              title={t('Resources.list')}
              path='/cdim/res-resource-list'
              query={query}
              color='rgb(55 65 81 / var(--tw-text-opacity))'
              display='block'
            >
              <Text fz='xl' fw={500} lh={1}>
                {device.allocated}
              </Text>
            </PageLink>
            <Text fz='xl' fw={500} lh={1}>
              {`/ ${device.all} Devices`}
            </Text>
            {volume && (
              <Text fz='xl' fw={500} span>
                {/* ex. (180 / 500 cores) */}
                {`(${volume.allocated} / ${volume.all} ${volume.unit})`}
              </Text>
            )}
          </Group>
        </>
      )}
    </Stack>
  );
};
