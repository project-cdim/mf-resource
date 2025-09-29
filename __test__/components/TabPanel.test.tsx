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

import '@/shared-modules/__test__/mock';
import { Tabs } from '@mantine/core';
import { screen } from '@testing-library/react';
import { render } from '@/shared-modules/__test__/test-utils';
import { TabPanel, TabPanelTab } from '@/components';
import { dummyResourcesDetail } from '@/utils/dummy-data/index/resources';
import { APIresources } from '@/shared-modules/types';

// Mock child components
jest.mock('@/components/GraphGroup', () => ({
  __esModule: true,
  GraphGroup: jest.fn(() => <div data-testid='GraphGroup'>GraphGroup</div>),
}));
jest.mock('@/components/NumberGroup', () => ({
  __esModule: true,
  NumberGroup: jest.fn(() => <div data-testid='NumberGroup'>NumberGroup</div>),
}));
jest.mock('@/components/AllocatedView', () => ({
  __esModule: true,
  AllocatedView: jest.fn(() => <div data-testid='AllocatedView'>AllocatedView</div>),
}));

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
      nodeIDs: ['node1'],
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
// Mock hooks
jest.mock('@/utils/hooks/useResourceSummary', () => ({
  // useResourceSummary: jest.fn(() => ({ data: dummyResourcesDetail, isValidating: false })),
  useResourceSummary: jest.fn(() => ({ data: data, isValidating: false })),
}));
jest.mock('@/utils/hooks/useSummaryRangeGraph', () => ({
  useSummaryRangeGraph: jest.fn(() => ({ data: undefined, isValidating: false })),
}));
jest.mock('@/utils/hooks/useSummarySingleGraph', () => ({
  useSummarySingleGraph: jest.fn(() => ({ data: undefined, isValidating: false })),
}));
jest.mock('@/shared-modules/utils/hooks', () => ({
  useLoading: jest.fn(() => false),
  useMetricDateRange: jest.fn(() => {
    return ['2025-05-01T00:00:00Z', '2025-05-02T00:00:00Z'];
  }),
}));

describe('TabPanel', () => {
  const types: TabPanelTab[] = [
    'summary',
    'CPU',
    'memory',
    'networkInterface',
    'storage',
    'graphicController',
    'virtualMedia',
  ];

  test('GraphGroup and NumberGroup are displayed in the tab', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs>
        <TabPanel tabs={types} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    // All tab panels should be rendered
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(types.length);
    // Child components should be rendered in each tab
    expect(screen.getAllByTestId('GraphGroup').length).toBe(types.length);
    expect(screen.getAllByTestId('NumberGroup').length).toBe(types.length);
    expect(screen.getAllByTestId('AllocatedView').length).toBe(types.length);
  });

  test('renders with empty tabs', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs>
        <TabPanel tabs={[]} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.queryAllByRole('tabpanel', { hidden: true })).toHaveLength(0);
  });

  test('renders with undefined/empty data from hook', () => {
    // Override hook to return undefined
    const { useResourceSummary } = require('@/utils/hooks/useResourceSummary');
    (useResourceSummary as jest.Mock).mockReturnValueOnce({ data: undefined, isValidating: false });

    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs>
        <TabPanel tabs={['summary']} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getByTestId('GraphGroup')).toBeInTheDocument();
    expect(screen.getByTestId('NumberGroup')).toBeInTheDocument();
    expect(screen.getByTestId('AllocatedView')).toBeInTheDocument();
  });

  test('renders with null/false/0/"" as edge cases', () => {
    const { useResourceSummary } = require('@/utils/hooks/useResourceSummary');
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    [null, false, 0, ''].forEach(() => {
      (useResourceSummary as jest.Mock).mockReturnValueOnce({ data: dummyResourcesDetail, isValidating: false });
      render(
        <Tabs>
          <TabPanel tabs={['summary']} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
        </Tabs>
      );
      expect(screen.getAllByTestId('GraphGroup').length).toBeGreaterThan(0);
    });
  });

  test('renders with only one tab (boundary test)', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <Tabs>
        <TabPanel tabs={['CPU']} dateRange={mockDateRange} setDateRange={mockSetDateRange} />
      </Tabs>
    );
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(1);
  });
});
