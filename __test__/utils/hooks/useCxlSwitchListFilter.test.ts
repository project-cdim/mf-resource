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

import { dummyAPPCxlSwitch } from '@/utils/dummy-data/cxl-switch-list/dummyAPPCxlSwitch';
import { useCxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';

describe('useCxlSwitchListFilter', () => {
  test('should return the correct initial values', () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    expect(result.current.filteredRecords).toEqual(dummyAPPCxlSwitch);
    expect(result.current.query).toEqual({
      id: '',
      connected: [],
      unallocated: [],
      disabled: [],
      warning: [],
      critical: [],
      unavailable: [],
    });

    // The setQuery function is tested separately, so no need to test its initial values

    expect(result.current.selectOptions).toEqual({
      // No number specified → show both options
      number: [
        { value: 'notExist', label: 'equal 0' },
        { value: 'exist', label: '1 or more' },
      ],
    });
  });

  test('setQuery.id() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // ANCHOR "1" → 4 items
    act(() => {
      setQuery.id('1');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.id).toBe('1');
    expect(result.current.filteredRecords).toHaveLength(4); // cxl001, cxl010, cxl011, cxl012
    // ANCHOR "cxl00" → 9 items
    act(() => {
      setQuery.id('cxl00');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.id).toBe('cxl00');
    expect(result.current.filteredRecords).toHaveLength(9); // cxl01 ～ cxl09
    jest.useRealTimers();
  });

  test('setQuery.connected() works correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.connected(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.connected).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(1); // cxl005
    // exist
    act(() => {
      setQuery.connected(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.connected).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(11); // except cxl005
  });

  test('setQuery.unallocated() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.unallocated(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.unallocated).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(1); // cxl005
    // exist
    act(() => {
      setQuery.unallocated(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.unallocated).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(11); // except cxl005
  });

  test('setQuery.disabled() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.disabled(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.disabled).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(7);
    // exist
    act(() => {
      setQuery.disabled(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.disabled).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(5);
  });

  test('setQuery.warning() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.warning(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.warning).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(8);
    // exist
    act(() => {
      setQuery.warning(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.warning).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(4);
  });

  test('setQuery.critical() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.critical(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.critical).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(7);
    // exist
    act(() => {
      setQuery.critical(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.critical).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(5);
  });

  test('setQuery.unavailable() should work correctly', async () => {
    const { result } = renderHook(() => useCxlSwitchListFilter(dummyAPPCxlSwitch));
    jest.useFakeTimers();
    const setQuery = result.current.setQuery;
    // notExist
    act(() => {
      setQuery.unavailable(['notExist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.unavailable).toEqual(['notExist']);
    expect(result.current.filteredRecords).toHaveLength(7);
    // exist
    act(() => {
      setQuery.unavailable(['exist']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.unavailable).toEqual(['exist']);
    expect(result.current.filteredRecords).toHaveLength(5);
  });
});
