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

import { Tabs } from '@mantine/core';
import { screen } from '@testing-library/react';
import _ from 'lodash';

import { render } from '@/shared-modules/__test__/test-utils';
import { APIPromQL, APIresources } from '@/shared-modules/types';

import { GraphGroup, TabPanelAll, TabPanelAllTab } from '@/components';

const mockGraphGroup = jest.fn().mockReturnValue(<h2>GraphGroup</h2>);
jest.mock('@/components/GraphGroup');
jest.mock('@/components/NumberGroup', () => ({ NumberGroup: () => null }));

describe('TabPanelAll', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    GraphGroup.mockReset();
    // @ts-ignore
    GraphGroup.mockImplementation(mockGraphGroup);
    mockGraphGroup.mockReset();
  });

  const tabs: TabPanelAllTab[] = ['all', 'CPU', 'memory', 'networkInterface', 'storage', 'graphicController'];
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
        nodeIDs: [],
        resourceGroupIDs: [],
      },
    ],
  };

  test('GraphGroup and NumberGroup are displayed in the tab', () => {
    render(
      <Tabs>
        <TabPanelAll
          tabs={tabs}
          data={data}
          rangeGraphData={undefined}
          singleGraphData={undefined}
          startDate={undefined}
          endDate={undefined}
        />
      </Tabs>
    );
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(1);
  });
  test('When there is no data, GraphGroup and NumberGroup are displayed in the tab', () => {
    render(
      <Tabs>
        <TabPanelAll
          tabs={tabs}
          data={undefined}
          rangeGraphData={undefined}
          singleGraphData={undefined}
          startDate={undefined}
          endDate={undefined}
        />
      </Tabs>
    );

    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(1);
  });
  test('The data of type APIPromQL passed to rangeGraphData is processed correctly', () => {
    // Dummy data
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
              [1701820800, '100'], // 2023-12-06T00:00:00Z
              [1701824400, '200'],
              [1701828000, '300'],
              [1701831600, '400'], // 2023-12-06T03:00:00Z
            ],
          },
        ],
      },
      stats: {
        seriesFetched: '',
      },
    };
    render(
      <Tabs>
        <TabPanelAll
          tabs={tabs}
          data={undefined}
          rangeGraphData={dummyGraphData}
          singleGraphData={undefined}
          startDate={'2023-12-06T00:00:00Z'}
          endDate={'2023-12-06T03:00:00Z'}
        />
      </Tabs>
    );

    const givenProps1 = mockGraphGroup.mock.calls[0][0]; // Energy Consumptions
    /** Graph group title */
    expect(givenProps1.title).toBe('Performance(Energy Consumptions)');
    /** Whether the data passed as props is being passed to GraphGroup */
    const type = _.upperFirst(dummyGraphData.data.result[0].metric.data_label.split('_')[0]);
    expect(givenProps1.items[1].props.data[0][type]).toBe(Number(dummyGraphData.data.result[0].values[0][1]));
    expect(givenProps1.items[1].props.data[1][type]).toBe(Number(dummyGraphData.data.result[0].values[1][1]));
    expect(givenProps1.items[1].props.data[2][type]).toBe(Number(dummyGraphData.data.result[0].values[2][1]));
    expect(givenProps1.items[1].props.data[3][type]).toBe(Number(dummyGraphData.data.result[0].values[3][1]));
  });

  test('When it is networkInterface, the binary prefix is not correctly applied for values less than 1024.', () => {
    // Dummy data
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
              [1701820800, '100'], // 2023-12-06T00:00:00Z Less then 1024
              [1701824400, '200'],
              [1701828000, '300'],
              [1701831600, '400'], // 2023-12-06T03:00:00Z
            ],
          },
        ],
      },
      stats: {
        seriesFetched: '',
      },
    };
    render(
      <Tabs>
        <TabPanelAll
          tabs={tabs}
          data={undefined}
          rangeGraphData={dummyGraphData}
          singleGraphData={undefined}
          startDate={'2023-12-06T00:00:00Z'}
          endDate={'2023-12-06T03:00:00Z'}
        />
      </Tabs>
    );
    /**
     * mockGraphGroup.mock.calls[1][0] Resource usage
     * items[2] Network transfer speed
     */
    expect(mockGraphGroup.mock.calls[1][0].items[2].props.valueFormatter(0)).toBe('0 bit/s');
  });
  test('When it is networkInterface, the binary prefix is correctly applied for values greater than 1024.', () => {
    // Dummy data
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
    render(
      <Tabs>
        <TabPanelAll
          tabs={tabs}
          data={undefined}
          rangeGraphData={dummyGraphData}
          singleGraphData={undefined}
          startDate={'2023-12-06T00:00:00Z'}
          endDate={'2023-12-06T03:00:00Z'}
        />
      </Tabs>
    );
    /**
     * mockGraphGroup.mock.calls[1][0] Resource usage
     * items[2] Network transfer speed
     */
    expect(mockGraphGroup.mock.calls[1][0].items[2].props.valueFormatter(0)).toBe('0 bit/s');
  });
});
