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
import { screen } from '@testing-library/react';
import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { GraphView, PageHeader } from '@/shared-modules/components';
import { APIPromQL } from '@/shared-modules/types';
import { useIdFromQuery } from '@/shared-modules/utils/hooks';
import { fetcherForPromqlByPost } from '@/shared-modules/utils';

import { ResourceListTable } from '@/components';
import NodeDetail from '@/app/[lng]/node-detail/page';
import { dummyNodeDetail } from '@/utils/dummy-data/node-detail/nodes';

const resData = {
  exampleNode1: 'node10101',
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
      },
      resourceGroupIDs: [],
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
      },
      resourceGroupIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res10603',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'virtualMedia',
      },
      resourceGroupIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res10604',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'storage',
      },
      resourceGroupIDs: [],
    },
  ],
};

const resData2 = {
  exampleNode1: 'node10101',
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
      },
      resourceGroupIDs: [],
    },
    {
      annotation: {
        available: false,
      },
      device: {
        deviceID: 'res10202',
        status: {
          health: 'Critical',
          state: 'Enabled',
        },
        type: 'memory',
      },
      resourceGroupIDs: [],
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
      },
      resourceGroupIDs: [],
    },
  ],
};

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
          data_label: 'CPU_energy',
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
          data_label: 'CPU_usage',
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

jest.mock('@/shared-modules/utils/fetcherForPromql', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/fetcherForPromql'),
  fetcherForPromqlByPost: jest.fn(),
}));

describe('Node Detail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (useSWRImmutable as jest.Mock).mockImplementation((key: any) => {
      let data = null;
      if (typeof key === 'string') {
        data = resData;
      }

      return {
        data: data || dummyGraphData,
        error: null,
        mutate: jest.fn(),
        isValidating: false,
      };
    });
    (useIdFromQuery as jest.Mock).mockReturnValue('res10101');
  });

  test('The title is displayed', () => {
    render(<NodeDetail />);

    const givenProps = (PageHeader as jest.Mock).mock.lastCall[0];
    expect(givenProps.pageTitle).toBe('Node Details');
    expect(givenProps.mutate()).toBeUndefined();
  });
  test('The NodeID is displayed', () => {
    render(<NodeDetail />);
    const nodeId = screen.getByText('Node ID').nextSibling;
    expect(nodeId).toHaveTextContent(resData.id);
  });
  test('All the number of resources are displayed', () => {
    render(<NodeDetail />);
    const deviceCount = screen.getByText('Total').nextSibling;
    expect(deviceCount).toHaveTextContent(resData.resources.length.toString());
  });
  test('It is displayed that the number of resources is invalid', () => {
    render(<NodeDetail />);
    const disabledCount = screen.getByText('Disabled').nextSibling;
    expect(disabledCount).toHaveTextContent(
      resData.resources.filter((item) => item.device.status.state === 'Disabled').length.toString()
    );
  });
  test('It is displayed that there is a warning about the number of resources', () => {
    render(<NodeDetail />);
    const warningCount = screen.getByText('Warning').nextSibling;
    expect(warningCount).toHaveTextContent(
      resData.resources.filter((item) => item.device.status.health === 'Warning').length.toString()
    );
  });
  test('It is displayed that there is an anomaly in the number of resources', () => {
    render(<NodeDetail />);
    const criticalCount = screen.getByText('Critical').nextSibling;
    expect(criticalCount).toHaveTextContent(
      resData.resources.filter((item) => item.device.status.health === 'Critical').length.toString()
    );
  });
  test('It is displayed that it is out of the scope of resource number design', () => {
    render(<NodeDetail />);
    const resourceUnavailableCount = screen.getByText('Excluded from design').nextSibling;
    expect(resourceUnavailableCount).toHaveTextContent(
      resData.resources.filter((item) => item.annotation.available === false).length.toString()
    );
  });

  test('Valueformatter are applied correctly.', () => {
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
              [1701820800, '10000'], // 1024 or more
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

    (useSWRImmutable as jest.Mock).mockImplementation((key) => {
      let data = null;
      if (typeof key === 'string') {
        data = resData;
      }
      return {
        data: data || dummyGraphData2,
        error: null,
        mutate: jest.fn(),
      };
    });
    const mockGraphView = jest.fn().mockReturnValue(null);

    (GraphView as jest.Mock).mockImplementation(mockGraphView);
    render(<NodeDetail />);
    // Energy Comsumption
    expect(mockGraphView.mock.calls[0][0].valueFormatter(0)).toBe('0 Wh');
    // Processor Usage
    expect(mockGraphView.mock.calls[1][0].valueFormatter(0)).toBe('0.00 %');
    // Memory Usage
    expect(mockGraphView.mock.calls[2][0].valueFormatter(0)).toBe('0.00 %');
    // Storage Usage
    expect(mockGraphView.mock.calls[3][0].valueFormatter(0)).toBe('0.00 %');
    // Network transfer speed unit check
    expect(mockGraphView.mock.calls[4][0].valueFormatter(0)).toBe('0 bit/s');
  });

  test('The loading is displayed', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      isValidating: true,
      mutate: jest.fn(),
    }));
    render(<NodeDetail />);

    const props = (ResourceListTable as jest.Mock).mock.lastCall[0];
    expect(props.loading).toBeTruthy();
  });
  test('The loading is not displayed', async () => {
    jest.useFakeTimers();
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<NodeDetail />);

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
    render(<NodeDetail />);
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
    render(<NodeDetail />);
    const nodeId = screen.getByText('Node ID').nextSibling;
    expect(nodeId).toHaveTextContent('');
  });

  test('When the query is empty, the id is set to an empty string', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn(),
    }));

    (useIdFromQuery as jest.Mock).mockReturnValue('');
    render(<NodeDetail />);
    const layoutID = screen.getByText('Node ID').nextSibling;
    expect(layoutID).toHaveTextContent('');
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
    render(<NodeDetail />);
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
    render(<NodeDetail />);
    const alertDialog = screen.queryAllByRole('alert')[0];
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('Error occurred');
    expect(message).toBeNull();
  });

  test('Check fetcherForPromqlByPost', () => {
    (fetcherForPromqlByPost as jest.Mock).mockResolvedValue(dummyNodeDetail);

    render(<NodeDetail />);
    const args = (useSWRImmutable as jest.Mock).mock.calls;
    const fetcher = args[1][1];
    const data = fetcher(args[1][0][0], args[1][0][1]);
    expect(data).resolves.toEqual(dummyNodeDetail);
  });
});

describe('Node detail color check', () => {
  beforeEach(() => {
    // Executed before each test
    jest.clearAllMocks();

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      let data = null;
      if (typeof key === 'string') {
        data = resData2;
      }
      return {
        data: data || dummyGraphData,
        error: null,
        mutate: jest.fn(),
      };
    });

    (useIdFromQuery as jest.Mock).mockReturnValue('res10101');
  });

  test('The color of the number of resources is displayed correctly', () => {
    render(<NodeDetail />);
    const colorMap = {
      disabled: 'red',
      warning: 'yellow',
      critical: 'red',
      excluded: 'gray',
    };
    // Retrieve cards with a background color individually and check the class
    const disabledCard = screen.getByText('Disabled').closest('div');
    expect(disabledCard).toHaveClass(colorMap['disabled']);
    const warningCard = screen.getByText('Warning').closest('div');
    expect(warningCard).toHaveClass(colorMap['warning']);
    const criticalCard = screen.getByText('Critical').closest('div');
    expect(criticalCard).toHaveClass(colorMap['critical']);
    const excludedCard = screen.getByText('Excluded from design').closest('div');
    expect(excludedCard).toHaveClass(colorMap['excluded']);
  });
});

describe('Node Detail Resource Specifications', () => {
  beforeEach(() => {
    // Executed before each test
    jest.clearAllMocks();

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      let data = null;
      if (typeof key === 'string') {
        data = dummyNodeDetail;
      }
      return {
        data: data || dummyGraphData,
        error: null,
        mutate: jest.fn(),
      };
    });

    (useIdFromQuery as jest.Mock).mockReturnValue('res10101');
  });

  test('The volume is displayed', () => {
    render(<NodeDetail />);
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('36.00')).toBeInTheDocument();
    expect(screen.getByText('TiB')).toBeInTheDocument();
  });
});
