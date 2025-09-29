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

import { renderHook, act } from '@testing-library/react';
import axios, { AxiosError } from 'axios';

import { useResourceGroupSelectModal } from '@/utils/hooks/useResourceGroupSelectModal';
import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import { dummyAPIResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';
import '@/shared-modules/__test__/mock';

// Mock dependencies
jest.mock('axios');
jest.mock('@/utils/hooks/useResourceGroupsData');

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('useResourceGroupSelectModal', () => {
  // Setup environment variable for API
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set up environment variable
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER: 'http://api.example.com',
    };

    // Default mock for useResourceGroupsData
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      validating: false,
      mutate: jest.fn(),
    });
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
  });

  test('initial state is set correctly', () => {
    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Check initial state
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.dataFetchError).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.allResourceGroups).toEqual([]);
  });

  test('openModal sets the modal to open and resets errors', () => {
    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Set some initial errors to ensure they get reset
    act(() => {
      result.current.setError({} as AxiosError<{ code: string; message: string; details?: string }>);
      result.current.setDataFetchError({} as AxiosError<{ code: string; message: string; details?: string }>);
    });

    // Open the modal
    act(() => {
      result.current.openModal();
    });

    // Check state after opening modal
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.dataFetchError).toBeUndefined();
  });

  test('closeModal sets the modal to closed', () => {
    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Open the modal first
    act(() => {
      result.current.openModal();
    });

    // Then close it
    act(() => {
      result.current.closeModal();
    });

    // Check state after closing modal
    expect(result.current.isModalOpen).toBe(false);
  });

  test('updates allResourceGroups when resourceGroups data is available', () => {
    // Mock resource groups data
    const resourceGroupsData = dummyAPIResourceGroups.resourceGroups;
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: resourceGroupsData,
      error: null,
      validating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Check that resourceGroups data is set correctly
    expect(result.current.allResourceGroups).toEqual(resourceGroupsData);
  });

  test('sets loading state to true when validating', () => {
    // Mock validating state
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      validating: true,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Check loading state
    expect(result.current.loading).toBe(true);
  });

  test('handles data fetch error by setting empty resource groups', () => {
    // Create a mock error of the correct type
    const mockError = new Error('Failed to fetch resource groups') as Error;

    // Mock error response from useResourceGroupsData
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      validating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Check that allResourceGroups is set to empty array when there's an error
    expect(result.current.allResourceGroups).toEqual([]);
  });

  test('submitResourceGroups successfully updates resource groups', async () => {
    // Mock successful axios put
    const mockResponse = { data: { success: true } };
    (axios.put as jest.Mock).mockResolvedValue(mockResponse);

    // Setup success callback
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Call the submit function
    await act(async () => {
      await result.current.submitResourceGroups('device-123', ['group-1', 'group-2'], onSuccess);
    });

    // Verify API call was made correctly with proper parameters
    expect((axios.put as jest.Mock).mock.calls[0][0]).toBe(
      'http://api.example.com/resources/device-123/resource-groups'
    );
    expect((axios.put as jest.Mock).mock.calls[0][1]).toEqual(['group-1', 'group-2']);

    // Check loading states before and after the call
    expect(result.current.loading).toBe(false);

    // Verify success callback was called with the expected format
    expect((onSuccess as jest.Mock).mock.calls[0][0]).toEqual({ operation: 'UpdateResourceGroup' });

    // Verify modal was closed
    expect(result.current.isModalOpen).toBe(false);

    // Verify error is reset
    expect(result.current.error).toBeUndefined();
  });

  test('submitResourceGroups handles API error', async () => {
    // Create a mock error object with the correct response type
    const mockError = new AxiosError<{ code: string; message: string; details?: string }>(
      'Error updating resource groups',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { code: 'ERROR_CODE', message: 'Error message', details: 'Error details' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }
    );

    // Mock failed axios put
    (axios.put as jest.Mock).mockRejectedValue(mockError);

    const onSuccess = jest.fn();

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Call the submit function
    await act(async () => {
      await result.current.submitResourceGroups('device-123', ['group-1', 'group-2'], onSuccess);
    });

    // Verify API call was attempted
    expect(axios.put).toHaveBeenCalledWith('http://api.example.com/resources/device-123/resource-groups', [
      'group-1',
      'group-2',
    ]);

    // Check error was set
    expect(result.current.error).toBe(mockError);

    // Verify success callback was not called
    expect(onSuccess).not.toHaveBeenCalled();

    // Verify loading was reset to false
    expect(result.current.loading).toBe(false);
  });

  test('submitResourceGroups does nothing if deviceId is empty', async () => {
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Call submit with empty deviceId
    await act(async () => {
      await result.current.submitResourceGroups('', ['group-1', 'group-2'], onSuccess);
    });

    // Verify API call was not attempted
    expect(axios.put).not.toHaveBeenCalled();

    // Verify success callback was not called
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('setError updates the error state', () => {
    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Create a mock error with the correct response type
    const mockError = new AxiosError<{ code: string; message: string; details?: string }>(
      'Test error',
      'ERR_TEST',
      undefined,
      undefined,
      {
        data: { code: 'ERROR_CODE', message: 'Error message' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }
    );

    // Set the error
    act(() => {
      result.current.setError(mockError);
    });

    // Verify error state was updated
    expect(result.current.error).toBe(mockError);
  });

  test('setDataFetchError updates the dataFetchError state', () => {
    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Create a mock error with the correct response type
    const mockError = new AxiosError<{ code: string; message: string; details?: string }>(
      'Test data fetch error',
      'ERR_TEST',
      undefined,
      undefined,
      {
        data: { code: 'ERROR_CODE', message: 'Error message' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }
    );

    // Set the data fetch error
    act(() => {
      result.current.setDataFetchError(mockError);
    });

    // Verify data fetch error state was updated
    expect(result.current.dataFetchError).toBe(mockError);
  });

  test('resets dataFetchError when resourceGroupsError is falsy', () => {
    // First set up hook with an error
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: new Error('Initial error'),
      validating: false,
      mutate: jest.fn(),
    });

    const { result, rerender } = renderHook(() => useResourceGroupSelectModal());

    // Verify dataFetchError is set
    expect(result.current.dataFetchError).toBeDefined();

    // Now update the mock to remove the error
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      validating: false,
      mutate: jest.fn(),
    });

    // Rerender to trigger useEffect
    rerender();

    // Verify dataFetchError is reset
    expect(result.current.dataFetchError).toBeUndefined();
  });

  test('handles undefined resourceGroups data', () => {
    // Mock undefined data
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: undefined,
      error: null,
      validating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Should initialize with empty array
    expect(result.current.allResourceGroups).toEqual([]);
  });

  test('handles null resourceGroups data', () => {
    // Mock null data
    (useResourceGroupsData as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      validating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Should initialize with empty array
    expect(result.current.allResourceGroups).toEqual([]);
  });

  test('submitResourceGroups with empty array of resource group IDs', async () => {
    // Mock successful axios put
    (axios.put as jest.Mock).mockResolvedValue({ data: { success: true } });
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useResourceGroupSelectModal());

    // Call with empty array
    await act(async () => {
      await result.current.submitResourceGroups('device-123', [], onSuccess);
    });

    // Verify API call was made with empty array
    expect(axios.put).toHaveBeenCalledWith('http://api.example.com/resources/device-123/resource-groups', []);

    // Success callback should be called
    expect(onSuccess).toHaveBeenCalled();
  });
});
