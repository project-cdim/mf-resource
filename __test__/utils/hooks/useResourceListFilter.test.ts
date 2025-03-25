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

import { useQuery } from '@/shared-modules/utils/hooks';

import { dummyAPPResource } from '@/utils/dummy-data/resource-list/dummyAPPResource';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn(),
}));

jest.mock('next/router', () => ({
  ...jest.requireActual('next/router'),
  useRouter: jest.fn().mockReturnValue({ query: {}, isReady: true }),
}));

describe('useResourceListFilter', () => {
  beforeEach(() => {
    // @ts-ignore
    useQuery.mockReset();
  });

  test('When allocatedNodesQuery only contains Unallocated, only unallocated resources are returned for the node', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ allocatednode: ['Unallocated'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(1);
  });

  test('When allocatedNodesQuery only contains Allocated, only unallocated resources are returned for the node', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ allocatednode: ['Allocated'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(11);
  });

  test('When allocatedCxlQuery only contains Unallocated, only unallocated resources are returned for the node', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ allocatedCxl: ['Unallocated'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;

    expect(filteredRecords).toHaveLength(1);
  });

  test('When allocatedCxlQuery only contains Allocated, only unallocated resources are returned for the node', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ allocatedCxl: ['Allocated'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;

    expect(filteredRecords).toHaveLength(11);
  });

  test('That only resources matching the specified query (cxlSwitchId) are returned', async () => {
    // @ts-ignore
    useQuery.mockReturnValue({ cxlSwitchId: ['cxl001'] });
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
    ['memory', 1],
    [',memory,networkInterface', 2],
    [', memory,   networkInterface, ', 2],
  ])('That only resources matching the specified query (type) are returned: %s', (query, expected) => {
    // @ts-ignore
    useQuery.mockReturnValue({ type: query });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(expected);
  });

  test('That only resources matching the specified query (allocatednode) are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ allocatednode: ['Unallocated'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });

  test('That only resources matching the specified query (state) are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ state: ['Disabled'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });
  test('That only resources matching the specified query (health) are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ health: ['Warning'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(2);
  });
  test('That only resources matching the specified query (resourceAvailable) are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ resourceAvailable: ['Unavailable'] });
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));

    expect(result.current.filteredRecords).toHaveLength(1);
  });
  test('That only resources matching the specified query (nodeId) are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ nodeId: ['node002'] });
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.filteredRecords).toHaveLength(11);
    jest.useRealTimers();
  });
  test('When url contains no queries, all items are returned', () => {
    // @ts-ignore
    useQuery.mockReturnValue({});
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords).toHaveLength(12);
  });
});
