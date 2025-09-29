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

import { renderHook } from '@testing-library/react';
import useSWR from 'swr';

import { useResourceGroupsData } from '@/utils/hooks/useResourceGroupsData';
import { dummyAPIResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';

// Mock the useSWR hook
jest.mock('swr');

describe('useResourceGroupsData', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReset();
  });

  test('returns resource groups data when fetch is successful', () => {
    // Mock successful API response
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: dummyAPIResourceGroups,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Check returned data
    expect(result.current.data).toEqual(dummyAPIResourceGroups.resourceGroups);
    expect(result.current.error).toBeNull();
    expect(result.current.validating).toBeFalsy();
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.getNameById).toBe('function');
  });

  test('returns empty array when no data is fetched', () => {
    // Mock response with no data
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Check returns empty array for data
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('returns error when fetch fails', () => {
    const mockError = new Error('Failed to fetch');

    // Mock error response
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: mockError,
      isValidating: false,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Check error is returned
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });

  test('getNameById returns correct name for given ID', () => {
    // Mock successful API response
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: dummyAPIResourceGroups,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Test with existing ID
    const existingId = dummyAPIResourceGroups.resourceGroups[0].id;
    const expectedName = dummyAPIResourceGroups.resourceGroups[0].name;
    expect(result.current.getNameById(existingId)).toBe(expectedName);

    // Test with non-existent ID
    expect(result.current.getNameById('non-existent-id')).toBe('');
  });

  test('getNameById returns empty string when data is not available', () => {
    // Mock response with no data
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Should return empty string when no data
    expect(result.current.getNameById('any-id')).toBe('');
  });

  test('validating flag works correctly', () => {
    // Mock loading state
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: true,
      mutate: jest.fn(),
    }));

    const { result } = renderHook(() => useResourceGroupsData());

    // Check validating flag is true
    expect(result.current.validating).toBeTruthy();
  });
});
