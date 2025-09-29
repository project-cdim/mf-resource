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
import { APInodes } from '@/shared-modules/types';

import { APPNode } from '@/types';

import NodeList from '@/app/[lng]/node-list/page';
import { useNodeListFilter } from '@/utils/hooks/useNodeListFilter';
import { useColumns } from '@/utils/hooks/node-list/useColumns';

const resData: APInodes = {
  count: 2,
  nodes: [
    {
      id: 'res10101',
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10101',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'CPU',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10202',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'memory',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10603',
            status: {
              health: 'Warning',
              state: 'Disabled',
            },
            type: 'virtualMedia',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: false,
        },
      ],
    },
    {
      id: 'res10102',
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10102',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'CPU',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: false,
          },
          device: {
            deviceID: 'res10203',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'memory',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10302',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'storage',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: false,
          },
          device: {
            deviceID: 'res10401',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'networkInterface',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: true,
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10604',
            status: {
              health: 'Critical',
              state: 'Disabled',
            },
            type: 'virtualMedia',
            deviceSwitchInfo: 'CXL001',
          },
          resourceGroupIDs: [],
          detected: false,
        },
      ],
    },
  ],
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
jest.mock('@/utils/hooks/useNodeListFilter');
jest.mock('@/utils/hooks/node-list/useColumns');

describe('Node List', () => {
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
    useNodeListFilter.mockImplementation((data: APPNode[]) => ({
      filteredRecords: data,
    }));
    // @ts-ignore
    useColumns.mockImplementation(() => ({
      columns: undefined,
    }));
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<NodeList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Nodes');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'Nodes' }]);
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
    render(<NodeList />);
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
        // response: null,
      },
      mutate: jest.fn(),
    }));
    render(<NodeList />);
    // @ts-ignore
    const givenProps = MessageBox.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('');
  });
});
