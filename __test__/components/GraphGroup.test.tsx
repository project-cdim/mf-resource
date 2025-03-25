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

import { GridColProps } from '@mantine/core';
import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { GraphView, GraphViewProps } from '@/shared-modules/components';
import { chartData } from '@/shared-modules/utils/dummy-data/GraphView';

import {
  GraphGroup,
  GraphGroupProps,
  HistogramView,
  HistogramViewProps,
  StorageGraphView,
  StorageGraphViewProps,
} from '@/components';

import { dummyData as singleData } from '@/utils/dummy-data/HistogramView/histogramView';

const mockGraphView = jest.fn().mockReturnValue(null);
jest.mock('@/shared-modules/components/GraphView');
const mockHistogramView = jest.fn().mockReturnValue(null);
jest.mock('@/components/HistogramView');
const mockStorageGraphView = jest.fn().mockReturnValue(null);
jest.mock('@/components/StorageGraphView');
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  Grid: {
    __esModule: true,
    ...jest.requireActual('@mantine/core').Grid,
    Col: (props: GridColProps) => (
      <div data-testid='gridcol' title={props.span?.toString()}>
        {props.children}
      </div>
    ),
  },
}));

const graphViewProps: GraphViewProps = {
  title: 'Graph 1',
  data: chartData,
  valueFormatter: () => `formatter`,
  link: '',
  query: {
    cxlSwitchId: ['cxlSwitchId1', 'cxlSwitchId2'],
    type: ['CPU'],
    allocatednode: ['allocatednode1', 'allocatednode2'],
    state: ['Enabled'],
    health: ['OK'],
    resourceAvailable: ['Available', 'Unavailable'],
  },
};

const histogramViewProps: HistogramViewProps = {
  title: 'Histogram Title 1',
  data: singleData,
  valueFormatter: () => `formatter`,
};

const storageGraphViewProps: StorageGraphViewProps = {
  title: 'Storage Usage',
  data: {
    used: 10 * 1024 ** 4,
    allocated: 50 * 1024 ** 4,
    overall: 100 * 1024 ** 4,
  },
};

describe('GraphGroup', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    GraphView.mockReset();
    // @ts-ignore
    GraphView.mockImplementation(mockGraphView);
    mockGraphView.mockReset();
    // @ts-ignore
    HistogramView.mockReset();
    // @ts-ignore
    HistogramView.mockImplementation(mockHistogramView);
    mockHistogramView.mockReset();
    // @ts-ignore
    StorageGraphView.mockReset();
    // @ts-ignore
    StorageGraphView.mockImplementation(mockStorageGraphView);
    mockStorageGraphView.mockReset();
  });
  test('that the title is displayed', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [
        { type: 'graphView', props: graphViewProps },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
      ],
    };
    render(<GraphGroup {...props} />);
    const title = screen.getByText(props.title);
    expect(title).toHaveTextContent(props.title);
  });

  test('that the specified graph components are called', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [
        { type: 'graphView', props: graphViewProps },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
      ],
    };
    render(<GraphGroup {...props} />);
    expect(mockGraphView).toHaveBeenCalled();
    expect(mockHistogramView).toHaveBeenCalled();
    expect(mockStorageGraphView).toHaveBeenCalled();
  });

  test('that the specified number of graph components are called', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [
        { type: 'graphView', props: graphViewProps },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
        { type: 'graphView', props: graphViewProps },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
      ],
    };
    render(<GraphGroup {...props} />);
    expect(mockGraphView).toHaveBeenCalledTimes(2);
    expect(mockHistogramView).toHaveBeenCalledTimes(2);
    expect(mockStorageGraphView).toHaveBeenCalledTimes(2);
  });
  test('that the title is displayed when the item is empty', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [],
    };
    render(<GraphGroup {...props} />);
    const title = screen.getByText(props.title);
    expect(title).toHaveTextContent(props.title);
    expect(mockGraphView).not.toHaveBeenCalled();
    expect(mockHistogramView).not.toHaveBeenCalled();
    expect(mockStorageGraphView).not.toHaveBeenCalled();
  });

  test('that the span is set to 12 when energyGraphWide is true and the unit is "Wh"', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [
        { type: 'graphView', props: { ...graphViewProps, unit: 'Wh' }, isFullWidth: true },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
      ],
    };
    render(<GraphGroup {...props} />);
    expect(screen.getAllByTestId('gridcol')[0].getAttribute('title')).toBe('12');
    expect(screen.getAllByTestId('gridcol')[1].getAttribute('title')).toBe('6');
    expect(screen.getAllByTestId('gridcol')[2].getAttribute('title')).toBe('6');
  });

  test('The text of a header can passed by argument when noHeader is true', () => {
    const props: GraphGroupProps = {
      title: 'Group Title',
      items: [
        { type: 'graphView', props: graphViewProps },
        { type: 'histogram', props: histogramViewProps },
        { type: 'storage', props: storageGraphViewProps },
      ],
      noHeader: true,
    };
    render(<GraphGroup {...props} />);
    const title = screen.queryByRole('heading', { level: 2, name: props.title });
    expect(title).toBeInTheDocument();
  });
});
