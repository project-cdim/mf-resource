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

import { chartData } from '@/shared-modules/utils/dummy-data/GraphView';

import { GraphGroup, GraphGroupItem } from '@/components';

const meta = {
  title: 'Components/GraphGroup',
  component: GraphGroup,
  parameters: {
    // layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // argTypes: {
  // },
} satisfies Meta<typeof GraphGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultDateRange: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')];
const dummySetDateRange = () => {};

const graphViewDummy: GraphGroupItem = {
  type: 'graphView',
  props: {
    title: 'graphView Title',
    valueFormatter: () => 'valueFormatter',
    data: chartData,
    loading: false,
    dateRange: defaultDateRange,
    /** URI for retrieving graph data */
    // uri: '',
  },
};

/** Three items */

export const Standard: Story = {
  args: {
    /** Title */
    title: 'Title',
    /** Array of {@link GraphViewDummy} */
    items: [graphViewDummy, graphViewDummy, graphViewDummy],
    dateRange: defaultDateRange,
    setDateRange: dummySetDateRange,
  },
};

/** More than four items (maximum of 4 columns) */

export const ManyItems: Story = {
  args: {
    /** Title */
    title: 'Title',
    /** Array of {@link GraphViewDummy} */
    items: [graphViewDummy, graphViewDummy, graphViewDummy, graphViewDummy, graphViewDummy, graphViewDummy],
    dateRange: defaultDateRange,
    setDateRange: dummySetDateRange,
  },
};
