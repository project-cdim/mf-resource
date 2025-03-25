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

import React, { act } from 'react';

import { useRouter } from 'next/navigation';

import { LoadingOverlay, Tabs } from '@mantine/core';
import { screen } from '@testing-library/react';
import useSWR from 'swr';

import { render } from '@/shared-modules/__test__/test-utils';
import { APIresources } from '@/shared-modules/types';

import { TabList, TabPanel, TabPanelAll } from '@/components';

import Home from '@/app/[lng]/summary/page';

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
          health: 'OK',
          state: 'Enabled',
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
          state: 'Enabled',
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

// device types included in test data
const deviceTypes = ['Accelerator', 'CPU'];

jest.mock('swr');

jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  TabList: jest.fn(),
  TabPanel: jest.fn(),
  TabPanelAll: jest.fn(),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  LoadingOverlay: jest.fn(),
  Tabs: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn().mockReturnValue({ query: {}, isReady: true }),
}));

describe('Resource Management Summary', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    useSWR.mockReset();
    // @ts-ignore
    useSWR.mockImplementation((key: string | undefined) => ({
      data: key ? (key.includes('resources') ? resData : undefined) : undefined,
      error: null,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    TabList.mockReset();
    // @ts-ignore
    TabPanel.mockReset();
    // @ts-ignore
    TabPanelAll.mockReset();
  });

  test('The title is displayed', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Summary');
  });

  test('The loading is displayed', () => {
    // @ts-ignore
    useSWR.mockImplementation(() => ({
      isValidating: true,
      mutate: jest.fn(),
    }));
    render(<Home />);
    // @ts-ignore
    expect(LoadingOverlay.mock.lastCall[0].visible).toBe(true);
  });

  test('The TabList is displayed', () => {
    render(<Home />);
    // @ts-ignore
    const props = TabList.mock.lastCall[0];
    expect(props.tabs).toEqual(['summary', 'all', ...deviceTypes]);
  });
  test('TabPanelAll is displayed', () => {
    render(<Home />);
    // @ts-ignore
    const props = TabPanelAll.mock.lastCall[0];
    expect(props.tabs).toEqual(['all', ...deviceTypes]);
    expect(props.data).toEqual(resData);
  });
  test('TabPanel is displayed', () => {
    render(<Home />);
    // @ts-ignore
    const props = TabPanel.mock.lastCall[0];
    expect(props.tabs).toEqual(['summary', ...deviceTypes]);
    expect(props.data).toEqual(resData);
  });
  test('if query contain tab, it is set to activeTab', () => {
    // @ts-ignore
    useRouter.mockReturnValue({ query: { tab: 'all' }, isReady: true });
    render(<Home />);
    // @ts-ignore
    const props = Tabs.mock.lastCall[0];
    expect(props.value).toBe('all');
  });
  test('if query contain multiple tabs, first item is set to activeTab', () => {
    // @ts-ignore
    useRouter.mockReturnValue({ query: { tab: ['all', 'memory'] }, isReady: true });
    render(<Home />);
    // @ts-ignore
    const props = Tabs.mock.lastCall[0];
    expect(props.value).toBe('all');
  });

  test('if query contain tab but it is not in devicetypetablist,  summary is set to activeTab', () => {
    // @ts-ignore
    useRouter.mockReturnValue({ query: { tab: 'not_in_list' }, isReady: true });
    render(<Home />);
    // @ts-ignore
    const props = Tabs.mock.lastCall[0];
    expect(props.value).toBe('summary');
  });

  test('activeTab is updated by onChange of Tabs', () => {
    render(<Home />);
    act(() => {
      // @ts-ignore
      Tabs.mock.lastCall[0].onChange('all');
    });

    // @ts-ignore
    expect(Tabs.mock.lastCall[0].value).toBe('all');
  });
  test('activeTab is updated by onChange of Tabs (null)', () => {
    render(<Home />);
    act(() => {
      // @ts-ignore
      Tabs.mock.lastCall[0].onChange(null);
    });

    // @ts-ignore
    expect(Tabs.mock.lastCall[0].value).toBe('summary');
  });
});

// Error message
// Loading
describe('Resource Management Summary: On Error', () => {
  test('When the server returns an error, a message is displayed', async () => {
    // @ts-ignore
    useSWR.mockImplementation(() => ({
      error: {
        message: 'An error occurred',
        response: {
          data: {
            message: 'Error Message',
          },
        },
      },
      mutate: jest.fn(),
    }));
    render(<Home />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('An error occurred');
    expect(message).toHaveTextContent('Error Message');
  });
  test('When unable to connect to the server, a message is displayed', async () => {
    // @ts-ignore
    useSWR.mockImplementation(() => ({
      error: {
        message: 'An error occurred',
        response: null,
      },
      mutate: jest.fn(),
    }));
    render(<Home />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('An error occurred');
    expect(message).toBeNull();
  });
});
