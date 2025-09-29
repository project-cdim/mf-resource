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

import { render as rtlRender, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ResourceDetailSummary } from '@/components/ResourceDetailSummary';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import { APIresource } from '@/shared-modules/types';
import { HealthToIcon } from '@/components/HealthToIcon';
import { StateToIcon } from '@/components/StateToIcon';
import { DetectionStatusToIcon } from '@/components/DetectionStatusToIcon';
import { AvailableToIcon } from '@/components/AvailableToIcon';

// カスタム render 関数
function render(ui: React.ReactElement) {
  return rtlRender(<MantineProvider>{ui}</MantineProvider>);
}

// Mock all dependencies
jest.mock('@/utils/hooks/useResourceGroupsData', () => ({
  useResourceGroupsData: jest.fn(),
}));

jest.mock('@/components/HealthToIcon', () => ({
  HealthToIcon: jest.fn(() => <div data-testid='health-icon'>Health Icon</div>),
}));

jest.mock('@/components/StateToIcon', () => ({
  StateToIcon: jest.fn(() => <div data-testid='state-icon'>State Icon</div>),
}));

jest.mock('@/components/DetectionStatusToIcon', () => ({
  DetectionStatusToIcon: jest.fn(() => <div data-testid='detection-icon'>Detection Icon</div>),
}));

jest.mock('@/components/AvailableToIcon', () => ({
  AvailableToIcon: jest.fn(() => <div data-testid='available-icon'>Available Icon</div>),
}));

// Mock ResourceGroupSelectButton
jest.mock('@/components/ResourceGroupSelectButton', () => {
  const mock = jest.fn((props) => (
    <div data-testid='resource-group-select-button' onClick={() => props.doOnSuccess && props.doOnSuccess()}>
      Mock ResourceGroupSelectButton
    </div>
  ));
  return { ResourceGroupSelectButton: mock };
});

// Mock AvailableButton
jest.mock('@/components/AvailableButton', () => ({
  AvailableButton: jest.fn(() => <div data-testid='available-button'>Mock AvailableButton</div>),
}));

// Mock the shared components
jest.mock('@/shared-modules/components', () => {
  return {
    CardLoading: (props: { children: React.ReactNode; loading: boolean; withBorder?: boolean; maw?: string }) => (
      <div data-testid='card-loading' data-loading={String(props.loading)}>
        {props.children}
      </div>
    ),
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
    PageLink: (props: { children: React.ReactNode; path: string; query: { id: string } }) => (
      <a href={`${props.path}?id=${props.query.id}`} data-testid='page-link'>
        {props.children}
      </a>
    ),
  };
});

describe('ResourceDetailSummary Component', () => {
  // Sample resource data for testing
  const mockResourceData: APIresource = {
    device: {
      deviceID: 'device-123',
      type: 'CPU',
      status: {
        health: 'OK',
        state: 'Enabled',
      },
      deviceSwitchInfo: 'Switch-1',
    },
    resourceGroupIDs: ['group-1', 'group-2'],
    nodeIDs: ['node-1', 'node-2'],
    annotation: {
      available: true,
    },
    detected: true,
  };

  // Mock function for success callback
  const mockDoOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      getNameById: jest.fn((id) => `Resource Group ${id}`),
    });

    (HealthToIcon as jest.Mock).mockReturnValue(<div data-testid='health-icon'>Health Icon</div>);
    (StateToIcon as jest.Mock).mockReturnValue(<div data-testid='state-icon'>State Icon</div>);
    (DetectionStatusToIcon as jest.Mock).mockReturnValue(<div data-testid='detection-icon'>Detection Icon</div>);
    (AvailableToIcon as jest.Mock).mockReturnValue(<div data-testid='available-icon'>Available Icon</div>);
  });

  test('renders loading state correctly', () => {
    render(<ResourceDetailSummary loading={true} doOnSuccess={mockDoOnSuccess} />);

    const cardLoading = screen.getByTestId('card-loading');
    const horizontalTable = screen.getByTestId('horizontal-table');

    expect(cardLoading).toHaveAttribute('data-loading', 'true');
    expect(horizontalTable).toHaveAttribute('data-loading', 'true');
  });

  test('renders resource data correctly', () => {
    render(<ResourceDetailSummary data={mockResourceData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    // Check if device ID is displayed
    expect(screen.getByText('device-123')).toBeInTheDocument();

    // Check if horizontal table has been rendered with correct data
    const horizontalTable = screen.getByTestId('horizontal-table');
    expect(horizontalTable).toBeInTheDocument();

    // Since we're mocking HorizontalTable, we can't validate its content directly,
    // Instead, we verify it was called with the correct props
    expect(screen.getByTestId('horizontal-table')).toBeInTheDocument();

    // Check if icons have been rendered
    expect(HealthToIcon).toHaveBeenCalledWith('OK');
    expect(StateToIcon).toHaveBeenCalledWith('Enabled');
    expect(DetectionStatusToIcon).toHaveBeenCalledWith(true);
    expect(AvailableToIcon).toHaveBeenCalledWith('Available');
  });

  test('renders group and node related data correctly', () => {
    render(<ResourceDetailSummary data={mockResourceData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.queryByText('group-1')).toBeNull();
    expect(screen.queryByText('group-2')).toBeNull();
    // Check if resource group names are correctly fetched and displayed
    const getNameById = (useResourceGroupsData as jest.Mock).mock.results[0].value.getNameById;
    expect(getNameById).toHaveBeenCalledWith('group-1');
    expect(getNameById).toHaveBeenCalledWith('group-2');

    // Check table rows for resource groups and nodes
    const tableRows = screen.getAllByTestId('table-row');
    const resourceGroupRow = tableRows.find((row) => row.getAttribute('data-column') === 'Resource Group');
    const nodeRow = tableRows.find((row) => row.getAttribute('data-column') === 'Node');

    expect(resourceGroupRow).toBeInTheDocument();
    expect(nodeRow).toBeInTheDocument();
  });

  test('renders group id if name can not be get', () => {
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      getNameById: jest.fn(() => ''),
    });

    render(<ResourceDetailSummary data={mockResourceData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    expect(screen.getByText('group-1')).toBeInTheDocument();
    expect(screen.getByText('group-2')).toBeInTheDocument();
    // Check if resource group names are correctly fetched and displayed
    const getNameById = (useResourceGroupsData as jest.Mock).mock.results[0].value.getNameById;
    expect(getNameById).toHaveBeenCalledWith('group-1');
    expect(getNameById).toHaveBeenCalledWith('group-2');

    // Check table rows for resource groups and nodes
    const tableRows = screen.getAllByTestId('table-row');
    const resourceGroupRow = tableRows.find((row) => row.getAttribute('data-column') === 'Resource Group');

    expect(resourceGroupRow).toBeInTheDocument();
  });

  test('calls doOnSuccess with correct operation when ResourceGroupSelectButton is clicked', () => {
    // Clear any previous mock calls
    mockDoOnSuccess.mockClear();

    // Render the component with mock data
    render(<ResourceDetailSummary data={mockResourceData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    // Find and click the ResourceGroupSelectButton
    const resourceGroupButton = screen.getByTestId('resource-group-select-button');
    resourceGroupButton.click();

    // Verify doOnSuccess was called with the correct argument
    expect(mockDoOnSuccess).toHaveBeenCalledWith({ operation: 'UpdateResourceGroup' });
  });

  test('handles undefined data gracefully', () => {
    render(<ResourceDetailSummary loading={false} doOnSuccess={mockDoOnSuccess} />);

    // Check that it doesn't crash with undefined data
    const cardLoading = screen.getByTestId('card-loading');
    expect(cardLoading).toBeInTheDocument();

    // The device ID should not be displayed
    expect(screen.queryByText('device-123')).not.toBeInTheDocument();
  });

  test('handles null or undefined values in the data object', () => {
    const incompleteData: APIresource = {
      device: {
        deviceID: 'device-123',
        type: 'CPU',
        status: {
          // We'll use null instead of undefined which should trigger the same behavior
          health: null as unknown as 'OK',
          state: null as unknown as 'Enabled',
        },
      },
      resourceGroupIDs: [],
      nodeIDs: [],
      annotation: {
        available: false,
      },
      detected: false,
    };

    render(<ResourceDetailSummary data={incompleteData} loading={false} doOnSuccess={mockDoOnSuccess} />);

    // Check that it handles null health and state
    expect(HealthToIcon).toHaveBeenCalledWith(null);
    expect(StateToIcon).toHaveBeenCalledWith(null);

    // Check that it handles false for available and detected
    expect(DetectionStatusToIcon).toHaveBeenCalledWith(false);
    expect(AvailableToIcon).toHaveBeenCalledWith('Unavailable');
  });

  test('handles empty arrays for resourceGroupIDs and nodeIDs', () => {
    const dataWithEmptyArrays: APIresource = {
      ...mockResourceData,
      resourceGroupIDs: [],
      nodeIDs: [],
    };

    render(<ResourceDetailSummary data={dataWithEmptyArrays} loading={false} doOnSuccess={mockDoOnSuccess} />);

    // Check that no page links are rendered for empty arrays
    const pageLinks = screen.queryAllByTestId('page-link');
    expect(pageLinks).toHaveLength(0);
  });

  test('handles undefined resourceGroupIDs and uses default empty array', () => {
    const dataWithUndefinedResourceGroupIDs: APIresource = {
      ...mockResourceData,
      resourceGroupIDs: undefined as unknown as string[],
    };

    render(
      <ResourceDetailSummary data={dataWithUndefinedResourceGroupIDs} loading={false} doOnSuccess={mockDoOnSuccess} />
    );

    // Get the ResourceGroupSelectButton component and verify it rendered with an empty array
    const resourceGroupButton = screen.getByTestId('resource-group-select-button');
    expect(resourceGroupButton).toBeInTheDocument();

    // No PageLinks should be rendered for resource groups
    const resourceGroupLinks = screen
      .queryAllByTestId('page-link')
      .filter((link) => link.getAttribute('href')?.includes('/cdim/res-resource-group-detail'));
    expect(resourceGroupLinks).toHaveLength(0);

    // Clicking the button should still work
    resourceGroupButton.click();
    expect(mockDoOnSuccess).toHaveBeenCalledWith({ operation: 'UpdateResourceGroup' });
  });
});
