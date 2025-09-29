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

import React from 'react';

import { Tabs } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';

import { TabList, TabPanelAll } from '@/components';

const meta: Meta<typeof TabPanelAll> = {
  title: 'Components/TabPanelAll',
  component: TabPanelAll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  //   argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  render: () => (
    <Tabs defaultValue='all'>
      <TabList
        tabs={[
          'all',
          'Accelerator',
          'CPU',
          'DSP',
          'FPGA',
          'GPU',
          'UnknownProcessor',
          'memory',
          'storage',
          'networkInterface',
          'graphicController',
          'virtualMedia',
        ]}
      />
      <TabPanelAll
        tabs={[
          'all',
          'Accelerator',
          'CPU',
          'DSP',
          'FPGA',
          'GPU',
          'UnknownProcessor',
          'memory',
          'storage',
          'networkInterface',
          'graphicController',
          'virtualMedia',
        ]}
        dateRange={[new Date('2024-01-01'), new Date('2024-01-31')]}
        setDateRange={() => {}}
      />
    </Tabs>
  ),
};

export const All: Story = {
  render: () => (
    <Tabs defaultValue='all'>
      <TabList tabs={['all']} />
      <TabPanelAll
        tabs={['all']}
        dateRange={[new Date('2024-01-01'), new Date('2024-01-31')]}
        setDateRange={() => {}}
      />
    </Tabs>
  ),
};

export const EmptyData: Story = {
  render: () => (
    <Tabs defaultValue='all'>
      <TabList
        tabs={[
          'all',
          'Accelerator',
          'CPU',
          'DSP',
          'FPGA',
          'GPU',
          'UnknownProcessor',
          'memory',
          'storage',
          'networkInterface',
          'graphicController',
          'virtualMedia',
        ]}
      />
      <TabPanelAll
        tabs={[
          'all',
          'Accelerator',
          'CPU',
          'DSP',
          'FPGA',
          'GPU',
          'UnknownProcessor',
          'memory',
          'storage',
          'networkInterface',
          'graphicController',
          'virtualMedia',
        ]}
        dateRange={[new Date('2024-01-01'), new Date('2024-01-31')]}
        setDateRange={() => {}}
      />
    </Tabs>
  ),
};

export const AllEmptyData: Story = {
  render: () => (
    <Tabs defaultValue='all'>
      <TabList tabs={['all']} />
      <TabPanelAll
        tabs={['all']}
        dateRange={[new Date('2024-01-01'), new Date('2024-01-31')]}
        setDateRange={() => {}}
      />
    </Tabs>
  ),
};
