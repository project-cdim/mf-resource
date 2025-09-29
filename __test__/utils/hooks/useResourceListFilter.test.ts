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

import { act, renderHook } from '@testing-library/react';

import { useQueryArrayObject } from '@/shared-modules/utils/hooks';

import { dummyAPPResource } from '@/utils/dummy-data/resource-list/dummyAPPResource';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';
import { mockQuery } from '@/shared-modules/__test__/test-utils';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQueryArrayObject: jest.fn(),
}));

describe('useResourceListFilter', () => {
  beforeEach(() => {
    // @ts-ignore
    useQueryArrayObject.mockReset();
  });

  test('When allocatedNodesQuery only contains Unallocated, only unallocated resources are returned for the node', () => {
    mockQuery('allocatednode', ['Unallocated']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(1);
  });

  test('When allocatedNodesQuery only contains Allocated, only unallocated resources are returned for the node', () => {
    mockQuery('allocatednode', ['Allocated']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(11);
  });

  test('When allocatedCxlQuery only contains Unallocated, only unallocated resources are returned for the node', () => {
    mockQuery('allocatedCxl', ['Unallocated']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;

    expect(filteredRecords).toHaveLength(1);
  });

  test('When allocatedCxlQuery only contains Allocated, only unallocated resources are returned for the node', () => {
    mockQuery('allocatedCxl', ['Allocated']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;

    expect(filteredRecords).toHaveLength(11);
  });

  test('That only resources matching the specified query (cxlSwitchId) are returned', async () => {
    mockQuery('cxlSwitchId', ['cxl001']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.filteredRecords).toHaveLength(11);
    jest.useRealTimers();
  });

  test.each([
    [['memory'], 1],
    [['', 'memory', 'networkInterface'], 2],
    [['memory'], 1],
    [['memory', 'networkInterface'], 2],
    [['memory', 'networkInterface'], 2],
  ])('That only resources matching the specified query (type) are returned: %s', (query, expected) => {
    mockQuery('type', query);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(expected);
  });

  test('That only resources matching the specified query (allocatednode) are returned', () => {
    mockQuery('allocatednode', ['Unallocated']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });

  test('That only resources matching the specified query (state) are returned', () => {
    mockQuery('state', ['Disabled']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });
  test('That only resources matching the specified query (health) are returned', () => {
    mockQuery('health', ['Warning']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(2);
  });
  test('That only resources matching the specified query (resourceAvailable) are returned', () => {
    mockQuery('resourceAvailable', ['Unavailable']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });

  test('That only resources matching the specified query (resourceGroup) are returned', () => {
    mockQuery('resourceGroup', ['default']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.filteredRecords).toHaveLength(11);
    jest.useRealTimers();
  });

  test('That only resources matching the specified query (nodeId) are returned', () => {
    mockQuery('nodeId', ['node002']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.filteredRecords).toHaveLength(11);
    jest.useRealTimers();
  });

  test('That only resources with detected=true are returned when detection=["Detected"]', () => {
    mockQuery('detection', ['Detected']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    // Count resources with detected=true in dummyAPPResource
    const expectedCount = dummyAPPResource.filter((resource) => resource.detected).length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has detected=true
    result.current.filteredRecords.forEach((record) => {
      expect(record.detected).toBe(true);
    });
  });

  test('That only resources with detected=false are returned when detection=["Not Detected"]', () => {
    mockQuery('detection', ['Not Detected']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    // Count resources with detected=false in dummyAPPResource
    const expectedCount = dummyAPPResource.filter((resource) => !resource.detected).length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has detected=false
    result.current.filteredRecords.forEach((record) => {
      expect(record.detected).toBe(false);
    });
  });

  test('That all resources are returned when both detection states are selected', () => {
    mockQuery('detection', ['Detected', 'Not Detected']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    expect(result.current.filteredRecords).toHaveLength(dummyAPPResource.length);
  });

  test('When url contains no queries, all items are returned', () => {
    // @ts-ignore
    useQueryArrayObject.mockReturnValue(
      new Proxy({} as Record<string, string[]>, {
        get: () => [],
      })
    );
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(12);
  });
});
