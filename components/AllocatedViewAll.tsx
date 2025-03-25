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
 * Props for the AllocatedViewAll component
 */
export type AllocatedViewAllProps = {
  /** Title */
  title: string;
  device?: {
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
};

/**
 * Component to display resource counts in a node configuration (for the All tab)
 * @param props {@link AllocatedViewAllProps}
 * @returns JSX.Element displaying resource counts in a node configuration
 */
export const AllocatedViewAll = (props: AllocatedViewAllProps) => {
  const { device, volume } = props;
  return (
    <Card withBorder>
      <Title order={2} size='h4' fw={500}>
        {props.title}
      </Title>
      {device && (
        <Text fz='1.875rem' fw={600} mb='-0.5rem'>
          {/* ex. 25 / 100 */}
          {`${device.allocated} / ${device.all}`}
        </Text>
      )}
      {volume ? (
        <Text fz='xl'>
          {/* ex. (180 / 500 cores) */}
          {`(${volume.allocated} / ${volume.all} ${volume.unit})`}
        </Text>
      ) : (
        <Text fz='xl' style={{ visibility: 'hidden' }}>
          {/* Placeholder to keep spacing consistent */}
          &nbsp;
        </Text>
      )}
      {device && <Progress value={(device.allocated / device.all) * PERCENT} size='xl' />}
    </Card>
  );
};
