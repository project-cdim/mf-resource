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
import { useResourceSummary } from '@/utils/hooks/useResourceSummary';
import * as swrModule from 'swr';
import { APIresource, APIresources } from '@/shared-modules/types/APIresources';

jest.mock('swr');

// Minimal valid APIresource object for testing
const minimalAPIresource: APIresource = {
  device: {
    deviceID: 'dev001',
    type: 'CPU',
    status: { state: 'Enabled', health: 'OK' },
    attribute: {},
  },
  resourceGroupIDs: [],
  annotation: { available: true },
  detected: true,
  nodeIDs: [],
};

// Helper to create APIresources shape from dummyAPPResource
const makeAPIresources = (resources: APIresource[]): APIresources => ({ count: resources.length, resources });

describe('useResourceSummary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch resource summary data (normal case)', async () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: makeAPIresources([minimalAPIresource]),
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toEqual(makeAPIresources([minimalAPIresource]));
    expect(result.current.error).toBeUndefined();
    expect(typeof result.current.isValidating).toBe('boolean');
  });

  test('should return empty data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: { count: 0, resources: [] },
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toEqual({ count: 0, resources: [] });
  });

  test('should handle undefined data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBeUndefined();
  });

  test('should handle null data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: null,
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBeNull();
  });

  test('should handle false data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: false,
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBe(false);
  });

  test('should handle 0 as data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: 0,
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBe(0);
  });

  test('should handle empty string as data', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: '',
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBe('');
  });

  test('should handle error case', () => {
    const error = new Error('fetch error');
    (swrModule.default as jest.Mock).mockReturnValue({
      data: undefined,
      error,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.error).toBe(error);
  });

  test('should handle mswInitializing true (should not fetch)', () => {
    // The mswInitializing prop has been abolished, so the test has been modified to match the specification that always fetches.
    (swrModule.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toBeUndefined();
    // Since the key of useSWR will never be false, verify part of the URL
    expect((swrModule.default as jest.Mock).mock.calls[0][0]).toContain('/resources?detail=true');
  });

  test('should handle boundary value: count = 1', () => {
    (swrModule.default as jest.Mock).mockReturnValue({
      data: makeAPIresources([minimalAPIresource]),
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data).toEqual(makeAPIresources([minimalAPIresource]));
    expect(result.current.data?.count).toBe(1);
  });

  test('should handle boundary value: large count', () => {
    const many = Array(1000).fill(minimalAPIresource);
    (swrModule.default as jest.Mock).mockReturnValue({
      data: makeAPIresources(many),
      error: undefined,
      isValidating: false,
    });
    const { result } = renderHook(() => useResourceSummary());
    expect(result.current.data?.count).toBe(1000);
  });
});
