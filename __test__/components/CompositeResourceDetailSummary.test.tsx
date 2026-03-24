/*
 * Copyright 2026 NEC Corporation.
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

import { render as rtlRender, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { CompositeResourceDetailSummary } from '@/components/CompositeResourceDetailSummary';
import { APIDeviceUnit } from '@/shared-modules/types';
import { AvailableToIcon } from '@/components/AvailableToIcon';

// Custom render function
function render(ui: React.ReactElement) {
  return rtlRender(<MantineProvider>{ui}</MantineProvider>);
}

// Mock dependencies
jest.mock('@/components/AvailableToIcon', () => ({
  AvailableToIcon: jest.fn(() => <div data-testid='available-icon'>Available Icon</div>),
}));

jest.mock('@/components/AvailableButton', () => ({
  AvailableButton: jest.fn(() => <div data-testid='available-button'>Mock AvailableButton</div>),
}));

jest.mock('@/utils/parse', () => ({
  parsePlacement: jest.fn((placement) => {
    if (!placement) return '';
    return `${placement.rack.name} / ${placement.rack.chassis.name}`;
  }),
  parseDevicePortList: jest.fn((devicePortList) => {
    if (!devicePortList || !Array.isArray(devicePortList)) return [];
    return devicePortList
      .map((port) => {
        if (port.switchID && port.fabricID) {
          return `${port.fabricID}-${port.switchID}`;
        }
        return port.switchID;
      })
      .filter((id) => id !== undefined);
  }),
}));

jest.mock('@/shared-modules/components', () => {
  return {
    HorizontalTable: (props: { tableData?: any[]; loading: boolean }) => {
      const rows =
        props.tableData && Array.isArray(props.tableData)
          ? props.tableData.map((item: any, i: number) => (
              <div key={i} data-column={item.columnName} data-testid='table-row'>
                {item.columnName}: {typeof item.value === 'object' ? item.value : String(item.value || '')}
              </div>
            ))
          : [];

      return (
        <div data-testid='horizontal-table' data-loading={String(props.loading)}>
          {rows}
        </div>
      );
    },
    PageLink: (props: { children: React.ReactNode; path: string; query: { rackId?: string; chassisId?: string } }) => (
      <a href={`${props.path}?rackId=${props.query.rackId}&chassisId=${props.query.chassisId}`} data-testid='page-link'>
        {props.children}
      </a>
    ),
  };
});

describe('CompositeResourceDetailSummary Component', () => {
  const mockDeviceUnitData: APIDeviceUnit = {
    id: 'unit-123',
    annotation: {
      systemItems: {
        available: true,
      },
      userItems: {},
    },
    resources: [
      {
        device: {
          deviceID: 'device-1',
          type: 'CPU',
          status: {
            health: 'OK',
            state: 'Enabled',
          },
          devicePortList: [{ fabricID: 'fabric-1', switchID: 'Switch-1' }],
          powerState: 'On',
          powerCapability: true,
          constraints: {
            nonRemovableDevices: [],
          },
        },
        resourceGroupIDs: [],
        nodeIDs: [],
        annotation: {
          available: true,
        },
        detected: true,
        physicalLocation: {
          rack: {
            id: 'rack-1',
            name: 'Rack 1',
            chassis: {
              id: 'chassis-1',
              name: 'Chassis 1',
            },
          },
        },
      },
    ],
  };

  const mockDoOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AvailableToIcon as jest.Mock).mockReturnValue(<div data-testid='available-icon'>Available Icon</div>);
  });

  test('renders loading state correctly', () => {
    render(<CompositeResourceDetailSummary loading={true} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toHaveAttribute('data-loading', 'true');
  });

  test('renders device unit data correctly with available status', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();

    expect(AvailableToIcon).toHaveBeenCalledWith({ resourceAvailable: 'Available' }, undefined);
    expect(screen.getByTestId('available-button')).toBeInTheDocument();
  });

  test('renders device unit data correctly with unavailable status', () => {
    const unavailableData: APIDeviceUnit = {
      ...mockDeviceUnitData,
      annotation: {
        systemItems: {
          available: false,
        },
        userItems: {},
      },
    };

    render(<CompositeResourceDetailSummary data={unavailableData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(AvailableToIcon).toHaveBeenCalledWith({ resourceAvailable: 'Unavailable' }, undefined);
    expect(screen.getByText('Under Maintenance')).toBeInTheDocument();
  });

  test('renders placement link when physicalLocation exists', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const pageLink = screen.getByTestId('page-link');
    expect(pageLink).toBeInTheDocument();
    expect(pageLink).toHaveAttribute('href', '/cdim/res-rack?rackId=rack-1&chassisId=chassis-1');
    expect(pageLink).toHaveTextContent('Rack 1 / Chassis 1');
  });

  test('handles undefined data gracefully', () => {
    render(<CompositeResourceDetailSummary loading={false} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
  });

  test('handles data without physicalLocation', () => {
    const dataWithoutPlacement: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [
        {
          ...mockDeviceUnitData.resources[0],
          physicalLocation: undefined,
        },
      ],
    };

    render(
      <CompositeResourceDetailSummary data={dataWithoutPlacement} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    const pageLink = screen.queryByTestId('page-link');
    expect(pageLink).not.toBeInTheDocument();
  });

  test('handles data with empty physicalLocation object', () => {
    const dataWithEmptyPlacement: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [
        {
          ...mockDeviceUnitData.resources[0],
          physicalLocation: {},
        },
      ],
    };

    render(
      <CompositeResourceDetailSummary data={dataWithEmptyPlacement} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    const pageLink = screen.queryByTestId('page-link');
    expect(pageLink).not.toBeInTheDocument();
  });

  test('handles data without devicePortList', () => {
    const dataWithoutSwitch: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [
        {
          ...mockDeviceUnitData.resources[0],
          device: {
            ...mockDeviceUnitData.resources[0].device,
            devicePortList: undefined,
          },
        },
      ],
    };

    render(<CompositeResourceDetailSummary data={dataWithoutSwitch} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
  });

  test('handles data with empty resources array', () => {
    const dataWithEmptyResources: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [],
    };

    render(
      <CompositeResourceDetailSummary data={dataWithEmptyResources} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
    expect(screen.queryByTestId('page-link')).not.toBeInTheDocument();
  });

  test('handles data with undefined resources', () => {
    const dataWithUndefinedResources: APIDeviceUnit = {
      id: 'unit-123',
      annotation: {
        systemItems: {
          available: true,
        },
        userItems: {},
      },
      resources: undefined as any,
    };

    render(
      <CompositeResourceDetailSummary data={dataWithUndefinedResources} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
  });

  test('renders CXL Switch information correctly', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const tableRows = screen.getAllByTestId('table-row');
    const cxlSwitchRow = tableRows.find((row) => row.getAttribute('data-column') === 'CXL Switch');

    expect(cxlSwitchRow).toBeInTheDocument();
    expect(cxlSwitchRow).toHaveTextContent('fabric-1-Switch-1');
  });

  test('does not render Under Maintenance text when available is true', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.queryByText('Under Maintenance')).not.toBeInTheDocument();
    expect(AvailableToIcon).toHaveBeenCalledWith({ resourceAvailable: 'Available' }, undefined);
  });

  test('renders all table rows with correct columns', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const tableRows = screen.getAllByTestId('table-row');
    expect(tableRows).toHaveLength(3);

    const columns = tableRows.map((row) => row.getAttribute('data-column'));
    expect(columns).toContain('Placement');
    expect(columns).toContain('CXL Switch');
    expect(columns).toContain('Maintenance');
  });

  test('handles undefined unitID gracefully', () => {
    const dataWithoutId: APIDeviceUnit = {
      ...mockDeviceUnitData,
      id: undefined as any,
    };

    render(<CompositeResourceDetailSummary data={dataWithoutId} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
  });

  test('passes correct props to AvailableButton', () => {
    render(<CompositeResourceDetailSummary data={mockDeviceUnitData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.getByTestId('available-button')).toBeInTheDocument();
  });

  test('handles null placement gracefully', () => {
    const dataWithNullPlacement: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [
        {
          ...mockDeviceUnitData.resources[0],
          physicalLocation: null as any,
        },
      ],
    };

    render(
      <CompositeResourceDetailSummary data={dataWithNullPlacement} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    expect(screen.queryByTestId('page-link')).not.toBeInTheDocument();
  });

  test('renders with available false and displays maintenance icon', () => {
    const unavailableData: APIDeviceUnit = {
      ...mockDeviceUnitData,
      annotation: {
        systemItems: {
          available: false,
        },
        userItems: {},
      },
    };

    render(<CompositeResourceDetailSummary data={unavailableData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.getByTestId('available-icon')).toBeInTheDocument();
    expect(AvailableToIcon).toHaveBeenCalledWith({ resourceAvailable: 'Unavailable' }, undefined);
  });

  test('handles data with null devicePortList', () => {
    const dataWithNullSwitch: APIDeviceUnit = {
      ...mockDeviceUnitData,
      resources: [
        {
          ...mockDeviceUnitData.resources[0],
          device: {
            ...mockDeviceUnitData.resources[0].device,
            devicePortList: null as any,
          },
        },
      ],
    };

    render(<CompositeResourceDetailSummary data={dataWithNullSwitch} loading={false} doOnSuccess={mockDoOnSuccess} />);

    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();
  });

  test('renders with empty unitID string', () => {
    const dataWithEmptyId: APIDeviceUnit = {
      ...mockDeviceUnitData,
      id: '',
    };

    render(<CompositeResourceDetailSummary data={dataWithEmptyId} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.getByTestId('horizontal-table')).toBeInTheDocument();
  });
});
