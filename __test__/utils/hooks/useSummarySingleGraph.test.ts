/*
 * Copyright 2025-2026 NEC Corporation.
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
import { fetcherForPromqlByPost } from '@/shared-modules/utils';

jest.mock('swr');
jest.mock('@/shared-modules/utils', () => ({
  fetcherForPromqlByPost: jest.fn(),
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
    const combinedQuery = `${usageQuery} or ${storageUsageQuery}`;

    // Verify SWR key is an array with URL, query, and metricEndDate
    const expectedKey = [`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`, combinedQuery, metricEndDate];
    expect((useSWR as jest.Mock).mock.calls[0][0]).toEqual(expectedKey);
    expect((useSWR as jest.Mock).mock.calls[0][1]).toBeDefined();
    expect(result.current).toEqual({ data: 'mockData', error: undefined, isValidating: false });
  });

  test('should not call useSWR when deviceTypes is empty', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = [];
    const metricEndDate = '2025-06-10T00:00:00Z';
    renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));
    // useSWR should be called with null key
    expect((useSWR as jest.Mock).mock.calls[0][0]).toBe(null);
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
    const combinedQuery = `${usageQuery} or ${storageUsageQuery}`;

    const expectedKey = [`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`, combinedQuery, undefined];
    expect((useSWR as jest.Mock).mock.calls[0][0]).toEqual(expectedKey);
  });

  test('should handle null, false, 0, and empty string as metricEndDate', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    [null, false, 0, ''].forEach((val) => {
      jest.clearAllMocks();
      renderHook(() => useSummarySingleGraph(deviceTypes, val as any));

      const swrKey = (useSWR as jest.Mock).mock.calls[0][0];
      expect(swrKey[2]).toBe(val); // Third element should be the metricEndDate value
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

  test('should call fetcherForPromqlByPost with correct parameters', () => {
    (fetcherForPromqlByPost as jest.Mock).mockResolvedValue({ data: 'test' });
    (useSWR as jest.Mock).mockReturnValue({ data: 'mockData', error: undefined, isValidating: false });

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricEndDate = '2025-06-10T00:00:00Z';

    renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));

    // Get the fetcher function from useSWR call
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];

    // Test the fetcher function
    const url = `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`;
    const query =
      'label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","") or label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")';
    const time = metricEndDate;

    fetcherFn([url, query, time]);

    // Verify fetcherForPromqlByPost was called with correct parameters
    expect(fetcherForPromqlByPost).toHaveBeenCalledWith(url, expect.any(URLSearchParams));

    // Verify URLSearchParams contains correct data
    const urlParamsCall = (fetcherForPromqlByPost as jest.Mock).mock.calls[0][1];
    expect(urlParamsCall.get('query')).toBe(query);
    expect(urlParamsCall.get('time')).toBe(time);
  });

  test('should handle undefined time parameter in fetcher', () => {
    (fetcherForPromqlByPost as jest.Mock).mockResolvedValue({ data: 'test' });
    (useSWR as jest.Mock).mockReturnValue({ data: 'mockData', error: undefined, isValidating: false });

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricEndDate = undefined;

    renderHook(() => useSummarySingleGraph(deviceTypes, metricEndDate));

    // Get the fetcher function from useSWR call
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];
    // Test the fetcher function with undefined time
    const url = `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`;
    const query =
      'label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","") or label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")';

    fetcherFn([url, query, undefined]);

    // Verify URLSearchParams handles undefined time correctly
    const urlParamsCall = (fetcherForPromqlByPost as jest.Mock).mock.calls[0][1];
    expect(urlParamsCall.get('time')).toBe(''); // Should be empty string when undefined
  });
});
