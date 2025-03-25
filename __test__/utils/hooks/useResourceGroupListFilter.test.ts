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

import { dummyAPPResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPPResourceGroups';
import { useResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';

describe('useResourceGroupListFilter', () => {
  test('should return the correct initial values', () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    expect(view.result.current.filteredRecords).toEqual(dummyAPPResourceGroups);
    expect(view.result.current.query).toEqual({
      id: '',
      name: '',
      description: '',
      createdAt: [undefined, undefined],
      updatedAt: [undefined, undefined],
    });
  });

  test('setQuery.id() should work correctly', async () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    jest.useFakeTimers();
    const setQuery = view.result.current.setQuery;
    act(() => {
      setQuery.id('10000000');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.id).toBe('10000000');
    expect(view.result.current.filteredRecords).toHaveLength(2);
    act(() => {
      setQuery.id('7000');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.id).toBe('7000');
    expect(view.result.current.filteredRecords).toHaveLength(5);
    jest.useRealTimers();
  });

  test('setQuery.name() should work correctly', async () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    jest.useFakeTimers();
    const setQuery = view.result.current.setQuery;
    act(() => {
      setQuery.name('Resource Group 1');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.name).toBe('Resource Group 1');
    expect(view.result.current.filteredRecords).toHaveLength(1);
    act(() => {
      setQuery.name('Resource Group');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.name).toBe('Resource Group');
    expect(view.result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });

  test('setQuery.description() should work correctly', async () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    jest.useFakeTimers();
    const setQuery = view.result.current.setQuery;
    act(() => {
      setQuery.description('Resource Group 1 Description');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.description).toBe('Resource Group 1 Description');
    expect(view.result.current.filteredRecords).toHaveLength(1);
    act(() => {
      setQuery.description('Resource Group');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.description).toBe('Resource Group');
    expect(view.result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });

  test('setQuery.createdAt() should work correctly', async () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    jest.useFakeTimers();
    const setQuery = view.result.current.setQuery;
    act(() => {
      setQuery.createdAt([new Date('2021-07-01'), new Date('2021-07-01')]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.createdAt).toEqual([new Date('2021-07-01'), new Date('2021-07-01')]);
    expect(view.result.current.filteredRecords).toHaveLength(1);
    act(() => {
      setQuery.createdAt([new Date('2021-07-01'), new Date('2021-07-05')]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.createdAt).toEqual([new Date('2021-07-01'), new Date('2021-07-05')]);
    expect(view.result.current.filteredRecords).toHaveLength(5);
    jest.useRealTimers();
  });

  test('setQuery.updatedAt() should work correctly', async () => {
    const view = renderHook(() => useResourceGroupListFilter(dummyAPPResourceGroups));
    jest.useFakeTimers();
    const setQuery = view.result.current.setQuery;
    act(() => {
      setQuery.updatedAt([new Date('2021-07-12'), new Date('2021-07-12')]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.updatedAt).toEqual([new Date('2021-07-12'), new Date('2021-07-12')]);
    expect(view.result.current.filteredRecords).toHaveLength(1);
    act(() => {
      setQuery.updatedAt([new Date('2021-07-12'), new Date('2021-07-15')]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.updatedAt).toEqual([new Date('2021-07-12'), new Date('2021-07-15')]);
    expect(view.result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });
});
