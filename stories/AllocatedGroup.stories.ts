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

import { AllocatedGroup } from '@/components';

const meta = {
  title: 'Components/AllocatedGroup',
  component: AllocatedGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
    // type: { control: 'select', options: ['error', 'warning', 'infomation'] },
  },
} satisfies Meta<typeof AllocatedGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
const LOADING_FLAG = false;

export const Standard: Story = {
  args: {
    title: 'Group with Items',
    items: [
      {
        title: 'Item 1',
        device: {
          type: 'CPU',
          allocated: 30,
          all: 120,
        },
        loading: LOADING_FLAG,
      },
      {
        title: 'Item 2',
        device: {
          type: 'CPU',
          allocated: 40,
          all: 140,
        },
        volume: {
          allocated: '190',
          all: '520',
          unit: 'cores',
        },
        loading: LOADING_FLAG,
      },
    ],
  },
};
export const EmptyTitle: Story = {
  args: {
    title: '',
    items: [
      {
        title: 'Item 1',
        device: {
          type: 'CPU',
          allocated: 30,
          all: 120,
        },
        loading: LOADING_FLAG,
      },
      {
        title: 'Item 2',
        device: {
          type: 'CPU',
          allocated: 40,
          all: 140,
        },
        volume: {
          allocated: '190',
          all: '520',
          unit: 'cores',
        },
        loading: LOADING_FLAG,
      },
    ],
  },
};
export const EmptyItems: Story = {
  args: {
    title: 'Group with Items',
    items: [],
  },
};
