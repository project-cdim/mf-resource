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

import { APIPromQLSingle, APIresources } from '@/shared-modules/types';

import { dummyAPIresources } from '@/utils/dummy-data/resource-list/dummyAPIresources';
import { parseStorageGraphData } from '@/utils/parse';

describe('parseStorageGraphData', () => {
  const dummyGraphData: APIPromQLSingle = {
    status: 'success',
    data: {
      resultType: 'vector',
      result: [
        {
          metric: {
            data_label: 'storage_usage',
          },
          value: [1701005596.103, '10000000'],
        },
      ],
    },
    stats: {
      seriesFetched: '2',
    },
  };

  test('It returns the correct data for normal data', () => {
    const expectedStorageData = { allocated: 4398046511104, overall: 13194139533312, used: 10000000 };
    expect(parseStorageGraphData(dummyAPIresources, dummyGraphData)).toEqual(expectedStorageData);
  });
  test('When data is undefined, both allocated and overall return undefined', () => {
    const expectedStorageData = { allocated: undefined, overall: undefined, used: 10000000 };
    expect(parseStorageGraphData(undefined, dummyGraphData)).toEqual(expectedStorageData);
  });
  test('When graphData is undefined, used returns undefined', () => {
    const expectedStorageData = { allocated: 4398046511104, overall: 13194139533312, used: undefined };
    expect(parseStorageGraphData(dummyAPIresources, undefined)).toEqual(expectedStorageData);
  });
  test('When there is no volume information, both allocated and overall return 0', () => {
    const noVolumeResources: APIresources = {
      count: 100,
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'resTEST101',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
            devicePortList: [{ switchID: 'CXLxxx' }],
            links: [
              {
                type: 'CPU',
                deviceID: 'xxx',
              },
            ],
          },
          detected: true,
          nodeIDs: ['node01'],
          resourceGroupIDs: [],
          deviceUnit: {
            id: 'unit101',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
        },
      ],
    };
    const expectedStorageData = { allocated: 0, overall: 0, used: 10000000 };
    expect(parseStorageGraphData(noVolumeResources, dummyGraphData)).toEqual(expectedStorageData);
  });
});
