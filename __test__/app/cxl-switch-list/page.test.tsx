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

import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';

import { APIcxlswitch, APIcxlswitchs, APPCxlSwitch } from '@/types';
import { useCxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';
import { useColumns } from '@/utils/hooks/cxl-switch-list/useColumns';
import CxlSwitchList from '@/app/[lng]/cxl-switch-list/page';

const cxlSwitch: APIcxlswitch = {
  id: 'CXL11',
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
        deviceSwitchInfo: 'CXLxxx',
        links: [
          {
            type: 'CPU',
            deviceID: 'xxx',
          },
        ],
      },
      resourceGroupIDs: [],
      nodeIDs: ['node1'],
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
        deviceSwitchInfo: 'CXLxxx',
        links: [
          {
            type: 'CPU',
            deviceID: 'xxx',
          },
        ],
      },
      resourceGroupIDs: [],
      nodeIDs: ['node1'],
    },
  ],
};

const resData: APIcxlswitchs = {
  CXLSwitches: [{ ...cxlSwitch }, { ...cxlSwitch, id: 'CXL12' }, { ...cxlSwitch, id: 'CXL13' }],
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
  useMSW: jest.fn(),
  useLoading: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));
jest.mock('@/utils/hooks/useCxlSwitchListFilter');
jest.mock('@/utils/hooks/cxl-switch-list/useColumns');

describe('CXL Switches', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: resData,
      error: null,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useCxlSwitchListFilter.mockImplementation((data: APPCxlSwitch[]) => ({
      filteredRecords: data,
    }));
    // @ts-ignore
    useColumns.mockImplementation(() => ({
      columns: undefined,
    }));
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<CxlSwitchList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('CXL Switches');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'CXL Switches' }]);
  });

  test('When the server returns an error, a message is displayed', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: {
        message: 'Error occurred',
        response: {
          data: {
            message: 'Error Message',
          },
        },
      },
      mutate: jest.fn(),
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
      error: {
        message: 'Error occurred',
      },
      mutate: jest.fn(),
    }));
    render(<CxlSwitchList />);
    // @ts-ignore
    const givenProps = MessageBox.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('');
  });
});
