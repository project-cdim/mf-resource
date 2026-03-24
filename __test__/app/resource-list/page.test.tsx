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
import { act } from '@testing-library/react';

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
    status: 'OK',
    powerState: 'On',
    detected: true,
    resourceGroups: [
      {
        id: '10000000-0000-7000-8000-000000000001',
        name: 'name rgrpDesca1',
      },
    ],
    cxlSwitch: [],
    nodeIDs: ['0001'],
    resourceAvailable: 'Unavailable',
  },
];

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
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
    expect(tableGivenProps.defaultAccessors).toEqual([
      'id',
      'type',
      'status',
      'powerState',
      'detected',
      'resourceAvailable',
      'resourceGroups',
      'placement',
      'cxlSwitch',
      'nodeIDs',
    ]);
    expect(tableGivenProps.data).toEqual(data);
    expect(tableGivenProps.loading).toBe(false);
    expect(tableGivenProps.storeColumnsKey).toBe('resource-list.resource-list');
    expect(tableGivenProps.tableName).toBe('Resources.list');
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

  test('When storageError occurs via callback, a message is displayed', () => {
    const mockStorageError = new Error('Storage operation failed');

    const { rerender } = render(<ResourceList />);

    // Simulate ResourceListTable calling onStorageError callback
    // @ts-ignore
    const tableProps = ResourceListTable.mock.lastCall[0];
    expect(tableProps.onStorageError).toBeDefined();

    // Call the callback with storageError wrapped in act
    act(() => {
      tableProps.onStorageError(mockStorageError);
    });

    // Re-render to see the effect
    rerender(<ResourceList />);

    // Verify MessageBox is called with the error
    // @ts-ignore
    const messageBoxCalls = MessageBox.mock.calls;
    const storageErrorCall = messageBoxCalls.find((call: any[]) => call[0].title === mockStorageError.message);

    expect(storageErrorCall).toBeDefined();
    expect(storageErrorCall[0].type).toBe('error');
    expect(storageErrorCall[0].title).toBe('Storage operation failed');
    expect(storageErrorCall[0].message).toBe('');
  });

  test('When no storageError occurs, storageError message is not displayed', () => {
    render(<ResourceList />);

    // Verify ResourceListTable receives onStorageError callback
    // @ts-ignore
    const tableProps = ResourceListTable.mock.lastCall[0];
    expect(tableProps.onStorageError).toBeDefined();

    // Do not call the callback

    // @ts-ignore
    const messageBoxCalls = MessageBox.mock.calls;

    // Verify no MessageBox is called with storage-related error
    const storageErrorCall = messageBoxCalls.find(
      (call: any[]) => call[0].title && call[0].title.toLowerCase().includes('storage')
    );
    expect(storageErrorCall).toBeUndefined();
  });
});
