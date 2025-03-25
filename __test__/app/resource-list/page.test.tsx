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

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';
import { APIresources } from '@/shared-modules/types';

import ResourceList from '@/app/[lng]/resource-list/page';
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
      nodeIDs: [],
    },
    {
      annotation: {
        available: false,
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
          state: 'Disabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: [],
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
      resourceGroupIDs: [],
      nodeIDs: [],
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
  useMSW: jest.fn(),
  useLoading: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));
jest.mock('@/components/ResourceListTable');

describe('Resource list', () => {
  beforeEach(() => {
    // run before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: resData,
      error: null,
      mutate: jest.fn(),
    }));
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<ResourceList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Resources.list');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'Resources.list' }]);
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
    render(<ResourceList />);
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
    render(<ResourceList />);
    // @ts-ignore
    const givenProps = MessageBox.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('');
  });
});
