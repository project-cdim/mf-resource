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

import React from 'react';
import { screen, act } from '@testing-library/react';
import useSWRImmutable from 'swr/immutable';
import { AxiosResponse } from 'axios';

import { render } from '@/shared-modules/__test__/test-utils';
import { APIDeviceUnit } from '@/shared-modules/types';
import { MessageBox, PageHeader } from '@/shared-modules/components';
import { useIdFromQuery, useLoading } from '@/shared-modules/utils/hooks';

import CompositeResourceDetail from '@/app/[lng]/composite-resource-detail/page';
import { CompositeResourceDetailSummary, ResourceListTable, useFormatResourceListTableData } from '@/components';
import {
  dummyAPIDeviceUnit,
  dummyAPIDeviceUnitMaintenance,
} from '@/utils/dummy-data/composite-resource-detail/dummyAPIDeviceUnit';

// Mock dependencies
jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useIdFromQuery: jest.fn(),
  useLoading: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(() => <div data-testid='mock-page-header'>Page Header</div>),
  MessageBox: jest.fn(({ type, title, message, close }) => (
    <div data-testid='mock-message-box' data-type={type} data-title={title} data-message={message}>
      {close && <button onClick={close}>Close</button>}
      Message Box
    </div>
  )),
  CardLoading: jest.fn(({ children, loading }) => (
    <div data-testid='mock-card-loading' data-loading={loading?.toString()}>
      {children}
    </div>
  )),
}));

jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  CompositeResourceDetailSummary: jest.fn(() => (
    <div data-testid='mock-composite-resource-detail-summary'>Composite Resource Detail Summary</div>
  )),
  ResourceListTable: jest.fn(() => <div data-testid='mock-resource-list-table'>Resource List Table</div>),
  useFormatResourceListTableData: jest.fn(),
}));

describe('Composite Resource Detail Page', () => {
  // Test data
  const mockUnitId = 'unit001';
  const mockDeviceUnit: APIDeviceUnit = dummyAPIDeviceUnit;

  // Mock implementations
  const mockMutate = jest.fn();
  const mockRgMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (useIdFromQuery as jest.Mock).mockReturnValue(mockUnitId);
    (useLoading as jest.Mock).mockImplementation((isValidating) => isValidating);

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: mockDeviceUnit,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    (useFormatResourceListTableData as jest.Mock).mockImplementation(() => ({
      formattedData: [],
      rgError: null,
      rgIsValidating: false,
      rgMutate: mockRgMutate,
    }));
  });

  test('renders with device unit data', () => {
    render(<CompositeResourceDetail />);

    // Check if the page header is rendered
    expect(PageHeader).toHaveBeenCalled();

    // Check that at least one call had the expected properties
    const pageHeaderCalls = (PageHeader as jest.Mock).mock.calls;
    const hasExpectedPageHeaderProps = pageHeaderCalls.some((call) => {
      const props = call[0];
      return (
        props.pageTitle === 'Composite Resource Details' &&
        props.loading === false &&
        JSON.stringify(props.items) ===
          JSON.stringify([
            { title: 'Resource Management' },
            { title: 'Resources.list', href: '/cdim/res-resource-list' },
            { title: 'Composite Resource Details <unit001>' },
          ])
      );
    });
    expect(hasExpectedPageHeaderProps).toBe(true);

    // Check if components are rendered
    expect(screen.getByTestId('mock-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-composite-resource-detail-summary')).toBeInTheDocument();
    expect(screen.getByTestId('mock-resource-list-table')).toBeInTheDocument();

    // Check if CompositeResourceDetailSummary is called with correct props
    expect(CompositeResourceDetailSummary).toHaveBeenCalled();
    const summaryCalls = (CompositeResourceDetailSummary as jest.Mock).mock.calls;
    expect(summaryCalls.length).toBeGreaterThan(0);

    const summaryProps = summaryCalls[0][0];
    expect(summaryProps.loading).toBe(false);
    expect(summaryProps.data).toBe(mockDeviceUnit);
    expect(summaryProps.doOnSuccess).toBeDefined();

    // Check if ResourceListTable is called
    expect(ResourceListTable).toHaveBeenCalled();
    const tableCalls = (ResourceListTable as jest.Mock).mock.calls;
    expect(tableCalls.length).toBeGreaterThan(0);

    const tableProps = tableCalls[0][0];
    expect(tableProps.loading).toBe(false);
    expect(tableProps.showAccessorSelector).toBe(true);
    expect(tableProps.showPagination).toBe(true);

    // Check if card loading shows composite resource ID
    expect(screen.getByText('Composite Resource ID')).toBeInTheDocument();
    expect(screen.getByText('unit001')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: true,
      mutate: mockMutate,
    }));

    (useLoading as jest.Mock).mockReturnValue(true);

    render(<CompositeResourceDetail />);

    // Check that PageHeader has been called with loading state
    const pageHeaderCalls = (PageHeader as jest.Mock).mock.calls;
    const hasLoadingState = pageHeaderCalls.some((call) => {
      const props = call[0];
      return props.loading === true;
    });
    expect(hasLoadingState).toBe(true);

    // Check that CompositeResourceDetailSummary has been called with loading state
    const summaryCalls = (CompositeResourceDetailSummary as jest.Mock).mock.calls;
    const hasSummaryLoadingState = summaryCalls.some((call) => {
      const props = call[0];
      return props.loading === true;
    });
    expect(hasSummaryLoadingState).toBe(true);

    // Check that ResourceListTable has been called with loading state
    const tableCalls = (ResourceListTable as jest.Mock).mock.calls;
    const hasTableLoadingState = tableCalls.some((call) => {
      const props = call[0];
      return props.loading === true;
    });
    expect(hasTableLoadingState).toBe(true);

    // Check if card loading is in loading state
    expect(screen.getByTestId('mock-card-loading')).toHaveAttribute('data-loading', 'true');
  });

  test('handles device unit fetch error', () => {
    const errorMessage = 'Failed to fetch device unit';
    const dataMessage = 'Device unit not found';

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: {
        message: errorMessage,
        response: { data: { message: dataMessage } },
      },
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check if error message is displayed
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;
    const hasErrorMessage = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === errorMessage && props.message === dataMessage;
    });
    expect(hasErrorMessage).toBe(true);

    const messageBox = screen.getByTestId('mock-message-box');
    expect(messageBox).toHaveAttribute('data-type', 'error');
    expect(messageBox).toHaveAttribute('data-title', errorMessage);
    expect(messageBox).toHaveAttribute('data-message', dataMessage);
  });

  test('handles device unit fetch error without response data', () => {
    const errorMessage = 'Failed to fetch device unit';

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: {
        message: errorMessage,
      },
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check if error message is displayed with empty message
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;
    const hasErrorMessage = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === errorMessage && props.message === '';
    });
    expect(hasErrorMessage).toBe(true);

    const messageBox = screen.getByTestId('mock-message-box');
    expect(messageBox).toHaveAttribute('data-type', 'error');
    expect(messageBox).toHaveAttribute('data-title', errorMessage);
    expect(messageBox).toHaveAttribute('data-message', '');
  });

  test('handles resource group fetch error', () => {
    const errorMessage = 'Failed to fetch resource groups';
    const dataMessage = 'Resource groups not found';

    (useFormatResourceListTableData as jest.Mock).mockImplementation(() => ({
      formattedData: [],
      rgError: {
        message: errorMessage,
        response: { data: { message: dataMessage } },
      },
      rgIsValidating: false,
      rgMutate: mockRgMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check if error message is displayed
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;
    const hasErrorMessage = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === errorMessage && props.message === dataMessage;
    });
    expect(hasErrorMessage).toBe(true);

    const messageBox = screen.getByTestId('mock-message-box');
    expect(messageBox).toHaveAttribute('data-type', 'error');
    expect(messageBox).toHaveAttribute('data-title', errorMessage);
    expect(messageBox).toHaveAttribute('data-message', dataMessage);
  });

  test('handles resource group fetch error without response data', () => {
    const errorMessage = 'Failed to fetch resource groups';

    (useFormatResourceListTableData as jest.Mock).mockImplementation(() => ({
      formattedData: [],
      rgError: {
        message: errorMessage,
      },
      rgIsValidating: false,
      rgMutate: mockRgMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check if error message is displayed with empty message
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;
    const hasErrorMessage = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === errorMessage && props.message === '';
    });
    expect(hasErrorMessage).toBe(true);

    const messageBox = screen.getByTestId('mock-message-box');
    expect(messageBox).toHaveAttribute('data-type', 'error');
    expect(messageBox).toHaveAttribute('data-title', errorMessage);
    expect(messageBox).toHaveAttribute('data-message', '');
  });

  test('displays success message when maintenance is started', () => {
    render(<CompositeResourceDetail />);

    // Get the doOnSuccess callback
    const doOnSuccessCallback = (CompositeResourceDetailSummary as jest.Mock).mock.calls[0][0].doOnSuccess;

    // Create a mock response object with available set to false to trigger Start
    const mockResponse: Partial<AxiosResponse> = {
      data: { available: false },
    };

    // Call the callback to trigger setSuccessInfo with 'Start'
    act(() => {
      doOnSuccessCallback(mockResponse as AxiosResponse);
    });

    // Verify MessageBox was called with success type
    expect(MessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
      undefined
    );

    // Check that we found a success message call
    const messageBoxCall = (MessageBox as jest.Mock).mock.calls.find((call) => call[0].type === 'success');
    expect(messageBoxCall).toBeDefined();
  });

  test('displays success message when maintenance is ended', () => {
    jest.clearAllMocks();

    render(<CompositeResourceDetail />);

    // Get the doOnSuccess callback
    const doOnSuccessCallback = (CompositeResourceDetailSummary as jest.Mock).mock.calls[0][0].doOnSuccess;

    // Create a mock response object with available set to true to trigger End
    const mockResponse: Partial<AxiosResponse> = {
      data: { available: true },
    };

    // Call the callback
    act(() => {
      doOnSuccessCallback(mockResponse as AxiosResponse);
    });

    // Verify MessageBox was called
    expect(MessageBox).toHaveBeenCalled();

    // Check that at least one call has the success type
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;
    const hasSuccessMessage = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'success';
    });

    expect(hasSuccessMessage).toBe(true);
  });

  test('closes success message when close button is clicked', async () => {
    (MessageBox as jest.Mock).mockImplementation(({ type, title, message, close }) => (
      <div data-testid='mock-message-box' data-type={type} data-title={title} data-message={message}>
        {close && (
          <button data-testid='close-button' onClick={close}>
            Close
          </button>
        )}
        Message Box
      </div>
    ));

    render(<CompositeResourceDetail />);

    // Get the doOnSuccess callback to show a success message
    const doOnSuccessCallback = (CompositeResourceDetailSummary as jest.Mock).mock.calls[0][0].doOnSuccess;

    // Clear previous MessageBox calls
    (MessageBox as jest.Mock).mockClear();

    // Show success message
    act(() => {
      doOnSuccessCallback({ data: { available: true } });
    });

    // Verify success message is shown
    expect(MessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        close: expect.any(Function),
      }),
      undefined
    );

    // Extract the close function from the MessageBox props
    const closeFunction = (MessageBox as jest.Mock).mock.calls[0][0].close;

    // Directly call the close function to simulate button click
    act(() => {
      closeFunction();
    });

    // Re-render after state change
    (MessageBox as jest.Mock).mockClear();
    render(<CompositeResourceDetail />);

    // Verify the MessageBox is not called again (message is closed)
    expect((MessageBox as jest.Mock).mock.calls.some((call) => call[0].type === 'success')).toBe(false);
  });

  test('reloads data when PageHeader reload is triggered', () => {
    render(<CompositeResourceDetail />);

    // Extract the reload callback passed to PageHeader
    const reloadCallback = (PageHeader as jest.Mock).mock.calls[0][0].mutate;

    // Call the reload callback
    reloadCallback();

    // Check that all mutate functions were called
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockRgMutate).toHaveBeenCalledTimes(1);
  });

  test('handles case when no unit ID is provided', () => {
    // Mock no unit ID
    (useIdFromQuery as jest.Mock).mockReturnValue('');

    // Reset useSWRImmutable to track new calls
    (useSWRImmutable as jest.Mock).mockClear();

    // Render with no ID
    render(<CompositeResourceDetail />);

    // Check the arguments passed to useSWRImmutable
    const useSWRCalls = (useSWRImmutable as jest.Mock).mock.calls;

    // Verify that it's called with falsy first param (not an actual URL)
    expect(useSWRCalls.length).toBeGreaterThan(0);
    expect(useSWRCalls[0][0]).toBeFalsy();
  });

  test('handles case when unit ID is undefined', () => {
    // Mock undefined unit ID
    (useIdFromQuery as jest.Mock).mockReturnValue(undefined);

    // Reset useSWRImmutable to track new calls
    (useSWRImmutable as jest.Mock).mockClear();

    // Render with undefined ID
    render(<CompositeResourceDetail />);

    // Check the arguments passed to useSWRImmutable
    const useSWRCalls = (useSWRImmutable as jest.Mock).mock.calls;

    // Verify that it's called with falsy first param
    expect(useSWRCalls.length).toBeGreaterThan(0);
    expect(useSWRCalls[0][0]).toBeFalsy();
  });

  test('formats resources with deviceUnit property', () => {
    render(<CompositeResourceDetail />);

    // Check that useFormatResourceListTableData was called with resources containing deviceUnit
    const formatDataCalls = (useFormatResourceListTableData as jest.Mock).mock.calls;
    expect(formatDataCalls.length).toBeGreaterThan(0);

    const resourcesWithDeviceUnit = formatDataCalls[0][0];

    // Verify that resources have deviceUnit property
    if (resourcesWithDeviceUnit && resourcesWithDeviceUnit.length > 0) {
      resourcesWithDeviceUnit.forEach((resource: any) => {
        expect(resource.deviceUnit).toBeDefined();
        expect(resource.deviceUnit.id).toBe(mockDeviceUnit.id);
        expect(resource.deviceUnit.annotation).toBe(mockDeviceUnit.annotation);
      });
    }
  });

  test('handles undefined device unit data', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CompositeResourceDetail />);

    // Should not crash with undefined data
    expect(screen.getByTestId('mock-page-header')).toBeInTheDocument();

    // useFormatResourceListTableData should be called with undefined
    const formatDataCalls = (useFormatResourceListTableData as jest.Mock).mock.calls;
    expect(formatDataCalls.length).toBeGreaterThan(0);
    expect(formatDataCalls[0][0]).toBeUndefined();
  });

  test('handles device unit with empty resources array', () => {
    const deviceUnitWithEmptyResources: APIDeviceUnit = {
      ...mockDeviceUnit,
      resources: [],
    };

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: deviceUnitWithEmptyResources,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check that useFormatResourceListTableData was called with empty array
    const formatDataCalls = (useFormatResourceListTableData as jest.Mock).mock.calls;
    expect(formatDataCalls.length).toBeGreaterThan(0);

    const resourcesWithDeviceUnit = formatDataCalls[0][0];
    expect(resourcesWithDeviceUnit).toEqual([]);
  });

  test('renders resource list with correct default accessors', () => {
    render(<CompositeResourceDetail />);

    // Check that ResourceListTable was called with correct defaultAccessors
    const tableCalls = (ResourceListTable as jest.Mock).mock.calls;
    expect(tableCalls.length).toBeGreaterThan(0);

    const tableProps = tableCalls[0][0];
    expect(tableProps.defaultAccessors).toEqual([
      'id',
      'type',
      'status',
      'powerState',
      'detected',
      'resourceGroups',
      'nodeIDs',
    ]);
    expect(tableProps.storeColumnsKey).toBe('composite-resource-details.resource-list');
    expect(tableProps.tableName).toBe('Resources.list');
  });

  test('handles resource group validating state', () => {
    (useFormatResourceListTableData as jest.Mock).mockImplementation(() => ({
      formattedData: [],
      rgError: null,
      rgIsValidating: true,
      rgMutate: mockRgMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check that PageHeader has been called with loading state including rgIsValidating
    const pageHeaderCalls = (PageHeader as jest.Mock).mock.calls;
    const hasLoadingState = pageHeaderCalls.some((call) => {
      const props = call[0];
      return props.loading === true;
    });
    expect(hasLoadingState).toBe(true);

    // Check that ResourceListTable has been called with loading state
    const tableCalls = (ResourceListTable as jest.Mock).mock.calls;
    const hasTableLoadingState = tableCalls.some((call) => {
      const props = call[0];
      return props.loading === true;
    });
    expect(hasTableLoadingState).toBe(true);
  });

  test('resets success info when reload is called', () => {
    render(<CompositeResourceDetail />);

    // Show success message first
    const doOnSuccessCallback = (CompositeResourceDetailSummary as jest.Mock).mock.calls[0][0].doOnSuccess;
    act(() => {
      doOnSuccessCallback({ data: { available: true } });
    });

    // Clear MessageBox mock
    (MessageBox as jest.Mock).mockClear();

    // Call reload
    const reloadCallback = (PageHeader as jest.Mock).mock.calls[0][0].mutate;
    act(() => {
      reloadCallback();
    });

    // Re-render to check state
    (MessageBox as jest.Mock).mockClear();
    render(<CompositeResourceDetail />);

    // Verify success message is not shown after reload
    const hasSuccessMessage = (MessageBox as jest.Mock).mock.calls.some((call) => call[0]?.type === 'success');
    expect(hasSuccessMessage).toBe(false);
  });

  test('renders with maintenance device unit data', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: dummyAPIDeviceUnitMaintenance,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check if components are rendered
    expect(screen.getByTestId('mock-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-composite-resource-detail-summary')).toBeInTheDocument();

    // Check if CompositeResourceDetailSummary is called with maintenance data
    const summaryCalls = (CompositeResourceDetailSummary as jest.Mock).mock.calls;
    const summaryProps = summaryCalls[0][0];
    expect(summaryProps.data).toBe(dummyAPIDeviceUnitMaintenance);
  });

  test('renders both device unit and resource group errors simultaneously', () => {
    const deviceUnitError = 'Device unit error';
    const resourceGroupError = 'Resource group error';

    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: {
        message: deviceUnitError,
        response: { data: { message: 'Device unit message' } },
      },
      isValidating: false,
      mutate: mockMutate,
    }));

    (useFormatResourceListTableData as jest.Mock).mockImplementation(() => ({
      formattedData: [],
      rgError: {
        message: resourceGroupError,
        response: { data: { message: 'Resource group message' } },
      },
      rgIsValidating: false,
      rgMutate: mockRgMutate,
    }));

    render(<CompositeResourceDetail />);

    // Check that both error messages are displayed
    const messageBoxCalls = (MessageBox as jest.Mock).mock.calls;

    const hasDeviceUnitError = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === deviceUnitError;
    });
    expect(hasDeviceUnitError).toBe(true);

    const hasResourceGroupError = messageBoxCalls.some((call) => {
      const props = call[0];
      return props.type === 'error' && props.title === resourceGroupError;
    });
    expect(hasResourceGroupError).toBe(true);
  });
});
