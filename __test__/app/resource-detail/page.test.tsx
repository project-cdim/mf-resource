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

import { act, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import { NextIntlClientProvider, useTranslations } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';
import { GraphView, PageHeader } from '@/shared-modules/components';
import commonMessages from '@/shared-modules/public/locales/en/common.json';
import mfResourceMessages from '@/shared-modules/public/locales/en/mf-resource.json';
import { APIPromQL, APIresource } from '@/shared-modules/types';
import { useIdFromQuery, useLoading, usePermission } from '@/shared-modules/utils/hooks';

import ResourceDetail from '@/app/[lng]/resource-detail/page';
import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';

const resData: APIresource = {
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
  nodeIDs: ['NodeID001'],
};

const resData2: APIresource = {
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
    type: 'networkInterface',
  },
  resourceGroupIDs: [],
  nodeIDs: ['NodeID001', 'NodeID002'],
};

const resData3: APIresource = {
  annotation: {
    available: false,
  },
  device: {
    capacityMiB: 4096,
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
    type: 'memory',
  },
  resourceGroupIDs: [],
  nodeIDs: [],
};

const resData4: APIresource = {
  annotation: {
    available: true,
  },
  device: {
    driveCapacityBytes: 4096,
    deviceID: 'res101',
    deviceSwitchInfo: 'CXL11',
    links: [
      {
        deviceID: 'res202',
        type: 'storage',
      },
    ],
    status: {
      health: 'OK',
      state: 'Enabled',
    },
    type: 'storage',
  },
  resourceGroupIDs: [],
  nodeIDs: [],
};

jest.mock('@luigi-project/client', () => ({
  addInitListener: jest.fn(),
}));
jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('axios');
jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
  useIdFromQuery: jest.fn(),
  useMSW: jest.fn(),
  useLoading: jest.fn(),
}));
jest.mock('@/shared-modules/components/GraphView');
jest.mock('@/shared-modules/components/PageHeader');

const dummyGraphData: APIPromQL = {
  status: 'dummy',
  data: {
    resultType: 'dummy',
    result: [
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'energy',
        },
        values: [
          [1698207000, '10'],
          [1698207300, '20'],
          [1698207600, '30'],
          [1698207900, '40'],
        ],
      },
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'usage',
        },
        values: [
          [1698207000, '10'],
          [1698207300, '20'],
          [1698207600, '30'],
          [1698207900, '40'],
        ],
      },
    ],
  },
  stats: {
    seriesFetched: '',
  },
};

describe('Resource detail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string | undefined) => ({
      data: key && (key.includes('resources') ? resData : dummyGraphData),
      error: null,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useIdFromQuery.mockReturnValue(resData.device.deviceID);
    // @ts-ignore
    useLoading.mockReturnValue(false);
    // @ts-ignore
    usePermission.mockReturnValue(true);
    // @ts-ignore
    useTranslations.mockImplementation(() => {
      return (str: string) => str;
    });
  });

  test('The title is displayed', () => {
    render(<ResourceDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0];
    expect(givenProps.pageTitle).toBe('Resource Details');
    expect(givenProps.mutate()).toBeUndefined();
  });

  test('The device ID in the breadcrumb list is displayed correctly', () => {
    // query → Used in the breadcrumb for API requests
    (useIdFromQuery as jest.Mock).mockReturnValue('xxxxxxxxxxid');
    render(<ResourceDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0];
    expect(givenProps.items[2].title).toBe(`Resource Details <xxxxxxxxxxid>`);
  });
  test('The device ID inside the card is displayed correctly', () => {
    // Returned ID from the API → Used in the device ID card in the content area
    render(<ResourceDetail />);
    const deviceId = screen.getByText('Device ID').nextSibling;
    expect(deviceId).toHaveTextContent(resData.device.deviceID);
  });
  test('The type is displayed', () => {
    render(<ResourceDetail />);
    const type = screen.getByText('Type').nextSibling;
    expect(type).toHaveTextContent(resData.device.type);
  });

  test('The type is displayed (in the case of memory)', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData3 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const type = screen.getByText('Type').nextSibling;
    expect(type).toHaveTextContent(/memory/i); // resData3.device.type: match memory
  });

  test('The type is displayed (in the case of Storage)', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData4 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const type = screen.getByText('Type').nextSibling;
    expect(type).toHaveTextContent(/Storage/i); // resData4.device.type: match Storage
  });

  test('The resource status is displayed', () => {
    render(<ResourceDetail />);
    const state = screen.getByText('State').nextSibling;
    expect(state).toHaveTextContent(resData.device.status.state);
  });
  test('The health status is displayed', () => {
    render(<ResourceDetail />);
    const health = screen.getByText('Health').nextSibling;
    expect(health).toHaveTextContent(resData.device.status.health);
  });
  test('The CXL switch is displayed', () => {
    render(<ResourceDetail />);
    const deviceSwitchInfo = screen.getByText('CXL Switch').nextSibling;
    expect(deviceSwitchInfo).toHaveTextContent(resData.device.deviceSwitchInfo as string);
  });
  test('It is displayed that it is designated as a design target (target)', () => {
    render(<ResourceDetail />);
    const available = screen.getByText('Included in design').nextSibling;
    expect(available).not.toBeNull();
    expect(within(available as HTMLElement).getByText(/^Included$/)).toBeInTheDocument();
    // Checking the exclude target button
    const button = screen.getByRole('button', { name: 'Exclude' });
    expect(button).toBeInTheDocument();
  });
  test('It is displayed that it is designated as a design target (exclude)', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData3 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const available = screen.getByText('Included in design').nextSibling;
    expect(available).not.toBeNull();
    expect(within(available as HTMLElement).getByText(/Excluded/)).toBeInTheDocument();
    // Checking the design target button
    const button = screen.getByRole('button', { name: 'Include' });
    expect(button).toBeInTheDocument();
  });

  test.each([resData, resData3])(
    'When the API to toggle the designation as a design target succeeds, a success message is displayed',
    async (res) => {
      // @ts-ignore
      useTranslations.mockImplementation(() => jest.requireActual('next-intl').useTranslations());
      // @ts-ignore
      useSWRImmutable.mockImplementation((key: string) => ({
        data: key.includes('resources') ? res : dummyGraphData,
        error: null,
        mutate: jest.fn(),
      }));
      const action = res.annotation.available ? 'Exclude' : 'Include';
      //@ts-ignore
      axios.put.mockResolvedValue({
        data: { available: !res.annotation.available },
      });

      render(
        <NextIntlClientProvider locale='en' messages={{ ...commonMessages, ...mfResourceMessages }}>
          <ResourceDetail />
        </NextIntlClientProvider>
      );

      // Pressing the exclude from design button
      const button = screen.getByRole('button', { name: action });
      expect(button).toBeInTheDocument();
      act(() => {
        button.click();
      });
      // Pressing the OK button on the confirmation dialog
      const okButton = await screen.findByRole('button', { name: 'Yes' });
      await act(async () => {
        await okButton.click();
      });

      // axios.put is called
      expect(axios.put).toHaveBeenCalled();

      // A success message is displayed
      const successAlert = screen.getByRole('alert');
      expect(
        within(successAlert).getByText(
          `The resource settings have been successfully updated to ${res.annotation.available ? 'exclude' : 'include'}`
        )
      ).toBeInTheDocument();
      // Pressing the close button
      const closeButton = within(successAlert).getByRole('button', { name: '' });
      act(() => {
        closeButton.click();
      });
      // The success message is hidden
      expect(screen.queryByRole('alert')).toBeNull();
    }
  );

  test('When the API to toggle the designation as a design target fails, a failure message is displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    //@ts-ignore
    axios.put.mockRejectedValue({ message: 'API failure message' });

    render(<ResourceDetail />);

    // Pressing the exclude from design button
    const button = screen.getByRole('button', { name: 'Exclude' });
    expect(button).toBeInTheDocument();
    act(() => {
      button.click();
    });

    // Pressing the OK button on the confirmation dialog
    const okButton = await screen.findByRole('button', { name: 'Yes' });
    await act(async () => {
      await okButton.click();
    });

    // axios.put is called
    expect(axios.put).toHaveBeenCalled();

    // A failure message is displayed
    const successAlert = screen.getByRole('alert');
    expect(within(successAlert).getByText('API failure message')).toBeInTheDocument();
  });

  test('The node is displayed: In the case of one', () => {
    /** Expect that resData.nodeIDs : ['NodeID001'] is displayed */
    render(<ResourceDetail />);
    const nodeId = screen.getByText('Node').nextSibling;
    expect(nodeId).toHaveTextContent(resData.nodeIDs[0]);
  });
  test('The nodes are displayed: In the case of multiple', () => {
    /** Expect that resData2.nodeIDs : ['NodeID001', 'NodeID002'] are displayed */
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData2 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const nodeId = screen.getByText('Node').nextSibling;
    expect(nodeId).toHaveTextContent(resData2.nodeIDs[0]);
    expect(nodeId).toHaveTextContent(resData2.nodeIDs[1]);
  });
  test('The nodes are not displayed: In the case of none (0)', () => {
    /** Since resData3.nodeIDs : [] there is no display */
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData3 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const nodeId = screen.getByText('Node').nextSibling;
    expect(nodeId).not.toHaveTextContent(/.+/);
  });

  test('The loading is displayed', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key) => ({
      data: key.includes('resources') ? resData : dummyGraphData,
      isValidating: true,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useLoading.mockReturnValue(true);
    render(<ResourceDetail />);
    const LoadingOverlayElements = document.querySelector('.mantine-LoadingOverlay-root');
    expect(LoadingOverlayElements).toBeInTheDocument();
  });
  test('The loading is not displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const LoadingOverlayElements = screen.queryByRole('presentation');
    await waitFor(() => {
      expect(LoadingOverlayElements).not.toBeInTheDocument();
    });
  });
  test('If there is no error, the message is not displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const alertDialog = screen.queryByRole('alert');
    expect(alertDialog).not.toBeInTheDocument();
  });
  test('While the query parameter is empty, the id is set to an empty string', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn(),
    }));
    (useIdFromQuery as jest.Mock).mockReturnValue('');
    render(<ResourceDetail />);
    screen.getByText('Device ID');
    const deviceId = screen.getByText('Device ID').nextSibling;
    expect(deviceId).toHaveTextContent('');
  });

  test('The graph can be rendered in the case of networkInterface', () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData2 : dummyGraphData,
      error: null,
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);

    // @ts-ignore
    const givenProps = GraphView.mock.lastCall[0];
    expect(givenProps.title).toBe('Network Transfer Speed');
  });
  test('When it is networkInterface, the binary prefix is correctly applied for values greater than 1024.', () => {
    const dummyGraphData2: APIPromQL = {
      status: 'dummy',
      data: {
        resultType: 'dummy',
        result: [
          {
            metric: {
              __name__: '',
              instance: '',
              job: '',
              data_label: 'networkInterface_usage',
            },
            values: [
              [1701820800, '10000'], // Greater than 1024
              [1701824400, '20000'],
              [1701828000, '30000'],
              [1701831600, '40000'],
            ],
          },
        ],
      },
      stats: {
        seriesFetched: '',
      },
    };
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData2 : dummyGraphData2,
      error: null,
      mutate: jest.fn(),
    }));
    const mockGraphView = jest.fn().mockReturnValue(null);
    // @ts-ignore
    GraphView.mockImplementation(mockGraphView);
    render(<ResourceDetail />);
    // Check the unit of network transfer speed
    expect(mockGraphView.mock.calls[1][0].valueFormatter(0)).toBe('0 bit/s');
  });
  test('When it is not networkInterface, the percentage prefix is correctly applied.', () => {
    const dummyGraphData2: APIPromQL = {
      status: 'dummy',
      data: {
        resultType: 'dummy',
        result: [
          {
            metric: {
              __name__: '',
              instance: '',
              job: '',
              data_label: 'CPU_usage',
            },
            values: [
              [1701820800, '10000'], // Greater than 1024
              [1701824400, '20000'],
              [1701828000, '30000'],
              [1701831600, '40000'],
            ],
          },
        ],
      },
      stats: {
        seriesFetched: '',
      },
    };
    // @ts-ignore
    useSWR.mockImplementation((key: string) => ({
      data: key.includes('resources') ? resData : dummyGraphData2,
      error: null,
      mutate: jest.fn(),
    }));
    const mockGraphView = jest.fn().mockReturnValue(null);
    // @ts-ignore
    GraphView.mockImplementation(mockGraphView);
    render(<ResourceDetail />);
    // Check the unit of network transfer speed
    expect(mockGraphView.mock.calls[1][0].valueFormatter(0)).toBe('0.00 %');
  });
});

describe('Resource Detail: On Error', () => {
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
    useIdFromQuery.mockReturnValue('res101');
  });

  test('When the server returns an error, a message is displayed', async () => {
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
    render(<ResourceDetail />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('Error occurred');
    expect(message).toHaveTextContent('Error Message');
  });
  test('When unable to connect to the server, a message is displayed', async () => {
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      error: {
        message: 'Error occurred',
        response: null,
      },
      mutate: jest.fn(),
    }));
    render(<ResourceDetail />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('Error occurred');
    expect(message).toBeNull();
  });
});
