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

import { screen } from '@testing-library/react';
import { act } from 'react';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageHeader } from '@/shared-modules/components';
import { useIdFromQuery } from '@/shared-modules/utils/hooks';

import { ResourceListTable } from '@/components';

import useSWRImmutable from 'swr/immutable';
import { dummyAPIResourceGroup1 } from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';
import ResourceGroupDetail from '@/app/[lng]/resource-group-detail/page';

jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useIdFromQuery: jest.fn(),
}));

jest.mock('@/shared-modules/components/GraphView');
jest.mock('@/components/ResourceListTable');

jest.mock('@/shared-modules/components/PageHeader');

describe('Resource Group Detail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: dummyAPIResourceGroup1,
      error: null,
      mutate: jest.fn(),
    }));
    (useIdFromQuery as jest.Mock).mockReturnValue(dummyAPIResourceGroup1.id);
  });

  test('The title is displayed', () => {
    render(<ResourceGroupDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0];
    expect(givenProps.pageTitle).toBe('Resource Group Details');
    expect(givenProps.mutate()).toBeUndefined();
  });

  test('The name is displayed', () => {
    render(<ResourceGroupDetail />);
    const name = screen.getByText('Name').nextSibling;
    expect(name).toHaveTextContent(dummyAPIResourceGroup1.name);
  });

  test('The description is displayed', () => {
    render(<ResourceGroupDetail />);
    const description = screen.getByText('Description').nextSibling;
    expect(description).toHaveTextContent(dummyAPIResourceGroup1.description);
  });

  test('The ID is displayed', () => {
    render(<ResourceGroupDetail />);
    const Id = screen.getByText('ID').nextSibling;
    expect(Id).toHaveTextContent(dummyAPIResourceGroup1.id);
  });

  test('The created date is displayed', () => {
    render(<ResourceGroupDetail />);
    const created = screen.getByText('Created').nextSibling;
    expect(created).toHaveTextContent(new Date(dummyAPIResourceGroup1.createdAt).toLocaleString());
  });

  test('The updated date is displayed', () => {
    render(<ResourceGroupDetail />);
    const updated = screen.getByText('Updated').nextSibling;
    expect(updated).toHaveTextContent(new Date(dummyAPIResourceGroup1.updatedAt).toLocaleString());
  });

  test('The loading is displayed', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      isValidating: true,
      mutate: jest.fn(),
    }));
    render(<ResourceGroupDetail />);
    const props = (ResourceListTable as jest.Mock).mock.lastCall[0];
    expect(props.loading).toBeTruthy();
  });

  test('The loading is not displayed', async () => {
    jest.useFakeTimers();
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<ResourceGroupDetail />);
    const loading = (ResourceListTable as jest.Mock).mock.lastCall[0].loading;
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(loading).toBeFalsy();
  });

  test('If there is no error, the message is not displayed', async () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceGroupDetail />);
    const alertDialog = screen.queryByRole('alert');
    expect(alertDialog).not.toBeInTheDocument();
  });

  test('While the query is not being fetched, the id is set to an empty string', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn(),
    }));
    (useIdFromQuery as jest.Mock).mockReturnValue('');
    render(<ResourceGroupDetail />);
    const Id = screen.getByText('ID').nextSibling;
    expect(Id).toHaveTextContent('');
  });

  test('When the server returns an error, a message is displayed', async () => {
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
    render(<ResourceGroupDetail />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('Error occurred');
    expect(message).toHaveTextContent('Error Message');
  });

  test('When unable to connect to the server, a message is displayed', async () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      error: {
        message: 'Error occurred',
        response: null,
      },
      mutate: jest.fn(),
    }));
    render(<ResourceGroupDetail />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('Error occurred');
    expect(message).toBeNull();
  });
});
