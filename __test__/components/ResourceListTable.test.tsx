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

import { Checkbox } from '@mantine/core';
import { act } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { APIresources } from '@/shared-modules/types';

import { ResourceListTable } from '@/components';
import { CustomDataTable } from '@/shared-modules/components';

const resData: APIresources = {
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
          health: 'Warning',
          state: 'Enabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: ['node101', 'node102'],
    },
    {
      annotation: {
        available: false,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res102',
        deviceSwitchInfo: 'CXL12',
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
          state: 'Disabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: ['node101'],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res103',
        deviceSwitchInfo: 'CXL11',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        links: [],
        type: 'Accelerator',
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
  ],
};
const selectedAccessors = ['id', 'type', 'health', 'state', 'cxlSwitchId', 'nodeIDs', 'resourceAvailable'];

jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  Checkbox: {
    __esModule: true,
    ...jest.requireActual('@mantine/core').Checkbox,
    Group: jest.fn(() => null),
  },
}));

const mockCheckboxGroup = jest.fn().mockReturnValue(null);

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn().mockReturnValue({}),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  CustomDataTable: jest.fn(),
}));

describe('ResourceListTable', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    Checkbox.Group.mockReset();
    // @ts-ignore
    Checkbox.Group.mockImplementation(mockCheckboxGroup);
    (CustomDataTable as jest.Mock).mockReset();

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test.each([[...selectedAccessors], ['id', 'type', 'health', 'state', 'resourceAvailable']])(
    'The table is displayed with the specified columns',
    (...accessors) => {
      render(<ResourceListTable selectedAccessors={accessors} data={resData.resources} loading={false} />);

      const calledColumns = (CustomDataTable as jest.Mock).mock.lastCall[0].columns;

      accessors.forEach((accessor) => {
        const column = calledColumns.find((column) => column.accessor === accessor);
        expect(column.hidden).toBeFalsy();
      });

      const hiddenAccessors = selectedAccessors.filter((accessor) => !accessors.includes(accessor));
      hiddenAccessors.forEach((accessor) => {
        const column = calledColumns.find((column) => column.accessor === accessor);
        expect(column.hidden).toBe(true);
      });
    }
  );

  test('Clicking the checkbox for selecting display columns toggles the visibility of the columns', () => {
    render(<ResourceListTable selectedAccessors={selectedAccessors} data={resData.resources} loading={false} />);
    const accessors = ['id', 'health', 'state', 'cxlSwitchId', 'nodeIDs'];
    act(() => mockCheckboxGroup.mock.lastCall[0].onChange(accessors));

    // The selectedAccessors passed as the second argument to useResourceListTable matches the columns
    const calledColumns = (CustomDataTable as jest.Mock).mock.lastCall[0].columns;
    accessors.forEach((accessor) => {
      const column = calledColumns.find((column) => column.accessor === accessor);
      expect(column.hidden).toBeFalsy();
    });

    const hiddenAccessors = selectedAccessors.filter((accessor) => !accessors.includes(accessor));
    hiddenAccessors.forEach((accessor) => {
      const column = calledColumns.find((column) => column.accessor === accessor);
      expect(column.hidden).toBe(true);
    });
  });

  test('if data is undefined, an empty array is passed to CustomDataTable', () => {
    render(<ResourceListTable selectedAccessors={selectedAccessors} data={undefined} loading={false} />);
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(0);
  });

  test('Even if there is no information about CXL switches, it is displayed in the table', () => {
    const resDataNoCXLswitch = {
      count: 3,
      resources: resData.resources.map((resource) => ({
        ...resource,
        device: {
          ...resource.device,
          deviceSwitchInfo: undefined,
        },
      })),
    };
    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={resDataNoCXLswitch.resources} loading={false} />
    );
    // Confirm that all records are displayed
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(3);
  });

  test('Even if there is no information about NodeID, it is displayed in the table', () => {
    const resDataNoCXLswitch = {
      count: 3,
      resources: resData.resources.map((resource) => ({
        ...resource,
        nodeIDs: undefined,
      })),
    };
    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={resDataNoCXLswitch.resources} loading={false} />
    );
    // Confirm that all records are displayed
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(3);
  });

  test('When loading is specified as true, the loading icon is displayed', () => {
    render(<ResourceListTable selectedAccessors={selectedAccessors} data={resData.resources} loading={true} />);
    const loading = (CustomDataTable as jest.Mock).mock.lastCall[0].loading;
    expect(loading).toBe(true);
  });

  test('When loading is specified as false, the loading icon is not displayed', () => {
    render(<ResourceListTable selectedAccessors={selectedAccessors} data={resData.resources} loading={false} />);
    const loading = (CustomDataTable as jest.Mock).mock.lastCall[0].loading;
    expect(loading).toBe(false);
  });

  test('When pagination is specified to be visible, pagination is displayed', () => {
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={resData.resources}
        loading={false}
        showPagination={true}
      />
    );
    const noPagination = (CustomDataTable as jest.Mock).mock.lastCall[0].noPagination;
    expect(noPagination).toBe(false);
  });

  test('When pagination is specified to be hidden, pagination is not displayed', () => {
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={resData.resources}
        loading={false}
        showPagination={false}
      />
    );
    const noPagination = (CustomDataTable as jest.Mock).mock.lastCall[0].noPagination;
    expect(noPagination).toBe(true);
  });
});
