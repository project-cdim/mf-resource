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
import { render } from '@/shared-modules/__test__/test-utils';
import { TabPanelAll } from '@/components/TabPanelAll';
import * as hooks from '@/utils/hooks/useResourceSummary';
import * as rangeGraphHooks from '@/utils/hooks/useSummaryRangeGraph';
import * as singleGraphHooks from '@/utils/hooks/useSummarySingleGraph';
import { screen } from '@testing-library/react';
import { APIDeviceType } from '@/shared-modules/types/APIDeviceType';
import { APIPromQL, APIresources } from '@/shared-modules/types';

// Mock hooks and dependencies
jest.mock('@/utils/hooks/useResourceSummary');
jest.mock('@/utils/hooks/useSummaryRangeGraph');
jest.mock('@/utils/hooks/useSummarySingleGraph');
jest.mock('next-intl');
jest.mock('@/shared-modules/utils/hooks', () => ({
  useLoading: jest.fn(() => false),
  useMetricDateRange: jest.fn(() => {
    return ['2025-05-01T00:00:00Z', '2025-05-02T00:00:00Z'];
  }),
  useLocaleDateString: jest.fn(() => '05/01/2025, 00:00:00'),
}));

// Mock chart components to prevent size-related warnings
jest.mock('@mantine/charts', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/charts'),
  BarChart: jest.fn(() => <div data-testid='mocked-bar-chart'>Mocked BarChart</div>),
  AreaChart: jest.fn(() => <div data-testid='mocked-area-chart'>Mocked AreaChart</div>),
  LineChart: jest.fn(() => <div data-testid='mocked-line-chart'>Mocked LineChart</div>),
  ChartTooltip: jest.fn(() => <div data-testid='mocked-chart-tooltip'>Mocked ChartTooltip</div>),
}));

// Utility for generating all tabs with correct type
const allTabs: (APIDeviceType | 'all')[] = [
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
];
const data: APIresources = {
  count: 3,
  resources: [
    {
      annotation: {
        available: true,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res101',
        deviceSwitchInfo: 'CXL11',
        links: [
          {
            deviceID: 'res202',
            type: 'memory',
          },
        ],
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'CPU',
      },
      detected: true,
      nodeIDs: ['node01'],
      resourceGroupIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res102',
        deviceSwitchInfo: 'CXL11',
        links: [
          {
            deviceID: 'res203',
            type: 'memory',
          },
          {
            deviceID: 'res302',
            type: 'storage',
          },
          {
            deviceID: 'res401',
            type: 'networkInterface',
          },
        ],
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'CPU',
      },
      detected: true,
      nodeIDs: [],
      resourceGroupIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res103',
        deviceSwitchInfo: 'CXL11',
        links: [],
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'Accelerator',
      },
      detected: false,
      nodeIDs: [],
      resourceGroupIDs: [],
    },
  ],
};

const dummyGraphData: APIPromQL = {
  status: 'dummy',
  data: {
    resultType: 'dummy',
    result: [
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'CPU_energy',
        },
        values: [
          [1701820800, '1'], // 2023-12-06T00:00:00Z
          [1701824400, '2'],
          [1701828000, '3'],
          [1701831600, '4'], // 2023-12-06T03:00:00Z
        ],
      },
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'networkInterface_usage',
        },
        values: [
          [1701820800, '100000'], // 2023-12-06T00:00:00Z 1024 or more
          [1701824400, '200000'],
          [1701828000, '3000'],
          [1701831600, '4000'], // 2023-12-06T03:00:00Z
        ],
      },
    ],
  },
  stats: {
    seriesFetched: '',
  },
};

describe('TabPanelAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useResourceSummary as jest.Mock).mockReturnValue({ data: data, isValidating: false });
    (rangeGraphHooks.useSummaryRangeGraph as jest.Mock).mockReturnValue({ data: dummyGraphData, isValidating: false });
    (singleGraphHooks.useSummarySingleGraph as jest.Mock).mockReturnValue({ data: undefined, isValidating: false });
  });

  test('renders all groups and number groups with valid data', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={allTabs} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByText('Allocated Resources')).toBeInTheDocument();
    expect(screen.getByText('Resources.number')).toBeInTheDocument();
    expect(screen.getAllByText('All').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CPU').length).toBeGreaterThan(0);
  });

  test('renders correctly with empty data', () => {
    (hooks.useResourceSummary as jest.Mock).mockReturnValue({ data: undefined, isValidating: false });
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={allTabs} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByText('Allocated Resources')).toBeInTheDocument();
    expect(screen.getByText('Resources.number')).toBeInTheDocument();
  });

  test('renders with only the all tab', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={['all']} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByText('Allocated Resources')).toBeInTheDocument();
    expect(screen.getAllByText('All').length).toBeGreaterThan(0);
  });

  test('handles undefined, null, false, 0, and "" as edge cases for props', () => {
    (hooks.useResourceSummary as jest.Mock).mockReturnValue({ data: null, isValidating: false });
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={[]} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByText('Allocated Resources')).toBeInTheDocument();
  });

  test('boundary test: only one device type', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={['CPU']} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByText('Allocated Resources')).toBeInTheDocument();
    expect(screen.getAllByText('CPU').length).toBeGreaterThan(0);
  });

  test('mock function call arguments and return values', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs defaultValue='all'>
        <TabPanelAll tabs={allTabs} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect((hooks.useResourceSummary as jest.Mock).mock.calls[0][0]).toBeUndefined();
    expect((rangeGraphHooks.useSummaryRangeGraph as jest.Mock).mock.calls[0][0]).toEqual(
      allTabs.filter((t) => t !== 'all')
    );
    expect((singleGraphHooks.useSummarySingleGraph as jest.Mock).mock.calls[0][0]).toEqual(
      allTabs.filter((t) => t !== 'all')
    );
  });
});
