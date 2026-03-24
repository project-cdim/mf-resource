/*
 * Copyright 2025-2026 NEC Corporation.
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

import { APIDeviceType, APIPromQLSingle, APIresources } from '@/shared-modules/types';

import { dummyAPIresources } from '@/utils/dummy-data/resource-list/dummyAPIresources';
import { parseHistogramData } from '@/utils/parse';

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

  const createMockResourceData = (overrides?: Partial<APIresources>): APIresources => ({
    count: 1,
    resources: [
      {
        annotation: { available: true },
        device: {
          deviceID: 'test-resource',
          status: { health: 'OK', state: 'Enabled' },
          type: 'memory',
          powerState: 'On',
          powerCapability: true,
          capacityMiB: 32 * 1024, // 32GiB
        },
        resourceGroupIDs: [],
        detected: true,
        nodeIDs: [],
        physicalLocation: {
          rack: {
            id: 'rack1',
            name: 'Rack 1',
            chassis: { id: 'ch1', name: 'Chassis 1' },
          },
        },
        deviceUnit: {
          id: 'unit1',
          annotation: { systemItems: { available: true } },
        },
      },
    ],
    ...overrides,
  });

  test('When graphData is undefined, it returns undefined', () => {
    expect(parseHistogramData(undefined, ['CPU', 'DSP'], dummyAPIresources)).toBeUndefined();
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

    expect(parseHistogramData(dummyGraphData, types, dummyAPIresources)).toEqual(expectedHistogram);
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

    expect(parseHistogramData(dummyGraphData, types, dummyAPIresources)).toEqual(expectedHistogram);
  });

  test('When there is no data for the specified type, it returns undefined', () => {
    expect(parseHistogramData(dummyGraphData, ['FPGA', 'GPU'], dummyAPIresources)).toBeUndefined();
  });

  test('When memory resource has capacityMiB = 0, it returns undefined', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'memory_usedMemory',
              job: 'test-resource',
              data_label: 'usage',
            },
            value: [1701755114.437, '1048576'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const resourceData = createMockResourceData();
    resourceData.resources[0].device.capacityMiB = 0;

    expect(parseHistogramData(graphData, ['memory'], resourceData)).toBeUndefined();
  });

  test('When memory resource has capacityMiB = null, it returns undefined', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'memory_usedMemory',
              job: 'test-resource',
              data_label: 'usage',
            },
            value: [1701755114.437, '1048576'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const resourceData = createMockResourceData();
    resourceData.resources[0].device.capacityMiB = null as unknown as number;

    expect(parseHistogramData(graphData, ['memory'], resourceData)).toBeUndefined();
  });

  test('When memory resource is not found, it returns undefined', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'memory_usedMemory',
              job: 'nonexistent-resource',
              data_label: 'usage',
            },
            value: [1701755114.437, '1048576'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    expect(parseHistogramData(graphData, ['memory'], dummyAPIresources)).toBeUndefined();
  });

  test('When metric has no job field, it returns undefined', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              data_label: 'usage',
            },
            value: [1701005596.103, '50'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    expect(parseHistogramData(graphData, ['CPU'], dummyAPIresources)).toBeUndefined();
  });

  test('It correctly categorizes usage into 1-19% range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '10'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![1].CPU).toBe(1); // 1-19% range
  });

  test('It correctly categorizes usage into 20-39% range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '25'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![2].CPU).toBe(1); // 20-39% range
  });

  test('It correctly categorizes usage into 60-79% range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '65'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![4].CPU).toBe(1); // 60-79% range
  });

  test('It correctly categorizes usage into 80-99% range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '85'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![5].CPU).toBe(1); // 80-99% range
  });

  test('It correctly categorizes usage into 100% range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '100'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![6].CPU).toBe(1); // 100% range
  });

  test('It correctly handles usage over 100%', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res10102',
              data_label: 'usage',
            },
            value: [1701005596.103, '150'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![6].CPU).toBe(1); // Should be capped at 100% range
  });

  test('When resourceData is undefined, memory calculation returns undefined', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'memory_usedMemory',
              job: 'test-resource',
              data_label: 'usage',
            },
            value: [1701755114.437, '1048576'],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };

    expect(parseHistogramData(graphData, ['memory'], undefined)).toBeUndefined();
  });

  test('It correctly accumulates multiple resources of the same type in the same range', () => {
    const graphData: APIPromQLSingle = {
      status: 'success',
      data: {
        resultType: 'vector',
        result: [
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res1',
              data_label: 'usage',
            },
            value: [1701005596.103, '50'],
          },
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res2',
              data_label: 'usage',
            },
            value: [1701005596.103, '55'],
          },
          {
            metric: {
              __name__: 'CPU_usageRate',
              job: 'res3',
              data_label: 'usage',
            },
            value: [1701005596.103, '58'],
          },
        ],
      },
      stats: { seriesFetched: '3' },
    };

    const result = parseHistogramData(graphData, ['CPU'], dummyAPIresources);
    expect(result).toBeDefined();
    expect(result![3].CPU).toBe(3); // All three should be in 40-59% range
  });
});
