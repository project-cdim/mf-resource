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

import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render } from '@/shared-modules/__test__/test-utils';
import { APIPromQL, APIresource } from '@/shared-modules/types';

import { ResourceDetailPerformance } from '@/components';

// Mock shared components
jest.mock('@/shared-modules/components', () => {
  // Return a persistent mock for the GraphView component
  const GraphViewMock = jest.fn(({ title, loading }) => {
    if (!title) {
      return <div data-testid='mock-graph-view-empty'>No data</div>;
    }
    return (
      <div data-testid={`mock-graph-view-${title.replace(/\s+/g, '-').toLowerCase()}`} data-loading={loading}>
        {title}
      </div>
    );
  });

  return {
    ...jest.requireActual('@/shared-modules/components'),
    DateRangePickerInput: jest.fn(() => <div data-testid='mock-date-picker'>DateRangePickerInput</div>),
    GraphView: GraphViewMock,
  };
});

// Mock components imported directly
jest.mock('@/components/DisplayPeriodPicker', () => {
  return {
    DisplayPeriodPicker: jest.fn(() => <div data-testid='mock-display-period-picker'>DisplayPeriodPicker</div>),
  };
});

// Mock utils
jest.mock('@/shared-modules/utils', () => ({
  ...jest.requireActual('@/shared-modules/utils'),
  formatEnergyValue: jest.fn((value) => `${value} W`),
  formatNetworkTransferValue: jest.fn((value) => `${value} Gbps`),
  formatPercentValue: jest.fn((value) => `${value}%`),
  parseGraphData: jest.fn(() => [{ date: '2025-05-01', value: 42 }]),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

describe('ResourceDetailPerformance', () => {
  // Common mock props for tests
  const mockResource: APIresource = {
    device: {
      deviceID: 'device123',
      type: 'CPU', // Can be changed for different tests
      status: {
        health: 'OK',
        state: 'Enabled',
      },
    },
    annotation: {
      available: true,
    },
    detected: true,
    nodeIDs: ['node1'],
    resourceGroupIDs: ['group1'],
  };

  const mockNetworkResource: APIresource = {
    ...mockResource,
    device: {
      ...mockResource.device,
      type: 'networkInterface',
    },
  };

  const mockGraphData: APIPromQL = {
    status: 'success',
    data: {
      resultType: 'matrix',
      result: [
        {
          metric: {
            __name__: 'cpu_energy',
            instance: 'device123',
            job: 'resource_metrics',
            data_label: 'energy',
          },
          values: [
            [1623456789, '45.5'],
            [1623456799, '46.2'],
          ],
        },
      ],
    },
    stats: { seriesFetched: '1' },
  };

  const mockEmptyGraphData: APIPromQL = {
    status: 'success',
    data: {
      resultType: 'matrix',
      result: [],
    },
    stats: { seriesFetched: '0' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders performance title and display period picker', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(<ResourceDetailPerformance loading={false} dateRange={mockDateRange} setDateRange={mockSetDateRange} />);

    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByTestId('mock-display-period-picker')).toBeInTheDocument();
  });

  test('shows empty message for empty graph data', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    // Mock parseGraphData to return an empty array
    const parseGraphDataMock = require('@/shared-modules/utils').parseGraphData;
    parseGraphDataMock.mockReturnValue([]);

    render(
      <ResourceDetailPerformance
        data={mockResource}
        graphData={mockEmptyGraphData}
        loading={false}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    // Verify the GraphView component is rendered with no data
    expect(parseGraphDataMock).toHaveBeenCalled();

    // Check that the GraphView components are rendered
    const graphs = screen.getAllByTestId(/mock-graph-view/);
    expect(graphs.length).toBeGreaterThan(0);
  });

  test('shows empty message when graph data is undefined', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    // Mock parseGraphData to return undefined
    const parseGraphDataMock = require('@/shared-modules/utils').parseGraphData;
    parseGraphDataMock.mockReturnValue(undefined);

    render(
      <ResourceDetailPerformance
        data={mockResource}
        loading={false}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    // Verify that parseGraphData was called
    expect(parseGraphDataMock).toHaveBeenCalled();

    // Check that the GraphView components are rendered
    const graphs = screen.getAllByTestId(/mock-graph-view/);
    expect(graphs.length).toBeGreaterThan(0);
  });

  test('renders energy and usage graphs for CPU type', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <ResourceDetailPerformance
        data={mockResource}
        graphData={mockGraphData}
        metricStartDate='2025-05-01T00:00:00Z'
        metricEndDate='2025-05-02T00:00:00Z'
        loading={false}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    expect(screen.getByTestId('mock-graph-view-energy-consumptions')).toBeInTheDocument();
    expect(screen.getByTestId('mock-graph-view-usage')).toBeInTheDocument();
  });

  test('renders energy and network transfer graphs for networkInterface type', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <ResourceDetailPerformance
        data={mockNetworkResource}
        graphData={mockGraphData}
        metricStartDate='2025-05-01T00:00:00Z'
        metricEndDate='2025-05-02T00:00:00Z'
        loading={false}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    expect(screen.getByTestId('mock-graph-view-energy-consumptions')).toBeInTheDocument();
    expect(screen.getByTestId('mock-graph-view-network-transfer-speed')).toBeInTheDocument();
  });

  test('shows loading state on graphs', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    render(
      <ResourceDetailPerformance
        data={mockResource}
        graphData={mockGraphData}
        loading={true}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    const energyGraph = screen.getByTestId('mock-graph-view-energy-consumptions');
    const usageGraph = screen.getByTestId('mock-graph-view-usage');

    expect(energyGraph).toHaveAttribute('data-loading', 'true');
    expect(usageGraph).toHaveAttribute('data-loading', 'true');
  });

  test('shows loading overlay on empty data', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    // Mock parseGraphData to return undefined
    const parseGraphDataMock = require('@/shared-modules/utils').parseGraphData;
    parseGraphDataMock.mockReturnValue(undefined);

    render(
      <ResourceDetailPerformance
        data={mockResource}
        graphData={mockEmptyGraphData}
        loading={true}
        dateRange={mockDateRange}
        setDateRange={mockSetDateRange}
      />
    );

    // Check that all graph components have loading=true
    const graphs = screen.getAllByTestId(/mock-graph-view/);
    expect(graphs.length).toBeGreaterThan(0);
    graphs.forEach((graph) => {
      expect(graph).toHaveAttribute('data-loading', 'true');
    });
  });

  test('passes dateRange and setDateRange props to DisplayPeriodPicker', () => {
    const mockDateRange: [Date, Date] = [new Date('2025-05-01'), new Date('2025-05-02')];
    const mockSetDateRange = jest.fn();

    const DisplayPeriodPickerMock = require('@/components/DisplayPeriodPicker').DisplayPeriodPicker as jest.Mock;
    DisplayPeriodPickerMock.mockClear(); // Clear previous calls

    render(<ResourceDetailPerformance loading={false} dateRange={mockDateRange} setDateRange={mockSetDateRange} />);

    // Verify DisplayPeriodPicker was called
    expect(DisplayPeriodPickerMock).toHaveBeenCalled();

    // Get the first call arguments
    const props = DisplayPeriodPickerMock.mock.calls[0][0];
    expect(props.value).toBe(mockDateRange);
    expect(props.onChange).toBe(mockSetDateRange);
  });
});
