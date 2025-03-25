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

import { Card, Progress, Text, Title } from '@mantine/core';

import { PERCENT } from '@/shared-modules/constant';

/**
 * For AllocatedView.item
 */
export type AllocatedViewProps = {
  /** Title */
  title: string;
  item:
    | {
        device: {
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
};

/**
 * Component that displays the number of allocated resources in a node configuration
 * @param props
 * @returns JSX.Element displaying the number of allocated resources in a node configuration
 */
export const AllocatedView = (props: AllocatedViewProps) => {
  const { device, volume } = props.item ?? {};
  return (
    <Card withBorder display='block'>
      <Title size='h4' fw={500}>
        {props.title}
      </Title>
      {device && (
        <>
          <Progress value={(device.allocated / device.all) * PERCENT} size='xl' mt='xs' />
          <Text fz='xl' fw={500} span>
            {/* ex. 25 / 100 Devices */}
            {`${device.allocated} / ${device.all} Devices`}
          </Text>
        </>
      )}

      {volume && (
        <Text fz='xl' fw={500} pl='0.5em' span>
          {/* ex. (180 / 500 cores) */}
          {`(${volume.allocated} / ${volume.all} ${volume.unit})`}
        </Text>
      )}
    </Card>
  );
};
