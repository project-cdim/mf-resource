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

import { Progress, Tooltip } from '@mantine/core';
import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';

import { StorageGraphView, StorageGraphViewProps } from '@/components';

jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  Progress: {
    Root: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Section: jest.fn().mockImplementation((props) => <div {...props} />),
  },
  Tooltip: jest.fn().mockImplementation(({ children, ...props }) => <div {...props}>{children}</div>),
}));

describe('StorageGraphView', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    jest.clearAllMocks();
  });

  test('The component title is displayed', () => {
    const props: StorageGraphViewProps = {
      title: 'Storage Usage Rate',
      data: { used: 0, allocated: 0, overall: 0 },
      loading: false,
    };
    render(<StorageGraphView {...props} />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent(props.title);
  });

  test('It is possible to pass Props to Progress component (Mantine)', () => {
    const props: StorageGraphViewProps = {
      title: 'string',
      data: {
        used: 1 * 1024 ** 3, // 25%, 1.00GiB
        allocated: 2 * 1024 ** 3, // 50%, 2.00GiB
        overall: 4 * 1024 ** 3, // 4.00GiB
      },
      loading: false,
    };
    render(<StorageGraphView {...props} />);
    /** Used value (graph length, percentage value) */
    //@ts-ignore
    expect(Progress.Section.mock.calls[0][0].value).toBe(25);
    /** Active tooltip */
    //@ts-ignore
    expect(Tooltip.mock.calls[0][0].label).toBe('Used 1.00 GiB');
    /** Used value (graph length, percentage value) */
    //@ts-ignore
    expect(Progress.Section.mock.calls[1][0].value).toBe(25); // Pass the stacked amount
    //@ts-ignore
    expect(Progress.Section.mock.calls[1][0].value).not.toBe(50);
    /** Configuring the tooltip */
    //@ts-ignore
    expect(Tooltip.mock.calls[1][0].label).toBe('Allocated 2.00 GiB');
  });

  test('The legend (In Use, Configuring, Total) is displayed', () => {
    const props: StorageGraphViewProps = {
      title: 'string',
      data: {
        used: 1 * 1024 ** 3, // 25%, 1.00GiB
        allocated: 2 * 1024 ** 3, // 50%, 2.00GiB
        overall: 4 * 1024 ** 3, // 4.00GiB
      },
      loading: false,
    };
    render(<StorageGraphView {...props} />);
    const usedLegend = screen.getByText(/^Used/);
    expect(usedLegend).toHaveTextContent('25%');
    expect(usedLegend).toHaveTextContent('1.00 GiB');
    const allocatedLegend = screen.getByText(/^Allocated/);
    expect(allocatedLegend).toHaveTextContent('50%');
    expect(allocatedLegend).toHaveTextContent('2.00 GiB');
    const overallLegend = screen.getByText(/^Total Capacity/);
    expect(overallLegend).toHaveTextContent('4.00 GiB');
  });

  test('It is displayed correctly when the entire value is undefined', () => {
    const props: StorageGraphViewProps = {
      title: 'string',
      data: {
        used: 1 * 1024 ** 3, // 25%, 1.00GiB
        allocated: 2 * 1024 ** 3, // 50%, 2.00GiB
        overall: undefined,
      },
      loading: false,
    };
    render(<StorageGraphView {...props} />);
    const usedLegend = screen.getByText(/^Used/);
    expect(usedLegend).toHaveTextContent('Used - (B)');
    const allocatedLegend = screen.getByText(/^Allocated/);
    expect(allocatedLegend).toHaveTextContent('Allocated - (B)');
    const overallLegend = screen.getByText(/^Total Capacity/);
    expect(overallLegend).toHaveTextContent('Total Capacity - B');
  });

  test('It is displayed correctly when the value in use is undefined', () => {
    const props: StorageGraphViewProps = {
      title: 'string',
      data: {
        used: undefined,
        allocated: 2 * 1024 ** 3, // 50%, 2.00GiB
        overall: 4 * 1024 ** 3, // 4.00GiB
      },
      loading: false,
    };
    render(<StorageGraphView {...props} />);
    const usedLegend = screen.getByText(/^Used/);
    expect(usedLegend).toHaveTextContent('Used - (B)');
    const allocatedLegend = screen.getByText(/^Allocated/);
    expect(allocatedLegend).toHaveTextContent('Allocated 50% (2.00 GiB)');
    const overallLegend = screen.getByText(/^Total Capacity/);
    expect(overallLegend).toHaveTextContent('Total Capacity 4.00 GiB');
  });
});
