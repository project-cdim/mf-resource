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

import { AllocatedView } from '@/components';

const meta = {
  title: 'Components/AllocatedView',
  component: AllocatedView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
    // type: { control: 'select', options: ['error', 'warning', 'infomation'] },
  },
} satisfies Meta<typeof AllocatedView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    title: 'Test',
    item: {
      device: {
        type: 'CPU', // 必須プロパティを追加
        allocated: 25,
        all: 100,
      },
      volume: {
        allocated: '180',
        all: '500',
        unit: 'cores',
      },
    },
    loading: false,
  },
};
export const EmptyTitle: Story = {
  args: {
    title: '',
    item: {
      device: {
        type: 'CPU',
        allocated: 25,
        all: 100,
      },
      volume: {
        allocated: '180',
        all: '500',
        unit: 'cores',
      },
    },
    loading: false,
  },
};
export const EmptyVolume: Story = {
  args: {
    title: 'empty volume',
    item: {
      device: {
        type: 'CPU',
        allocated: 25,
        all: 100,
      },
    },
    loading: false,
  },
};
export const DeviceAllZero: Story = {
  args: {
    title: 'device all zero',
    item: {
      device: {
        type: 'CPU',
        allocated: 25,
        all: 0,
      },
      volume: {
        allocated: '180',
        all: '500',
        unit: 'cores',
      },
    },
    loading: false,
  },
};
