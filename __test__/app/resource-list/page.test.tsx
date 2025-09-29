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

import ResourceList from '@/app/[lng]/resource-list/page';
import { useResourceListTableData, ResourceListTable } from '@/components';
import { APPResource } from '@/types';

const data: APPResource[] = [
  {
    id: '0001',
    type: 'CPU',
    health: 'OK',
    state: 'Enabled',
    detected: true,
    resourceGroups: [
      {
        id: '10000000-0000-7000-8000-000000000001',
        name: 'name rgrpDesca1',
      },
    ],
    cxlSwitchId: '',
    nodeIDs: ['0001'],
    resourceAvailable: 'Unavailable',
  },
];

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useMSW: jest.fn(),
  useLoading: jest.fn().mockReturnValue(false),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));
jest.mock('@/components/ResourceListTable', () => ({
  ResourceListTable: jest.fn(() => <div>Resource List Table</div>),
  useResourceListTableData: jest.fn(() => ({
    data: data,
    errors: [undefined, undefined],
    isValidating: false,
    mutate: jest.fn(),
  })),
}));

describe('Resource list', () => {
  beforeEach(() => {
    // run before each test
    jest.clearAllMocks();
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<ResourceList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Resources.list');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'Resources.list' }]);
    // @ts-ignore
    const tableGivenProps = ResourceListTable.mock.lastCall[0]; // The first argument of the last call
    expect(tableGivenProps.selectedAccessors).toEqual([
      'id',
      'type',
      'health',
      'state',
      'detected',
      'resourceGroups',
      'cxlSwitchId',
      'nodeIDs',
      'resourceAvailable',
    ]);
    expect(tableGivenProps.data).toEqual(data);
    expect(tableGivenProps.loading).toBe(false);
  });

  test('When the server returns errors, messages are displayed', () => {
    (useResourceListTableData as jest.Mock).mockReturnValue({
      data: [],
      errors: [
        {
          message: 'Error occurred first',
          response: {
            data: {
              message: 'Error Message first',
            },
          },
        },
        {
          message: 'Error occurred second',
          response: {
            data: {
              message: 'Error Message second',
            },
          },
        },
      ],
      isValidating: false,
      mutate: jest.fn(),
    });

    render(<ResourceList />);

    expect(MessageBox).toHaveBeenCalledTimes(2);

    // @ts-ignore
    const firstCallProps = MessageBox.mock.calls[0][0]; // The first argument of the first call
    expect(firstCallProps.type).toBe('error');
    expect(firstCallProps.title).toBe('Error occurred first');
    expect(firstCallProps.message).toBe('Error Message first');
    // @ts-ignore
    const secondCallProps = MessageBox.mock.calls[1][0]; // The first argument of the second call
    expect(secondCallProps.type).toBe('error');
    expect(secondCallProps.title).toBe('Error occurred second');
    expect(secondCallProps.message).toBe('Error Message second');
  });

  test('When unable to connect to the server, messages are displayed', async () => {
    (useResourceListTableData as jest.Mock).mockReturnValue({
      data: [],
      errors: [
        {
          message: 'Error occurred first',
        },
        {
          message: 'Error occurred second',
        },
      ],
      isValidating: false,
      mutate: jest.fn(),
    });

    render(<ResourceList />);

    expect(MessageBox).toHaveBeenCalledTimes(2);

    // @ts-ignore
    const firstCallProps = MessageBox.mock.calls[0][0]; // The first argument of the first call
    expect(firstCallProps.type).toBe('error');
    expect(firstCallProps.title).toBe('Error occurred first');
    expect(firstCallProps.message).toBe('');
    // @ts-ignore
    const secondCallProps = MessageBox.mock.calls[1][0]; // The first argument of the second call
    expect(secondCallProps.type).toBe('error');
    expect(secondCallProps.title).toBe('Error occurred second');
    expect(secondCallProps.message).toBe('');
  });
});
