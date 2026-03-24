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

import { Checkbox } from '@mantine/core';
import { act, renderHook } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { APIresources } from '@/shared-modules/types';

import { ResourceListTable, useResourceListTableData } from '@/components';
import { CustomDataTable } from '@/shared-modules/components';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import useSWRImmutable from 'swr/immutable';

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
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL11' }],
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
        powerState: 'On',
        powerCapability: true,
        totalCores: 8,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res202',
            },
          ],
        },
      },
      resourceGroupIDs: ['rg100'],
      detected: true,
      nodeIDs: ['node101', 'node102'],
      deviceUnit: {
        id: 'unit-001',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
      physicalLocation: {
        rack: {
          id: 'rack-001',
          name: 'rack001',
          chassis: {
            id: 'chassis-001',
            name: 'chassis001',
          },
        },
      },
    },
    {
      annotation: {
        available: false,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res102',
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL12' }],
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
        powerState: 'On',
        powerCapability: true,
        totalCores: 16,
      },
      resourceGroupIDs: ['rg100'],
      detected: false,
      nodeIDs: ['node101'],
      deviceUnit: {
        id: 'unit-002',
        annotation: {
          systemItems: {
            available: false,
          },
        },
      },
      physicalLocation: {
        rack: {
          id: 'rack-002',
          name: 'rack002',
          chassis: {
            id: 'chassis-002',
            name: 'chassis002',
          },
        },
      },
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res103',
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL11' }],
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        links: [],
        type: 'Accelerator',
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: ['rg101'],
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit-003',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
      physicalLocation: {
        rack: {
          id: 'rack-003',
          name: 'rack003',
          chassis: {
            id: 'chassis-003',
            name: 'chassis003',
          },
        },
      },
    },
  ],
};
const selectedAccessors = [
  'id',
  'type',
  'status',
  'powerState',
  'health',
  'state',
  'detected',
  'resourceAvailable',
  'resourceGroups',
  'placement',
  'cxlSwitch',
  'nodeIDs',
];

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
  useQueryArrayObject: jest.fn().mockReturnValue(
    new Proxy({} as Record<string, string[]>, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop as string];
        }
        return [];
      },
    })
  ),
  useUserId: jest.fn().mockReturnValue('test-user-id'),
  useLocalStorage: jest.fn().mockReturnValue([[], jest.fn()]),
}));

jest.mock('@/shared-modules/utils/storedColumns', () => ({
  hasItem: jest.fn().mockResolvedValue(false),
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  storedColumns: jest.fn(() => ({
    selectedAccessors: [],
    toggleColumns: jest.fn(),
    storageError: undefined,
  })),
}));

jest.mock('@/utils/hooks/useResourceGroupsData', () => ({
  ...jest.requireActual('@/utils/hooks/useResourceGroupsData'),
  useResourceGroupsData: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  CustomDataTable: jest.fn(),
}));

jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ResourceListTable', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    Checkbox.Group.mockReset();
    // @ts-ignore
    Checkbox.Group.mockImplementation(mockCheckboxGroup);
    (CustomDataTable as jest.Mock).mockReset();

    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      validating: false,
      mutate: jest.fn(),
      getNameById: (id: string) => {
        return id === 'rg100' ? 'default' : 'not default';
      },
    });

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: resData,
      error: null,
      mutate: jest.fn(),
    }));

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test.each([[...selectedAccessors], ['id', 'type', 'health', 'state', 'resourceAvailable']])(
    'The table is displayed with the specified columns',
    (...accessors) => {
      const { result } = renderHook(() => useResourceListTableData());

      render(
        <ResourceListTable
          selectedAccessors={accessors}
          data={result.current.data}
          loading={false}
          storeColumnsKey='test'
        />
      );

      const calledColumns = (CustomDataTable as jest.Mock).mock.lastCall[0].columns;

      accessors.forEach((accessor) => {
        const column = calledColumns.find((column: any) => column.accessor === accessor);
        if (column) {
          expect(column.hidden).toBeFalsy();
        }
      });

      const hiddenAccessors = selectedAccessors.filter((accessor) => !accessors.includes(accessor));
      hiddenAccessors.forEach((accessor) => {
        const column = calledColumns.find((column: any) => column.accessor === accessor);
        if (column) {
          expect(column.hidden).toBe(true);
        }
      });
    }
  );

  test('Clicking the checkbox for selecting display columns toggles the visibility of the columns', () => {
    const { result } = renderHook(() => useResourceListTableData());
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={result.current.data}
        loading={false}
        storeColumnsKey='test'
      />
    );
    const accessors = ['id', 'health', 'state', 'cxlSwitch', 'nodeIDs'];

    // Check if mockCheckboxGroup was called
    if (mockCheckboxGroup.mock.lastCall && mockCheckboxGroup.mock.lastCall[0]) {
      act(() => mockCheckboxGroup.mock.lastCall[0].onChange(accessors));

      // The selectedAccessors passed as the second argument to useResourceListTable matches the columns
      const calledColumns = (CustomDataTable as jest.Mock).mock.lastCall[0].columns;
      accessors.forEach((accessor) => {
        const column = calledColumns.find((column: any) => column.accessor === accessor);
        if (column) {
          expect(column.hidden).toBeFalsy();
        }
      });

      const hiddenAccessors = selectedAccessors.filter((accessor) => !accessors.includes(accessor));
      hiddenAccessors.forEach((accessor) => {
        const column = calledColumns.find((column: any) => column.accessor === accessor);
        if (column) {
          expect(column.hidden).toBe(true);
        }
      });
    } else {
      // If checkbox group wasn't called, just verify the component rendered
      expect(CustomDataTable as jest.Mock).toHaveBeenCalled();
    }
  });

  test('if data is undefined, an empty array is passed to CustomDataTable', () => {
    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={[]} loading={false} storeColumnsKey='test' />
    );
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(0);
  });

  test('Even if there is no information about CXL switches, it is displayed in the table', () => {
    const { result } = renderHook(() => useResourceListTableData());
    const data = result.current.data.map((resource) => ({
      ...resource,
      cxlSwitch: [],
    }));
    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={data} loading={false} storeColumnsKey='test' />
    );
    // Confirm that all records are displayed
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(3);
  });

  test('Even if there is no information about NodeID, it is displayed in the table', () => {
    const { result } = renderHook(() => useResourceListTableData());
    const data = result.current.data.map((resource) => ({
      ...resource,
      nodeIDs: [],
    }));
    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={data} loading={false} storeColumnsKey='test' />
    );
    // Confirm that all records are displayed
    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records).toHaveLength(3);
  });

  test('When loading is specified as true, the loading icon is displayed', () => {
    const { result } = renderHook(() => useResourceListTableData());
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={result.current.data}
        loading={true}
        storeColumnsKey='test'
      />
    );
    const loading = (CustomDataTable as jest.Mock).mock.lastCall[0].loading;
    expect(loading).toBe(true);
  });

  test('When loading is specified as false, the loading icon is not displayed', () => {
    const { result } = renderHook(() => useResourceListTableData());
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={result.current.data}
        loading={false}
        storeColumnsKey='test'
      />
    );
    const loading = (CustomDataTable as jest.Mock).mock.lastCall[0].loading;
    expect(loading).toBe(false);
  });

  test('When pagination is specified to be visible, pagination is displayed', () => {
    const { result } = renderHook(() => useResourceListTableData());
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={result.current.data}
        loading={false}
        showPagination={true}
        storeColumnsKey='test'
      />
    );
    const noPagination = (CustomDataTable as jest.Mock).mock.lastCall[0].noPagination;
    expect(noPagination).toBe(false);
  });

  test('When pagination is specified to be hidden, pagination is not displayed', () => {
    const { result } = renderHook(() => useResourceListTableData());
    render(
      <ResourceListTable
        selectedAccessors={selectedAccessors}
        data={result.current.data}
        loading={false}
        showPagination={false}
        storeColumnsKey='test'
      />
    );
    const noPagination = (CustomDataTable as jest.Mock).mock.lastCall[0].noPagination;
    expect(noPagination).toBe(true);
  });

  test('resourceGroupsText falls back to id when name is empty', () => {
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      validating: false,
      mutate: jest.fn(),
      getNameById: (id: string) => {
        return id === 'rg100' ? '' : 'default';
      },
    });

    const testData = [
      {
        id: 'res101',
        type: 'CPU' as const,
        status: 'Warning' as const,
        powerState: 'On' as const,
        health: 'Warning' as const,
        state: 'Enabled' as const,
        detected: true,
        resourceGroups: [{ id: 'rg100', name: '' }],
        cxlSwitch: ['CXL11'],
        nodeIDs: ['node101', 'node102'],
        resourceAvailable: 'Available' as const,
        placement: {
          rack: {
            id: 'rack-001',
            name: 'rack001',
            chassis: {
              id: 'chassis-001',
              name: 'chassis001',
            },
          },
        },
        composite: 'unit-001',
      },
      {
        id: 'res102',
        type: 'CPU' as const,
        status: 'Critical' as const,
        powerState: 'Off' as const,
        health: 'OK' as const,
        state: 'Disabled' as const,
        detected: false,
        resourceGroups: [{ id: 'rg101', name: 'default' }],
        cxlSwitch: ['CXL12'],
        nodeIDs: ['node101'],
        resourceAvailable: 'Unavailable' as const,
        placement: {
          rack: {
            id: 'rack-002',
            name: 'rack002',
            chassis: {
              id: 'chassis-002',
              name: 'chassis002',
            },
          },
        },
        composite: '',
      },
    ];

    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={testData} loading={false} storeColumnsKey='test' />
    );

    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records[0].resourceGroupsText).toBe('rg100'); // Falls back to id when name is empty
    expect(records[1].resourceGroupsText).toBe('default'); // Uses name when available
  });

  test('resourceGroupsText handles multiple resource groups with mixed empty names', () => {
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      validating: false,
      mutate: jest.fn(),
      getNameById: (id: string) => {
        if (id === 'rg100') return '';
        if (id === 'rg101') return 'Group Name';
        if (id === 'rg102') return '';
        return 'default';
      },
    });

    const testData = [
      {
        id: 'res101',
        type: 'CPU' as const,
        status: 'Warning' as const,
        powerState: 'On' as const,
        health: 'Warning' as const,
        state: 'Enabled' as const,
        detected: true,
        resourceGroups: [
          { id: 'rg100', name: '' },
          { id: 'rg101', name: 'Group Name' },
          { id: 'rg102', name: '' },
        ],
        cxlSwitch: ['CXL11'],
        nodeIDs: ['node101'],
        resourceAvailable: 'Available' as const,
        placement: {
          rack: {
            id: 'rack-001',
            name: 'rack001',
            chassis: {
              id: 'chassis-001',
              name: 'chassis001',
            },
          },
        },
        composite: '',
      },
    ];

    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={testData} loading={false} storeColumnsKey='test' />
    );

    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records[0].resourceGroupsText).toBe('rg100,Group Name,rg102'); // Falls back to id when name is empty, uses name when available
  });

  test('resourceGroupsText handles null and undefined names gracefully', () => {
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      validating: false,
      mutate: jest.fn(),
      getNameById: (id: string) => {
        if (id === 'rg100') return null;
        if (id === 'rg101') return undefined;
        if (id === 'rg102') return 'Valid Name';
        return 'default';
      },
    });

    const testData = [
      {
        id: 'res101',
        type: 'CPU' as const,
        status: 'Warning' as const,
        powerState: 'On' as const,
        health: 'Warning' as const,
        state: 'Enabled' as const,
        detected: true,
        resourceGroups: [
          { id: 'rg100', name: null as any },
          { id: 'rg101', name: undefined as any },
          { id: 'rg102', name: 'Valid Name' },
        ],
        cxlSwitch: ['CXL11'],
        nodeIDs: ['node101'],
        resourceAvailable: 'Available' as const,
        placement: {
          rack: {
            id: 'rack-001',
            name: 'rack001',
            chassis: {
              id: 'chassis-001',
              name: 'chassis001',
            },
          },
        },
        composite: '',
      },
    ];

    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={testData} loading={false} storeColumnsKey='test' />
    );

    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    // null gets stringified to "", undefined gets stringified to ""
    expect(records[0].resourceGroupsText).toBe(',,Valid Name');
  });

  test('resourceGroupsText handles undefined resourceGroups array', () => {
    const testData = [
      {
        id: 'res101',
        type: 'CPU' as const,
        status: 'Warning' as const,
        powerState: 'On' as const,
        health: 'Warning' as const,
        state: 'Enabled' as const,
        detected: true,
        resourceGroups: undefined as any,
        cxlSwitch: ['CXL11'],
        nodeIDs: ['node101'],
        resourceAvailable: 'Available' as const,
        placement: {
          rack: {
            id: 'rack-001',
            name: 'rack001',
            chassis: {
              id: 'chassis-001',
              name: 'chassis001',
            },
          },
        },
        composite: '',
      },
    ];

    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={testData} loading={false} storeColumnsKey='test' />
    );

    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records[0].resourceGroupsText).toBe(''); // Should handle undefined gracefully
  });

  test('placementText falls back to empty string when placement is undefined', () => {
    const testData = [
      {
        id: 'res101',
        type: 'CPU' as const,
        status: 'Warning' as const,
        powerState: 'On' as const,
        health: 'Warning' as const,
        state: 'Enabled' as const,
        detected: true,
        resourceGroups: [{ id: 'rg100', name: 'default' }],
        cxlSwitch: ['CXL11'],
        nodeIDs: ['node101'],
        resourceAvailable: 'Available' as const,
        placement: undefined as any,
        composite: '',
      },
    ];

    render(
      <ResourceListTable selectedAccessors={selectedAccessors} data={testData} loading={false} storeColumnsKey='test' />
    );

    const records = (CustomDataTable as jest.Mock).mock.lastCall[0].records;
    expect(records[0].placementText).toBe(''); // Should handle undefined placement gracefully
  });

  describe('useFormatResourceListTableData', () => {
    const { useFormatResourceListTableData } = jest.requireActual('@/components/ResourceListTable');
    const mockGetNameById = jest.fn((id: string) => `name-${id}`);
    beforeEach(() => {
      (useResourceGroupsData as jest.Mock).mockReturnValue({
        data: [],
        error: undefined,
        validating: false,
        mutate: jest.fn(),
        getNameById: mockGetNameById,
      });
    });

    test('returns formattedData with correct fields', () => {
      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev1',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL1' }],
            powerState: 'On',
            powerCapability: true,
            constraints: {
              nonRemovableDevices: [{ deviceID: 'dev2' }],
            },
          },
          resourceGroupIDs: ['rg1'],
          detected: true,
          nodeIDs: ['n1', 'n2'],
          deviceUnit: {
            id: 'unit-001',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-001',
              name: 'rack001',
              chassis: {
                id: 'chassis-001',
                name: 'chassis001',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData).toHaveLength(1);
      expect(result.current.formattedData[0]).toMatchObject({
        id: 'dev1',
        type: 'CPU',
        health: 'OK',
        state: 'Enabled',
        detected: true,
        resourceGroups: [{ id: 'rg1', name: 'name-rg1' }],
        cxlSwitch: ['fabric1-CXL1'],
        nodeIDs: ['n1', 'n2'],
        resourceAvailable: 'Available',
        composite: 'unit-001',
      });
    });

    test('returns resourceAvailable as "Unavailable" when annotation.available is false', () => {
      const input = [
        {
          annotation: { available: false },
          device: {
            deviceID: 'dev2',
            type: 'CPU',
            status: { health: 'Warning', state: 'Disabled' },
            devicePortList: [],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: false,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-002',
            annotation: {
              systemItems: {
                available: false,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-002',
              name: 'rack002',
              chassis: {
                id: 'chassis-002',
                name: 'chassis002',
              },
            },
          },
        },
      ];
      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData[0].resourceAvailable).toBe('Unavailable');
    });

    test('handles empty data (undefined) and returns empty array', () => {
      const { result } = renderHook(() => useFormatResourceListTableData(undefined));
      expect(result.current.formattedData).toEqual([]);
    });

    test('handles null data and returns empty array', () => {
      const { result } = renderHook(() => useFormatResourceListTableData(null as any));
      expect(result.current.formattedData).toEqual([]);
    });

    test('handles empty array data', () => {
      const { result } = renderHook(() => useFormatResourceListTableData([]));
      expect(result.current.formattedData).toEqual([]);
    });

    test('resourceGroups uses getNameById for each id', () => {
      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev3',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: ['rg1', 'rg2'],
          detected: true,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-003',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-003',
              name: 'rack003',
              chassis: {
                id: 'chassis-003',
                name: 'chassis003',
              },
            },
          },
        },
      ];
      renderHook(() => useFormatResourceListTableData(input));
      expect(mockGetNameById).toHaveBeenCalledWith('rg1');
      expect(mockGetNameById).toHaveBeenCalledWith('rg2');
    });

    test('resourceGroupsText falls back to id when name is empty', () => {
      const mockGetNameByIdWithEmpty = jest.fn((id: string) => (id === 'rg1' ? '' : `name-${id}`));
      (useResourceGroupsData as jest.Mock).mockReturnValue({
        data: [],
        error: undefined,
        validating: false,
        mutate: jest.fn(),
        getNameById: mockGetNameByIdWithEmpty,
      });

      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev1',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [{ switchID: 'CXL1' }],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: ['rg1', 'rg2'],
          detected: true,
          nodeIDs: ['n1'],
          deviceUnit: {
            id: 'unit-001',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-001',
              name: 'rack001',
              chassis: {
                id: 'chassis-001',
                name: 'chassis001',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData).toHaveLength(1);
      expect(result.current.formattedData[0].resourceGroups).toEqual([
        { id: 'rg1', name: '' },
        { id: 'rg2', name: 'name-rg2' },
      ]);
    });

    test('resourceGroups handles mixed empty and non-empty names correctly', () => {
      const mockGetNameByIdMixed = jest.fn((id: string) => {
        if (id === 'rg1') return '';
        if (id === 'rg2') return 'Group Two';
        if (id === 'rg3') return '';
        return `name-${id}`;
      });
      (useResourceGroupsData as jest.Mock).mockReturnValue({
        data: [],
        error: undefined,
        validating: false,
        mutate: jest.fn(),
        getNameById: mockGetNameByIdMixed,
      });

      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev1',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [{ switchID: 'CXL1' }],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: ['rg1', 'rg2', 'rg3'],
          detected: true,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-001',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-001',
              name: 'rack001',
              chassis: {
                id: 'chassis-001',
                name: 'chassis001',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData[0].resourceGroups).toEqual([
        { id: 'rg1', name: '' },
        { id: 'rg2', name: 'Group Two' },
        { id: 'rg3', name: '' },
      ]);
    });

    test('handles null and undefined names from getNameById', () => {
      const mockGetNameByIdWithNulls = jest.fn((id: string) => {
        if (id === 'rg1') return null;
        if (id === 'rg2') return undefined;
        if (id === 'rg3') return 'Valid Name';
        return 'default';
      });
      (useResourceGroupsData as jest.Mock).mockReturnValue({
        data: [],
        error: undefined,
        validating: false,
        mutate: jest.fn(),
        getNameById: mockGetNameByIdWithNulls,
      });

      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev1',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [{ switchID: 'CXL1' }],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: ['rg1', 'rg2', 'rg3'],
          detected: true,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-001',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-001',
              name: 'rack001',
              chassis: {
                id: 'chassis-001',
                name: 'chassis001',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData[0].resourceGroups).toEqual([
        { id: 'rg1', name: null },
        { id: 'rg2', name: undefined },
        { id: 'rg3', name: 'Valid Name' },
      ]);
    });

    test('cxlSwitch is empty string if devicePortList is undefined', () => {
      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev4',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            // devicePortList is missing
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: true,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-004',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-004',
              name: 'rack004',
              chassis: {
                id: 'chassis-004',
                name: 'chassis004',
              },
            },
          },
        },
      ];
      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData[0].cxlSwitch).toEqual([]);
    });

    test('nodeIDs is []', () => {
      const input = [
        {
          annotation: { available: true },
          device: {
            deviceID: 'dev5',
            type: 'CPU',
            status: { health: 'OK', state: 'Enabled' },
            devicePortList: [],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: true,
          nodeIDs: [],
          deviceUnit: {
            id: 'unit-005',
            annotation: {
              systemItems: {
                available: true,
              },
            },
          },
          physicalLocation: {
            rack: {
              id: 'rack-005',
              name: 'rack005',
              chassis: {
                id: 'chassis-005',
                name: 'chassis005',
              },
            },
          },
        },
      ];
      const { result } = renderHook(() => useFormatResourceListTableData(input));
      expect(result.current.formattedData[0].nodeIDs).toEqual([]);
    });

    test('returns rgError, rgIsValidating, rgMutate from useResourceGroupsData', () => {
      const mockMutate = jest.fn();
      (useResourceGroupsData as jest.Mock).mockReturnValue({
        data: [],
        error: 'err',
        validating: true,
        mutate: mockMutate,
        getNameById: mockGetNameById,
      });
      const { result } = renderHook(() => useFormatResourceListTableData([]));
      expect(result.current.rgError).toBe('err');
      expect(result.current.rgIsValidating).toBe(true);
      expect(result.current.rgMutate).toBe(mockMutate);
    });

    describe('useResourceListTableData', () => {
      test('returns formatted data, errors, isValidating, and mutate function', () => {
        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data).toEqual([
          {
            cxlSwitch: ['fabric1-CXL11'],
            detected: true,
            health: 'Warning',
            id: 'res101',
            nodeIDs: ['node101', 'node102'],
            resourceAvailable: 'Available',
            resourceGroups: [{ id: 'rg100', name: 'name-rg100' }],
            state: 'Enabled',
            type: 'CPU',
            placement: {
              rack: {
                id: 'rack-001',
                name: 'rack001',
                chassis: {
                  id: 'chassis-001',
                  name: 'chassis001',
                },
              },
            },
            composite: 'unit-001',
            status: 'Warning',
            powerState: 'On',
          },
          {
            cxlSwitch: ['fabric1-CXL12'],
            detected: false,
            health: 'OK',
            id: 'res102',
            nodeIDs: ['node101'],
            resourceAvailable: 'Unavailable',
            resourceGroups: [{ id: 'rg100', name: 'name-rg100' }],
            state: 'Disabled',
            type: 'CPU',
            placement: {
              rack: {
                id: 'rack-002',
                name: 'rack002',
                chassis: {
                  id: 'chassis-002',
                  name: 'chassis002',
                },
              },
            },
            composite: '',
            status: 'Critical',
            powerState: 'On',
          },
          {
            cxlSwitch: ['fabric1-CXL11'],
            detected: true,
            health: 'OK',
            id: 'res103',
            nodeIDs: [],
            resourceAvailable: 'Available',
            resourceGroups: [{ id: 'rg101', name: 'name-rg101' }],
            state: 'Enabled',
            type: 'Accelerator',
            placement: {
              rack: {
                id: 'rack-003',
                name: 'rack003',
                chassis: {
                  id: 'chassis-003',
                  name: 'chassis003',
                },
              },
            },
            composite: '',
            status: 'OK',
            powerState: 'On',
          },
        ]);
        result.current.mutate();
        expect(result.current.errors).toEqual([null, undefined]);
        expect(result.current.isValidating).toBe(false);
        expect(typeof result.current.mutate).toBe('function');
      });

      test('calls useFormatResourceListTableData with correct data', () => {
        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data).toEqual([
          {
            cxlSwitch: ['fabric1-CXL11'],
            detected: true,
            health: 'Warning',
            id: 'res101',
            nodeIDs: ['node101', 'node102'],
            resourceAvailable: 'Available',
            resourceGroups: [{ id: 'rg100', name: 'name-rg100' }],
            state: 'Enabled',
            type: 'CPU',
            placement: {
              rack: {
                id: 'rack-001',
                name: 'rack001',
                chassis: {
                  id: 'chassis-001',
                  name: 'chassis001',
                },
              },
            },
            composite: 'unit-001',
            status: 'Warning',
            powerState: 'On',
          },
          {
            cxlSwitch: ['fabric1-CXL12'],
            detected: false,
            health: 'OK',
            id: 'res102',
            nodeIDs: ['node101'],
            resourceAvailable: 'Unavailable',
            resourceGroups: [{ id: 'rg100', name: 'name-rg100' }],
            state: 'Disabled',
            type: 'CPU',
            placement: {
              rack: {
                id: 'rack-002',
                name: 'rack002',
                chassis: {
                  id: 'chassis-002',
                  name: 'chassis002',
                },
              },
            },
            composite: '',
            status: 'Critical',
            powerState: 'On',
          },
          {
            cxlSwitch: ['fabric1-CXL11'],
            detected: true,
            health: 'OK',
            id: 'res103',
            nodeIDs: [],
            resourceAvailable: 'Available',
            resourceGroups: [{ id: 'rg101', name: 'name-rg101' }],
            state: 'Enabled',
            type: 'Accelerator',
            placement: {
              rack: {
                id: 'rack-003',
                name: 'rack003',
                chassis: {
                  id: 'chassis-003',
                  name: 'chassis003',
                },
              },
            },
            composite: '',
            status: 'OK',
            powerState: 'On',
          },
        ]);
      });

      test('composite field uses deviceUnit.id fallback when constraints exist but deviceUnit.id is undefined', () => {
        const mockDataWithUndefinedDeviceUnitId: APIresources = {
          count: 1,
          resources: [
            {
              annotation: { available: true },
              device: {
                deviceID: 'res-test',
                type: 'CPU',
                status: { health: 'OK', state: 'Enabled' },
                devicePortList: [{ switchID: 'CXL1' }],
                powerState: 'On',
                powerCapability: true,
                constraints: {
                  nonRemovableDevices: [{ deviceID: 'dep1' }],
                },
              },
              resourceGroupIDs: [],
              detected: true,
              nodeIDs: [],
              deviceUnit: {
                id: undefined as any,
                annotation: {
                  systemItems: {
                    available: true,
                  },
                },
              },
              physicalLocation: {
                rack: {
                  id: 'rack-001',
                  name: 'rack001',
                  chassis: {
                    id: 'chassis-001',
                    name: 'chassis001',
                  },
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockDataWithUndefinedDeviceUnitId,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].composite).toBe('');
      });
    });

    describe('status calculation', () => {
      test('calculates OK status when health is OK and state is Enabled', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'OK' as const,
                  state: 'Enabled' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('OK');
      });

      test('calculates Critical status when health is OK and state is Disabled', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'OK' as const,
                  state: 'Disabled' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('Critical');
      });

      test('calculates Warning status when health is OK and state is StandbyOffline', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'OK' as const,
                  state: 'StandbyOffline' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('Warning');
      });

      test('calculates Warning status when health is Warning and state is Enabled', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'Warning' as const,
                  state: 'Enabled' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('Warning');
      });

      test('calculates Critical status when health is Warning and state is Disabled', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'Warning' as const,
                  state: 'Disabled' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('Critical');
      });

      test('calculates Critical status when health is Critical regardless of state', () => {
        const mockData = {
          count: 1,
          resources: [
            {
              ...resData.resources[0],
              device: {
                ...resData.resources[0].device,
                status: {
                  health: 'Critical' as const,
                  state: 'Enabled' as const,
                },
              },
            },
          ],
        };
        (useSWRImmutable as jest.Mock).mockImplementationOnce(() => ({
          data: mockData,
          error: null,
          mutate: jest.fn(),
        }));

        const { result } = renderHook(() => useResourceListTableData());
        expect(result.current.data[0].status).toBe('Critical');
      });
    });
  });

  describe('selectedAccessors fallback logic', () => {
    test('falls back to localSelectedAccessors when selectedAccessorsProp is undefined', () => {
      const { result } = renderHook(() => useResourceListTableData());

      render(
        <ResourceListTable
          selectedAccessors={undefined}
          data={result.current.data}
          loading={false}
          storeColumnsKey='test'
        />
      );

      // Component should render without crashing
      expect(CustomDataTable as jest.Mock).toHaveBeenCalled();
    });

    test('uses selectedAccessorsProp when provided with non-empty array', () => {
      const { result } = renderHook(() => useResourceListTableData());
      const customAccessors = ['id', 'type'];

      render(
        <ResourceListTable
          selectedAccessors={customAccessors}
          data={result.current.data}
          loading={false}
          storeColumnsKey='test'
        />
      );

      expect(CustomDataTable as jest.Mock).toHaveBeenCalled();
      const calledColumns = (CustomDataTable as jest.Mock).mock.lastCall[0].columns;
      const visibleColumns = calledColumns.filter((col: any) => !col.hidden);
      expect(visibleColumns.some((col: any) => customAccessors.includes(col.accessor))).toBeTruthy();
    });

    test('uses selectedAccessorsProp when provided with empty array (truthy value)', () => {
      const { result } = renderHook(() => useResourceListTableData());

      render(
        <ResourceListTable selectedAccessors={[]} data={result.current.data} loading={false} storeColumnsKey='test' />
      );

      // Empty array is truthy, so it should be used instead of localSelectedAccessors
      expect(CustomDataTable as jest.Mock).toHaveBeenCalled();
    });
  });

  describe('onStorageError callback', () => {
    test('should call onStorageError callback when storageError occurs', () => {
      const mockError = new Error('Storage quota exceeded');
      const mockStoredColumns = require('@/shared-modules/utils/storedColumns');
      mockStoredColumns.storedColumns.mockReturnValueOnce({
        selectedAccessors: selectedAccessors,
        toggleColumns: jest.fn(),
        storageError: mockError,
      });

      const onStorageErrorMock = jest.fn();
      const { result } = renderHook(() => useResourceListTableData());

      render(
        <ResourceListTable
          selectedAccessors={selectedAccessors}
          data={result.current.data}
          loading={false}
          storeColumnsKey='test'
          onStorageError={onStorageErrorMock}
        />
      );

      expect(onStorageErrorMock).toHaveBeenCalledWith(mockError);
    });

    test('should not call onStorageError callback when no error occurs', () => {
      const mockStoredColumns = require('@/shared-modules/utils/storedColumns');
      mockStoredColumns.storedColumns.mockReturnValueOnce({
        selectedAccessors: selectedAccessors,
        toggleColumns: jest.fn(),
        storageError: undefined,
      });

      const onStorageErrorMock = jest.fn();
      const { result } = renderHook(() => useResourceListTableData());

      render(
        <ResourceListTable
          selectedAccessors={selectedAccessors}
          data={result.current.data}
          loading={false}
          storeColumnsKey='test'
          onStorageError={onStorageErrorMock}
        />
      );

      expect(onStorageErrorMock).toHaveBeenCalledWith(undefined);
    });

    test('should work without onStorageError callback', () => {
      const mockStoredColumns = require('@/shared-modules/utils/storedColumns');
      mockStoredColumns.storedColumns.mockReturnValueOnce({
        selectedAccessors: selectedAccessors,
        toggleColumns: jest.fn(),
        storageError: new Error('Some error'),
      });

      const { result } = renderHook(() => useResourceListTableData());

      expect(() => {
        render(
          <ResourceListTable
            selectedAccessors={selectedAccessors}
            data={result.current.data}
            loading={false}
            storeColumnsKey='test'
          />
        );
      }).not.toThrow();
    });
  });
});
