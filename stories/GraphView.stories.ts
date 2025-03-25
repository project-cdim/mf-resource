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

import { GraphView } from '@/shared-modules/components';
import {
  chartData,
  chartDataLastZero,
  chartDataMissing,
  multiChartData,
  multiChartDataLastZero,
  multiChartDataMissing,
} from '@/shared-modules/utils/dummy-data/GraphView';

const meta = {
  title: 'Components/GraphView',
  component: GraphView,
  parameters: {
    // layout: 'centered',
  },
  tags: ['autodocs'],
  // argTypes: {},
  /** Link destination */
  // link?: "string",
  /** Link destination parameters */
  // query?: ResourceListQuery,
  // },
} satisfies Meta<typeof GraphView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single graph */
export const Standard: Story = {
  args: {
    title: 'Title',
    data: chartData,
    valueFormatter: () => 'valueFormatter',
  },
};

/** Single graph with link */
export const WithLink: Story = {
  args: {
    title: 'Title+Link',
    data: chartData,
    valueFormatter: () => 'valueFormatter',
    link: '',
    query: {
      cxlSwitchId: ['cxlSwitchId1', 'cxlSwitchId2'],
      type: ['CPU'],
      allocatednode: ['allocatednode1', 'allocatednode2'],
      state: ['Enabled'],
      health: ['OK'],
      resourceAvailable: ['Available', 'Unavailable'],
    },
  },
};

/** Multiple graphs */
export const MultiData: Story = {
  args: {
    title: 'Title',
    data: multiChartData,
    valueFormatter: () => 'valueFormatter',
  },
};

/** Multiple stacked graphs */
export const MultiDataStack: Story = {
  args: {
    title: 'Title',

    data: multiChartData,
    stack: true,

    valueFormatter: () => 'valueFormatter',

    //
    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};

/** Single graph (some data missing) */
export const MissingData: Story = {
  args: {
    title: 'Title',

    data: chartDataMissing,

    valueFormatter: () => 'valueFormatter',

    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};

/** Multiple graphs (some data missing) */
export const MissingMultiData: Story = {
  args: {
    title: 'Title',

    data: multiChartDataMissing,

    valueFormatter: () => 'valueFormatter',

    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};

/** Multiple stacked graphs (some data missing) */
export const MissingMultiDataStack: Story = {
  args: {
    title: 'Title',

    data: multiChartDataMissing,
    stack: true,

    valueFormatter: () => 'valueFormatter',

    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};

/** Single graph (last data is 0) */
export const SingleDataStackLastZero: Story = {
  args: {
    title: 'Title',

    data: chartDataLastZero,
    stack: true,

    valueFormatter: () => 'valueFormatter',

    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};
SingleDataStackLastZero.storyName = 'Single graph (last data is 0)';

/** Multiple stacked graphs (last data is 0) */
export const MultiDataStackLastZero: Story = {
  args: {
    title: 'Title',

    data: multiChartDataLastZero,
    stack: true,

    valueFormatter: () => 'valueFormatter',

    //
    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};
MultiDataStackLastZero.storyName = 'Multiple stacked graphs (last data is 0)';

/** Multiple graphs (last data is 0) */
export const MultiDataLastZero: Story = {
  args: {
    title: 'Title',

    data: multiChartDataLastZero,
    stack: false,

    valueFormatter: () => 'valueFormatter',

    //
    /** Link destination */
    // link?: "string",
    /** Link destination parameters */
    // query?: ResourceListQuery;
  },
};
MultiDataLastZero.storyName = 'Multiple graphs (last data is 0)';
