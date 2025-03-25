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

import type { Meta, StoryObj } from '@storybook/react';

import { AllocatedViewAll } from '@/components';

const meta = {
  title: 'Components/AllocatedViewAll',
  component: AllocatedViewAll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
    // type: { control: 'select', options: ['error', 'warning', 'infomation'] },
  },
} satisfies Meta<typeof AllocatedViewAll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    title: 'Test All with Volume',
    device: {
      allocated: 30,
      all: 120,
    },
    volume: {
      allocated: '190',
      all: '520',
      unit: 'cores',
    },
  },
};
export const EmptyTitle: Story = {
  args: {
    title: '',
    device: {
      allocated: 30,
      all: 120,
    },
    volume: {
      allocated: '190',
      all: '520',
      unit: 'cores',
    },
  },
};
export const EmptyVolume: Story = {
  args: {
    title: 'empty volume',
    device: {
      allocated: 30,
      all: 120,
    },
  },
};
export const DeviceAllZero: Story = {
  args: {
    title: 'device all zero',
    device: {
      allocated: 30,
      all: 0,
    },
    volume: {
      allocated: '190',
      all: '520',
      unit: 'cores',
    },
  },
};
