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

import { APIDeviceType, APIPromQLSingle } from '@/shared-modules/types';

import { dummyResourcesDetail } from '@/utils/dummy-data/index/resources';
import { parseHistogramData } from '@/utils/parse/parseHistogramData';

describe('parseHistogramData', () => {
  const dummyGraphData: APIPromQLSingle = {
    status: 'success',
    data: {
      resultType: 'vector',
      result: [
        {
          metric: {
            __name__: 'CPU_usageRate',
            data_label: 'usage',
            instance: 'gi-hw-performance-exporter:8080',
            job: 'res10102',
          },
          value: [1701005596.103, '56'],
        },
        {
          metric: {
            __name__: 'DSP_usageRate',
            data_label: 'usage',
            instance: 'gi-hw-performance-exporter:8080',
            job: 'xxxDSP',
          },
          value: [1701005596.103, '0'],
        },
        {
          metric: {
            __name__: 'memory_usedMemory',
            data_label: 'usage',
            instance: 'gi-hw-performance-exporter:8080',
            job: 'resTEST102',
          },
          value: [1701755114.437, '16777216'], // 16GiB
        },
        {
          metric: {
            __name__: 'memory_usedMemory',
            data_label: 'usage',
            instance: 'gi-hw-performance-exporter:8080',
            job: 'unexist',
          },
          value: [1701755114.437, '16777216'], // 16GiB
        },
      ],
    },
    stats: {
      seriesFetched: '2',
    },
  };
  test('When graphData is undefined, it returns undefined', () => {
    expect(parseHistogramData(undefined, ['CPU', 'DSP'], dummyResourcesDetail)).toBeUndefined();
  });

  test('It returns the correct histogram data for normal data', () => {
    const types: APIDeviceType[] = ['CPU', 'DSP'];
    const expectedHistogram = [
      { name: '0%', CPU: 0, DSP: 1 },
      { name: '1 - 19%', CPU: 0, DSP: 0 },
      { name: '20 - 39%', CPU: 0, DSP: 0 },
      { name: '40 - 59%', CPU: 1, DSP: 0 },
      { name: '60 - 79%', CPU: 0, DSP: 0 },
      { name: '80 - 99%', CPU: 0, DSP: 0 },
      { name: '100%', CPU: 0, DSP: 0 },
    ];

    expect(parseHistogramData(dummyGraphData, types, dummyResourcesDetail)).toEqual(expectedHistogram);
  });

  test('It returns the correct histogram data for normal data (type:memory)', () => {
    const types: APIDeviceType[] = ['memory'];
    const expectedHistogram = [
      { name: '0%', Memory: 0 },
      { name: '1 - 19%', Memory: 0 },
      { name: '20 - 39%', Memory: 0 },
      { name: '40 - 59%', Memory: 1 },
      { name: '60 - 79%', Memory: 0 },
      { name: '80 - 99%', Memory: 0 },
      { name: '100%', Memory: 0 },
    ];

    expect(parseHistogramData(dummyGraphData, types, dummyResourcesDetail)).toEqual(expectedHistogram);
  });

  test('When there is no data for the specified type, it returns undefined', () => {
    expect(parseHistogramData(dummyGraphData, ['FPGA', 'GPU'], dummyResourcesDetail)).toBeUndefined();
  });
});
