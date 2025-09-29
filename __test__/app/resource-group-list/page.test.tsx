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
import UserEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';

import { APPNode } from '@/types';

import ResourceGroupList from '@/app/[lng]/resource-group-list/page';
import { useResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';
import { useColumns } from '@/utils/hooks/resource-group-list/useColumns';
import { dummyAPIResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';
import { usePermission } from '@/shared-modules/utils/hooks';

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
  usePermission: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));
jest.mock('@/utils/hooks/useResourceGroupListFilter');
jest.mock('@/utils/hooks/resource-group-list/useColumns');

describe('Resource Group List', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: dummyAPIResourceGroups,
      error: null,
      mutate: jest.fn(),
    }));
    (useResourceGroupListFilter as jest.Mock).mockImplementation((data: APPNode[]) => ({
      filteredRecords: data,
    }));
    (useColumns as jest.Mock).mockImplementation(() => ({
      columns: undefined,
    }));
    (usePermission as jest.Mock).mockReset().mockReturnValue(true);
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<ResourceGroupList />);
    const givenProps = (PageHeader as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Resource Groups');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'Resource Groups' }]);
  });

  test('When the server returns an error, a message is displayed', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
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
    render(<ResourceGroupList />);
    const givenProps = (MessageBox as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('Error Message');
  });

  test('When unable to connect to the server, a message is displayed', async () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      error: {
        message: 'Error occurred',
        // response: null,
      },
      mutate: jest.fn(),
    }));
    render(<ResourceGroupList />);
    const givenProps = (MessageBox as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred');
    expect(givenProps.message).toBe('');
  });

  test('Click on the Add button opens the modal (with manage-permission)', async () => {
    const openModal = jest.fn();
    (useColumns as jest.Mock).mockImplementation(() => ({
      columns: undefined,
      records: [],
      openModal,
    }));
    render(<ResourceGroupList />);
    const addButton = screen.getByRole('button', { name: 'Add' });
    await UserEvent.click(addButton);
    expect(addButton).toBeEnabled();
  });

  test('Click on the Add button opens the modal (without manage-permission)', async () => {
    (usePermission as jest.Mock).mockReturnValue(false);
    const openModal = jest.fn();
    (useColumns as jest.Mock).mockImplementation(() => ({
      columns: undefined,
      records: [],
      openModal,
    }));
    render(<ResourceGroupList />);
    const addButton = screen.getByRole('button', { name: 'Add' });
    await UserEvent.click(addButton);
    expect(addButton).toBeDisabled();
  });
});
