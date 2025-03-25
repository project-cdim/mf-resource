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

import { BarChart } from '@mantine/charts';
import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { CHART_COLORS } from '@/shared-modules/constant';
import { formatNumberOfResources } from '@/shared-modules/utils';

import { dummyData as singleData } from '@/utils/dummy-data/HistogramView/histogramView';
import { dummyData as stackData } from '@/utils/dummy-data/HistogramView/histogramView2';

import { HistogramView, HistogramViewProps } from '../../components';

jest.mock('@mantine/charts', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/charts'),
  BarChart: jest.fn(),
}));

describe('HistogramView', () => {
  beforeEach(() => {
    // @ts-ignore
    BarChart.mockReset();
  });

  test('The component title is displayed', () => {
    const props: HistogramViewProps = {
      title: 'Usage rate',
      data: singleData,
      valueFormatter: formatNumberOfResources,
    };
    render(<HistogramView {...props} />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent(props.title);
  });

  test('It is possible to pass Props to the BarChart component', () => {
    const props: HistogramViewProps = {
      title: 'string',
      data: singleData,
      valueFormatter: formatNumberOfResources,
      stack: false,
    };
    render(<HistogramView {...props} />);
    // @ts-ignore
    const givenProps = BarChart.mock.lastCall[0]; // The first argument of the last call

    /** Graph data */
    expect(givenProps.data).toEqual(props.data);
    /** Category */
    expect(givenProps.series).toEqual([{ name: 'CPU', color: CHART_COLORS[0] }]);
    /** ValueFormatter */
    expect(givenProps.valueFormatter).toEqual(props.valueFormatter);
    /** Stack */
    expect(givenProps.type).toBe('default');
  });

  test('It is possible to pass Props to the BarChart component(Stacked)', () => {
    const props: HistogramViewProps = {
      title: 'string',
      data: stackData,
      valueFormatter: formatNumberOfResources,
      stack: true,
    };
    render(<HistogramView {...props} />);
    // @ts-ignore
    const givenProps = BarChart.mock.lastCall[0]; // The first argument of the last call

    /** Graph data */
    expect(givenProps.data).toEqual(props.data);
    /** Category */
    expect(givenProps.series).toEqual([
      { name: 'CPU', color: CHART_COLORS[0] },
      { name: 'GPU', color: CHART_COLORS[1] },
      { name: 'Accelerator', color: CHART_COLORS[2] },
      { name: 'DSP', color: CHART_COLORS[3] },
      { name: 'FPGA', color: CHART_COLORS[4] },
      { name: 'UnknownProcessor', color: CHART_COLORS[5] },
    ]);
    /** ValueFormatter */
    expect(givenProps.valueFormatter).toEqual(props.valueFormatter);
    /** Stack */
    expect(givenProps.type).toBe('stacked');
  });

  test('The dataFormatter passed to the valueFormatter of the BarChart component  works correctly', () => {
    const props: HistogramViewProps = {
      title: 'string',
      data: singleData,
      valueFormatter: formatNumberOfResources,
    };
    render(<HistogramView {...props} />);
    // @ts-ignore
    const givenProps = BarChart.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.valueFormatter(1000)).toBe('1,000 resources');
    const yAxisFormatter = givenProps.yAxisProps?.tickFormatter;
    expect(yAxisFormatter(1000)).toBe('1,000');
  });

  test.each([[], [{ name: 'test' }], undefined])(
    'When there is no data, an empty array is passed to BarChart',
    (data) => {
      const props: HistogramViewProps = {
        title: 'Usage rate',
        data: data,
        valueFormatter: formatNumberOfResources,
      };
      render(<HistogramView {...props} />);
      expect(BarChart).not.toHaveBeenCalled();

      const noDataText = screen.getByText('No data');
      expect(noDataText).toBeInTheDocument();
    }
  );
});
