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

import { TabList, TabPanel } from '@/components';

import { dummyResourcesDetail } from '@/utils/dummy-data/index/resources';

const meta: Meta<typeof TabPanel> = {
  title: 'Components/TabPanel',
  component: TabPanel,
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
    <Tabs defaultValue='Accelerator'>
      <TabList
        tabs={[
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
      <TabPanel
        tabs={[
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
        data={dummyResourcesDetail}
        rangeGraphData={undefined}
        singleGraphData={undefined}
        startDate={undefined}
        endDate={undefined}
      />
    </Tabs>
  ),
};
export const Summary: Story = {
  render: () => (
    <Tabs defaultValue='summary'>
      <TabList tabs={['summary']} />
      <TabPanel
        tabs={['summary']}
        data={dummyResourcesDetail}
        rangeGraphData={undefined}
        singleGraphData={undefined}
        startDate={undefined}
        endDate={undefined}
      />
    </Tabs>
  ),
};
export const EmptyData: Story = {
  render: () => (
    <Tabs defaultValue='GPU'>
      <TabList
        tabs={[
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
      <TabPanel
        tabs={[
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
        data={undefined}
        rangeGraphData={undefined}
        singleGraphData={undefined}
        startDate={undefined}
        endDate={undefined}
      />
    </Tabs>
  ),
};

export const SummaryEmpty: Story = {
  render: () => (
    <Tabs defaultValue='summary'>
      <TabList tabs={['summary']} />
      <TabPanel
        tabs={['summary']}
        data={undefined}
        rangeGraphData={undefined}
        singleGraphData={undefined}
        startDate={undefined}
        endDate={undefined}
      />
    </Tabs>
  ),
};
