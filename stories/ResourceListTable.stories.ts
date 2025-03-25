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

import { ResourceListTable } from '@/components';

import { dummyNodeDetail } from '@/utils/dummy-data/node-detail/nodes';

const meta = {
  title: 'Components/ResourceListTable',
  component: ResourceListTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
    // type: { control: 'select', options: ['error', 'warning', 'information'] },
  },
} satisfies Meta<typeof ResourceListTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default */
export const Standard: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [
      'id',
      'type',
      'health',
      'state',
      // 'powerConsumption',
      // 'useRate',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ],
    /** Data */
    data: dummyNodeDetail.resources,
    /** Loading state */
    loading: false,
    /** Show accessor selector */
    showAccessorSelector: true,
    /** Show pagination */
    showPagination: true,
  },
};

/** Empty selected accessors */
export const EmptySelectedAccessors: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [],
    /** Data */
    data: dummyNodeDetail.resources,
    /** Loading state */
    loading: false,
    /** Show accessor selector */
    showAccessorSelector: true,
    /** Show pagination */
    showPagination: true,
  },
};

/** Empty data */
export const EmptyData: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [
      'id',
      'type',
      'health',
      'state',
      // 'powerConsumption',
      // 'useRate',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ],
    /** Data */
    data: [],
    /** Loading state */
    loading: false,
    /** Show accessor selector */
    showAccessorSelector: true,
    /** Show pagination */
    showPagination: true,
  },
};

/** Loading true */
export const LoadingTrue: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [
      'id',
      'type',
      'health',
      'state',
      // 'powerConsumption',
      // 'useRate',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ],
    /** Data */
    data: dummyNodeDetail.resources,
    /** Loading state */
    loading: true,
    /** Show accessor selector */
    showAccessorSelector: true,
    /** Show pagination */
    showPagination: true,
  },
};

/** Hidden accessor selector */
export const HiddenAccessorSelector: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [
      'id',
      'type',
      'health',
      'state',
      // 'powerConsumption',
      // 'useRate',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ],
    /** Data */
    data: dummyNodeDetail.resources,
    /** Loading state */
    loading: false,
    /** Show accessor selector */
    showAccessorSelector: false,
    /** Show pagination */
    showPagination: true,
  },
};

/** Hidden pagination */
export const HiddenPagination: Story = {
  args: {
    /** Selected accessors */
    selectedAccessors: [
      'id',
      'type',
      'health',
      'state',
      // 'powerConsumption',
      // 'useRate',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ],
    /** Data */
    data: dummyNodeDetail.resources,
    /** Loading state */
    loading: false,
    /** Show accessor selector */
    showAccessorSelector: true,
    /** Show pagination */
    showPagination: false,
  },
};
