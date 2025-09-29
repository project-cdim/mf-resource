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

import { act } from 'react';

import { Select } from '@mantine/core';
import { screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { useLocale } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';
import { useLoading, useMSW } from '@/shared-modules/utils/hooks';

import { ResourceListTable, useFormatResourceListTableData } from '@/components';

import Rack from '@/app/[lng]/rack/page';
import { dummyRack } from '@/utils/dummy-data/chassisList/chassisList';

jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  Select: jest.fn(),
}));
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
jest.mock('@/components/ResourceListTable', () => ({
  ResourceListTable: jest.fn(() => <div>Resource List Table</div>),
  useFormatResourceListTableData: jest.fn(() => ({
    data: [],
    rgError: undefined,
    rgIsValidating: false,
    rgMutate: jest.fn(),
  })),
}));

describe('Rack Elevations', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: dummyRack,
      error: null,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useMSW.mockReturnValue(false);
    // @ts-ignore
    useLoading.mockReturnValue(false);
  });

  test('The title is displayed', () => {
    render(<Rack />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    const mutate = givenProps.mutate;
    mutate();
    expect(mutate).toBeDefined();
    expect(givenProps.pageTitle).toBe('Rack Elevations');
    expect(givenProps.items).toEqual([{ title: 'Resource Management' }, { title: 'Rack Elevations' }]);
  });

  test('That the rack name is displayed', () => {
    render(<Rack />);
    const rackName = screen.getByText('Rack Name', { exact: false });
    expect(rackName).toHaveTextContent(`Rack Name : ${dummyRack.name}`);
  });

  test('It is possible to select a chassis(Select)', () => {
    render(<Rack />);
    act(() => {
      // @ts-ignore
      Select.mock.lastCall[0].onChange(dummyRack.chassis[0].id);
    });
    expect(screen.getByText('Model Name').nextSibling).toHaveTextContent(dummyRack.chassis[0].modelName);
    expect(screen.getByText('Description').nextSibling).toHaveTextContent(dummyRack.chassis[0].description);
    expect(screen.getByText('Position').nextSibling).toHaveTextContent(
      `U${dummyRack.chassis[0].unitPosition} / ${dummyRack.chassis[0].facePosition}`
    );
    expect(screen.getByText('Height(U)').nextSibling).toHaveTextContent(dummyRack.chassis[0].height.toString());
    expect(screen.getByText('Depth').nextSibling).toHaveTextContent(dummyRack.chassis[0].depth);
    expect(screen.getByText('Number of devices per type').nextSibling).toHaveTextContent('CPU(1)');
    expect(screen.getByText('Last Updated').nextSibling).toHaveTextContent(
      new Date(dummyRack.chassis[0].lastUpdate).toLocaleString()
    );
  });

  test('It is possible to select a chassis(button)', async () => {
    render(<Rack />);
    await UserEvent.click(screen.getByRole('button', { name: dummyRack.chassis[1].name }));
    expect(screen.getByText('Model Name').nextSibling).toHaveTextContent(dummyRack.chassis[1].modelName);
    expect(screen.getByText('Description').nextSibling).toHaveTextContent(dummyRack.chassis[1].description);
    expect(screen.getByText('Position').nextSibling).toHaveTextContent(
      `U${dummyRack.chassis[1].unitPosition} / ${dummyRack.chassis[1].facePosition}`
    );
    expect(screen.getByText('Height(U)').nextSibling).toHaveTextContent(dummyRack.chassis[1].height.toString());
    expect(screen.getByText('Depth').nextSibling).toHaveTextContent(dummyRack.chassis[1].depth);
    expect(screen.getByText('Number of devices per type').nextSibling).toHaveTextContent('CPU(1), Memory(1)');
    expect(screen.getByText('Last Updated').nextSibling).toHaveTextContent(
      new Date(dummyRack.chassis[1].lastUpdate).toLocaleString()
    );
  });

  test('The onMouseLeave event of the button works correctly', async () => {
    render(<Rack />);
    const button = screen.getByRole('button', { name: dummyRack.chassis[1].name });
    await UserEvent.unhover(button);
    expect(screen.getByText('Model Name').nextSibling).not.toHaveTextContent(dummyRack.chassis[1].modelName);
  });

  test('The loading is displayed', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      isValidating: true,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useLoading.mockReturnValue(true);
    render(<Rack />);
    // @ts-ignore
    const props = ResourceListTable.mock.lastCall[0];
    expect(props.loading).toBeTruthy();
  });
  test('The loading is not displayed', async () => {
    jest.useFakeTimers();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<Rack />);
    // @ts-ignore
    const loading = ResourceListTable.mock.lastCall[0].loading;
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(loading).toBeFalsy();
  });
  test('If there is no error, the message is not displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: null,
      mutate: jest.fn(),
    }));
    render(<Rack />);
    const alertDialog = screen.queryByRole('alert');
    expect(alertDialog).not.toBeInTheDocument();
  });
});

describe('Rack Elevations: When an Error Occurs', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: dummyRack,
      error: null,
      mutate: jest.fn(),
    }));
  });
  test('When the server returns an error, a message is displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: {
        message: 'Error occurred first',
        response: {
          data: {
            message: 'Error Message first',
          },
        },
      },
      mutate: jest.fn(),
    }));
    (useFormatResourceListTableData as jest.Mock).mockReturnValue({
      data: [],
      rgError: {
        message: 'Error occurred second',
        response: {
          data: {
            message: 'Error Message second',
          },
        },
      },
      rgIsValidating: false,
      rgMutate: jest.fn(),
    });
    render(<Rack />);
    // @ts-ignore
    const givenProps = MessageBox.mock.calls[0][0]; // the first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred first');
    expect(givenProps.message).toBe('Error Message first');
    // @ts-ignore
    const secondProps = MessageBox.mock.calls[1][0]; // the first argument of the last call
    expect(secondProps.type).toBe('error');
    expect(secondProps.title).toBe('Error occurred second');
    expect(secondProps.message).toBe('Error Message second');
  });

  test('When unable to connect to the server, message are displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: {
        message: 'Error occurred 1',
        response: null,
      },
      mutate: jest.fn(),
    }));
    (useFormatResourceListTableData as jest.Mock).mockReturnValue({
      data: [],
      rgError: {
        message: 'Error occurred 2',
        response: null,
      },
      rgIsValidating: false,
      rgMutate: jest.fn(),
    });
    render(<Rack />);
    // @ts-ignore
    const givenProps = MessageBox.mock.calls[0][0]; // the first argument of the last call
    expect(givenProps.type).toBe('error');
    expect(givenProps.title).toBe('Error occurred 1');
    expect(givenProps.message).toBe('');
    // @ts-ignore
    const secondProps = MessageBox.mock.calls[1][0]; // the first argument of the last call
    expect(secondProps.type).toBe('error');
    expect(secondProps.title).toBe('Error occurred 2');
    expect(secondProps.message).toBe('');
  });
});

describe('Rack Elevations(No Chassis)', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: null,
      mutate: jest.fn(),
    }));
  });

  test('The chassis information is not displayed', () => {
    render(<Rack />);
    const button = screen.queryByRole('button', { name: 'Saturn aaaaaaaa' });
    expect(button).toBeNull();
    // @ts-ignore
    const data = ResourceListTable.mock.lastCall[0].data;
    expect(data).toBeUndefined();
  });
});

describe('The properties of the card vary depending on the display language', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: null,
      mutate: jest.fn(),
    }));
  });

  test('When in English, the style becomes white-space:normal', () => {
    // @ts-ignore
    useLocale.mockReset();
    // @ts-ignore
    useLocale.mockReturnValue('en');

    render(<Rack />);
    const th = screen.queryByText('Number of devices per type');
    expect(th).toHaveStyle({ whiteSpace: 'normal' });
  });

  test('When in Japanese, the style becomes white-space:nowrap', () => {
    // @ts-ignore
    useLocale.mockReset();
    // @ts-ignore
    useLocale.mockReturnValue('ja');

    render(<Rack />);
    const th = screen.queryByText('Number of devices per type');
    expect(th).toHaveStyle({ whiteSpace: 'nowrap' });
  });
});
