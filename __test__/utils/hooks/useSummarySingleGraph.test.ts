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

/*
 * Test for useSummarySingleGraph hook
 */
import { renderHook } from '@testing-library/react';
import useSWR from 'swr';
import { useSummarySingleGraph } from '@/utils/hooks/useSummarySingleGraph';
import { APIDeviceType } from '@/shared-modules/types';

jest.mock('swr');
jest.mock('@/shared-modules/utils', () => ({
  fetcher: jest.fn(),
}));

// Mock environment variable
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...OLD_ENV, NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER: 'http://localhost' };
});
afterAll(() => {
  process.env = OLD_ENV;
});

describe('useSummarySingleGraph', () => {
  test('should call useSWR with correct query when deviceTypes is not empty', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: 'mockData', error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU', 'memory'];
    const metricEndDate = '2025-06-10T00:00:00Z';
    const { result } = renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));
    const usageQuery =
      'label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","")';
    const storageUsageQuery =
      'label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")';
    const expectedUrl =
      'http://localhost/query?query=' + usageQuery + ' or ' + storageUsageQuery + '&time=' + metricEndDate;
    expect((useSWR as jest.Mock).mock.calls[0][0]).toBe(expectedUrl);
    expect((useSWR as jest.Mock).mock.calls[0][1]).toBeDefined();
    expect(result.current).toEqual({ data: 'mockData', error: undefined, isValidating: false });
  });

  test('should not call useSWR when deviceTypes is empty', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = [];
    const metricEndDate = '2025-06-10T00:00:00Z';
    renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));
    // useSWRの第一引数はfalseになることを期待
    expect((useSWR as jest.Mock).mock.calls[0][0]).toBe(false);
  });

  test('should handle undefined metricEndDate', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricEndDate = undefined;
    renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));
    const usageQuery =
      'label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","")';
    const storageUsageQuery =
      'label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")';
    const expectedUrl = 'http://localhost/query?query=' + usageQuery + ' or ' + storageUsageQuery + '&time=undefined';
    expect((useSWR as jest.Mock).mock.calls[0][0]).toBe(expectedUrl);
  });

  test('should handle null, false, 0, and empty string as metricEndDate', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    [null, false, 0, ''].forEach((val) => {
      renderHook(() => useSummarySingleGraph(deviceTypes, val as any));
      expect((useSWR as jest.Mock).mock.calls.at(-1)[0]).toContain(`&time=${val}`);
    });
  });

  test('should return error and isValidating from useSWR', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: 'error', isValidating: true });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricEndDate = '2025-06-10T00:00:00Z';
    const { result } = renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));
    expect(result.current.error).toBe('error');
    expect(result.current.isValidating).toBe(true);
  });
});
