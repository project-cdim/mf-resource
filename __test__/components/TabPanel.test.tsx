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

import { render } from '@/shared-modules/__test__/test-utils';
import { APIPromQL, APIresources } from '@/shared-modules/types';

import { GraphGroup, TabPanel, TabPanelTab } from '@/components';

const mockGraphGroup = jest.fn().mockReturnValue(<h2>GraphGroup</h2>);
jest.mock('@/components/GraphGroup');
jest.mock('@luigi-project/client', () => ({
  addInitListener: jest.fn(),
}));

describe('TabPanel', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    GraphGroup.mockReset();
    // @ts-ignore
    GraphGroup.mockImplementation(mockGraphGroup);
    mockGraphGroup.mockReset();
  });
  const types: TabPanelTab[] = [
    'summary',
    'CPU',
    'memory',
    'networkInterface',
    'storage',
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
        <TabPanel tabs={types} data={data} rangeGraphData={undefined} singleGraphData={undefined} />
      </Tabs>
    );

    types.forEach(() => {
      expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(types.length);
    });
  });
  test('When there is no data, GraphGroup and NumberGroup are displayed in the tab', () => {
    render(
      <Tabs>
        <TabPanel tabs={types} data={undefined} rangeGraphData={undefined} singleGraphData={undefined} />
      </Tabs>
    );

    types.forEach(() => {
      expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(types.length);
    });
  });

  test('When it is networkInterface, the binary prefix is not correctly applied for values less than 1024.', () => {
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
              data_label: 'networkInterface_usage',
            },
            values: [
              [1701820800, '100'], // Less than 1024
              [1701824400, '200'],
              [1701828000, '300'],
              [1701831600, '400'],
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
        <TabPanel
          tabs={['networkInterface']}
          data={undefined}
          rangeGraphData={dummyGraphData}
          singleGraphData={undefined}
          startDate={'2023-12-06T00:00:00Z'}
          endDate={'2023-12-06T03:00:00Z'}
        />
      </Tabs>
    );

    /**
     * mockGraphGroup.mock.calls[0][0] Network Interface
     * items[1] Network transfer speed
     */
    expect(mockGraphGroup.mock.calls[0][0].items[1].props.valueFormatter(0)).toBe('0 bit/s');
  });

  test('When it is networkInterface, the binary prefix is correctly applied for values greater than 1024.', () => {
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
              data_label: 'networkInterface_usage',
            },
            values: [
              [1701820800, '10000'], // Greater than 1024
              [1701824400, '20000'],
              [1701828000, '30000'],
              [1701831600, '40000'],
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
        <TabPanel
          tabs={['networkInterface']}
          data={undefined}
          rangeGraphData={dummyGraphData}
          singleGraphData={undefined}
          startDate={'2023-12-06T00:00:00Z'}
          endDate={'2023-12-06T03:00:00Z'}
        />
      </Tabs>
    );

    /**
     * mockGraphGroup.mock.calls[0][0] Network interface
     * items[1] Network transfer speed
     */
    expect(mockGraphGroup.mock.calls[0][0].items[1].props.valueFormatter(0)).toBe('0 bit/s');
  });
});
