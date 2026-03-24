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

import React from 'react';
import { screen } from '@testing-library/react';

import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader, CustomDataTable } from '@/shared-modules/components';
import { useLoading, useTableSettings } from '@/shared-modules/utils/hooks';

import { APIcxlswitch, APIcxlswitches, APPCxlSwitch } from '@/types';
import { useCxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';
import { useColumns } from '@/utils/hooks/cxl-switch-list/useColumns';
import CxlSwitchList from '@/app/[lng]/cxl-switch-list/page';

const cxlSwitch: APIcxlswitch = {
  fabricID: 'fabric1',
  cxlSwitchID: 'CXL11',
  resources: [
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res101',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'CPU',
        devicePortList: [{ switchID: 'CXLxxx' }],
        links: [
          {
            type: 'CPU',
            deviceID: 'xxx',
          },
        ],
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      detected: true,
      nodeIDs: ['node1'],
      physicalLocation: {
        rack: {
          id: '00000000-0000-0000-0000-000000000111',
          name: 'rack001',
          chassis: { id: 'ch1', name: 'chassis001' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res102',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'CPU',
        devicePortList: [{ switchID: 'CXLxxx' }],
        links: [
          {
            type: 'CPU',
            deviceID: 'xxx',
          },
        ],
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      detected: false,
      nodeIDs: ['node1'],
      physicalLocation: {
        rack: {
          id: '00000000-0000-0000-0000-000000000111',
          name: 'rack001',
          chassis: { id: 'ch1', name: 'chassis001' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
  ],
};

const resData: APIcxlswitches = {
  CXLSwitches: [
    { ...cxlSwitch },
    { ...cxlSwitch, fabricID: 'fabric1', cxlSwitchID: 'CXL12' },
    { ...cxlSwitch, fabricID: 'fabric1', cxlSwitchID: 'CXL13' },
  ],
  count: 3,
};

jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('mantine-datatable');
jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn(),
  useLoading: jest.fn(),
  useTableSettings: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
  CustomDataTable: jest.fn(() => <div data-testid='mock-custom-data-table'>Custom Data Table</div>),
}));
jest.mock('@/utils/hooks/useCxlSwitchListFilter');
jest.mock('@/utils/hooks/cxl-switch-list/useColumns');

describe('CXL Switches', () => {
  const mockMutate = jest.fn();
  const mockHandleSaveTableSettings = jest.fn();

  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: resData,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));
    // @ts-ignore
    useLoading.mockReturnValue(false);
    // @ts-ignore
    useTableSettings.mockReturnValue({
      columns: [],
      defaultColumns: [],
      selectedAccessors: [
        'id',
        'device.connected',
        'device.unallocated',
        'device.disabled',
        'device.warning',
        'device.critical',
        'device.resourceUnavailable',
      ],
      handleSaveTableSettings: mockHandleSaveTableSettings,
    });
    // @ts-ignore
    useCxlSwitchListFilter.mockImplementation((data: APPCxlSwitch[]) => ({
      filteredRecords: data,
    }));
    // @ts-ignore
    useColumns.mockImplementation(() => []);
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<CxlSwitchList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('CXL Switches');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'CXL Switches' }]);
    expect(givenProps.loading).toBe(false);
    expect(givenProps.mutate).toBe(mockMutate);

    // Check CustomDataTable is rendered
    expect(screen.getByTestId('mock-custom-data-table')).toBeInTheDocument();
  });

  test('Renders CustomDataTable with correct props', () => {
    render(<CxlSwitchList />);

    expect(CustomDataTable).toHaveBeenCalled();
    // @ts-ignore
    const tableProps = CustomDataTable.mock.lastCall[0];
    expect(tableProps.loading).toBe(false);
    expect(tableProps.defaultSortColumn).toBe('id');
    expect(tableProps.storeColumnsKey).toBe('cxl-switch-list.cxl-switch-list');
    expect(tableProps.showSettingsButton).toBe(true);
    expect(tableProps.tableName).toBe('CXL Switches');
    expect(tableProps.onSaveTableSettings).toBe(mockHandleSaveTableSettings);
  });

  test('When the server returns an error, a message is displayed', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: {
        message: 'Error occurred',
        response: {
          data: {
            message: 'Error Message',
          },
        },
      },
      isValidating: false,
      mutate: mockMutate,
    }));
    render(<CxlSwitchList />);
    // @ts-ignore
    const givenProps = MessageBox.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('Error Message');
  });

  test('When unable to connect to the server, a message is displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: {
        message: 'Error occurred',
      },
      isValidating: false,
      mutate: mockMutate,
    }));
    render(<CxlSwitchList />);
    // @ts-ignore
    const givenProps = MessageBox.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('');
  });

  test('Shows loading state correctly', () => {
    // @ts-ignore
    useLoading.mockReturnValue(true);
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: true,
      mutate: mockMutate,
    }));

    render(<CxlSwitchList />);

    // @ts-ignore
    const pageHeaderProps = PageHeader.mock.lastCall[0];
    expect(pageHeaderProps.loading).toBe(true);

    // @ts-ignore
    const tableProps = CustomDataTable.mock.lastCall[0];
    expect(tableProps.loading).toBe(true);
  });

  test('When storageError occurs, a message is displayed', () => {
    const mockStorageError = new Error('Failed to save column settings');
    // @ts-ignore
    useTableSettings.mockReturnValue({
      columns: [],
      defaultColumns: [],
      selectedAccessors: [
        'id',
        'device.connected',
        'device.unallocated',
        'device.disabled',
        'device.warning',
        'device.critical',
        'device.resourceUnavailable',
      ],
      handleSaveTableSettings: mockHandleSaveTableSettings,
      storageError: mockStorageError,
    });

    render(<CxlSwitchList />);
    // @ts-ignore
    const messageBoxCalls = MessageBox.mock.calls;
    const storageErrorCall = messageBoxCalls.find((call: any[]) => call[0].title === mockStorageError.message);

    expect(storageErrorCall).toBeDefined();
    expect(storageErrorCall[0].type).toBe('error');
    expect(storageErrorCall[0].title).toBe('Failed to save column settings');
    expect(storageErrorCall[0].message).toBe('');
  });

  test('When no storageError occurs, storageError message is not displayed', () => {
    // @ts-ignore
    useTableSettings.mockReturnValue({
      columns: [],
      defaultColumns: [],
      selectedAccessors: [
        'id',
        'device.connected',
        'device.unallocated',
        'device.disabled',
        'device.warning',
        'device.critical',
        'device.resourceUnavailable',
      ],
      handleSaveTableSettings: mockHandleSaveTableSettings,
      storageError: undefined,
    });

    render(<CxlSwitchList />);
    // @ts-ignore
    const messageBoxCalls = MessageBox.mock.calls;

    // Verify no MessageBox is called with storage-related error
    const storageErrorCall = messageBoxCalls.find(
      (call: any[]) => call[0].title && call[0].title.toLowerCase().includes('storage')
    );
    expect(storageErrorCall).toBeUndefined();
  });

  test('Formats data correctly with different resource states', () => {
    const complexCxlSwitch: APIcxlswitch = {
      fabricID: 'fabric1',
      cxlSwitchID: 'CXL20',
      resources: [
        {
          annotation: { available: true },
          device: {
            deviceID: 'res201',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            devicePortList: [{ switchID: 'CXL' }],
            links: [],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: true,
          nodeIDs: ['node1'],
          physicalLocation: { rack: { id: 'rack1', name: 'rack001', chassis: { id: 'ch1', name: 'chassis001' } } },
          deviceUnit: { id: 'unit1', annotation: { systemItems: { available: true } } },
        },
        {
          annotation: { available: false },
          device: {
            deviceID: 'res202',
            status: { health: 'Warning', state: 'Enabled' },
            type: 'memory',
            devicePortList: [{ switchID: 'CXL' }],
            links: [],
            powerState: 'On',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: true,
          nodeIDs: [],
          physicalLocation: { rack: { id: 'rack1', name: 'rack001', chassis: { id: 'ch1', name: 'chassis001' } } },
          deviceUnit: { id: 'unit1', annotation: { systemItems: { available: true } } },
        },
        {
          annotation: { available: true },
          device: {
            deviceID: 'res203',
            status: { health: 'Critical', state: 'Disabled' },
            type: 'storage',
            devicePortList: [{ switchID: 'CXL' }],
            links: [],
            powerState: 'Off',
            powerCapability: true,
          },
          resourceGroupIDs: [],
          detected: true,
          nodeIDs: [],
          physicalLocation: { rack: { id: 'rack1', name: 'rack001', chassis: { id: 'ch1', name: 'chassis001' } } },
          deviceUnit: { id: 'unit1', annotation: { systemItems: { available: true } } },
        },
      ],
    };

    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: { CXLSwitches: [complexCxlSwitch], count: 1 },
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CxlSwitchList />);

    // @ts-ignore
    const tableProps = CustomDataTable.mock.lastCall[0];
    const records = tableProps.records;

    expect(records).toHaveLength(1);
    expect(records[0]).toEqual({
      id: 'fabric1-CXL20',
      device: {
        connected: 3,
        unallocated: 2,
        disabled: 1,
        warning: 1,
        critical: 1,
        resourceUnavailable: 1,
      },
    });
  });

  test('Handles empty CXL switches data', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: { CXLSwitches: [], count: 0 },
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CxlSwitchList />);

    // @ts-ignore
    const tableProps = CustomDataTable.mock.lastCall[0];
    expect(tableProps.records).toEqual([]);
  });

  test('Handles undefined data', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CxlSwitchList />);

    // @ts-ignore
    const tableProps = CustomDataTable.mock.lastCall[0];
    expect(tableProps.records).toEqual([]);
  });

  test('Uses correct column definitions', () => {
    render(<CxlSwitchList />);

    expect(useTableSettings).toHaveBeenCalledWith(
      [
        { id: 'id', label: 'ID', fixed: true },
        { id: 'device.connected', label: 'Resources.number', fixed: false },
        { id: 'device.unallocated', label: 'Unallocated Resources', fixed: false },
        { id: 'device.disabled', label: 'Disabled Resources', fixed: false },
        { id: 'device.warning', label: 'Warning Resources', fixed: false },
        { id: 'device.critical', label: 'Critical Resources', fixed: false },
        { id: 'device.resourceUnavailable', label: 'Maintenance Resources', fixed: false },
      ],
      [
        'id',
        'device.connected',
        'device.unallocated',
        'device.disabled',
        'device.warning',
        'device.critical',
        'device.resourceUnavailable',
      ],
      'cxl-switch-list.cxl-switch-list'
    );
  });

  test('Calls useColumns with correct parameters', () => {
    render(<CxlSwitchList />);

    expect(useColumns).toHaveBeenCalled();
    // @ts-ignore
    const callArgs = useColumns.mock.lastCall;
    expect(callArgs[0]).toHaveProperty('filteredRecords');
    expect(callArgs[1]).toEqual([
      'id',
      'device.connected',
      'device.unallocated',
      'device.disabled',
      'device.warning',
      'device.critical',
      'device.resourceUnavailable',
    ]);
  });
});
