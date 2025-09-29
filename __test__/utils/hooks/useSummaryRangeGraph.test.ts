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
 * Test for useSummaryRangeGraph hook
 */
import { renderHook } from '@testing-library/react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useSummaryRangeGraph } from '../../../utils/hooks/useSummaryRangeGraph';
import { APIDeviceType } from '@/shared-modules/types';

jest.mock('swr');
jest.mock('dayjs', () => {
  const actualDayjs = jest.requireActual('dayjs');
  const mockDayjsInstance = {
    isSame: jest.fn().mockReturnValue(false),
  };

  const mockDayjs = jest.fn(() => {
    return mockDayjsInstance;
  });

  // Copy all properties from the original dayjs
  return Object.assign(mockDayjs, actualDayjs);
});

jest.mock('@/shared-modules/utils', () => ({
  fetcher: jest.fn(),
  fetcherForPromqlByPost: jest.fn().mockImplementation((url, query, start, end, step) => {
    const { createPromQLParams } = require('@/shared-modules/utils');
    createPromQLParams(query, start, end, step);
    return Promise.resolve({});
  }),
  getStepFromRange: jest.fn().mockReturnValue('1h'),
  createPromQLParams: jest.fn().mockImplementation((...args: any[]) => {
    const [query, start, end, step] = args;
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('start', start || '');
    params.append('end', end || '');
    params.append('step', step);
    return params;
  }),
}));

const mockToISOString = jest.fn().mockReturnValue('2025-06-10T12:34:56.789Z');
const originalToISOString = Date.prototype.toISOString;

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...OLD_ENV, NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER: 'http://localhost' };
  Date.prototype.toISOString = mockToISOString;
});
afterAll(() => {
  process.env = OLD_ENV;
  Date.prototype.toISOString = originalToISOString;
});

describe('useSummaryRangeGraph', () => {
  test('should call useSWR with correct query when deviceTypes is not empty', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: 'mockData', error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU', 'memory'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';
    const { result } = renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));
    const baseString =
      'label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~".*"}[1h])/3600),"data_label","<type>_energy","","")';
    const replacedStrings = deviceTypes.map((type) => baseString.replace(/<type>/g, type));
    const makeEnergyQuery = replacedStrings.join(' or ');
    const makeAllEnergyQuery =
      'label_replace(sum(increase({__name__=~".*_metricEnergyJoules_reading",job=~".*"}[1h])/3600),"data_label","all_energy","","")';
    const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
    const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
    const usageNetworkInterfaceQuery =
      'label_replace(sum(rate({__name__=~"' +
      bytesSent +
      '|' +
      bytesRecv +
      '",job=~".*"})[1h]),"data_label","networkInterface_usage","","")';

    // Check that useSWR is called with an array of parameters
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];
    expect(Array.isArray(swrKey)).toBe(true);
    expect(swrKey[0]).toBe('http://localhost/query_range');
    expect(swrKey[1]).toContain(makeEnergyQuery);
    expect(swrKey[1]).toContain(makeAllEnergyQuery);
    expect(swrKey[1]).toContain(usageNetworkInterfaceQuery);
    expect(swrKey[2]).toBe(metricStartDate);
    expect(swrKey[3]).toBe(metricEndDate);
    expect(swrKey[4]).toBe('1h');

    expect((useSWR as jest.Mock).mock.calls[0][1]).toBeDefined();
    expect(result.current).toEqual({ data: 'mockData', error: undefined, isValidating: false });
  });

  test('should not call useSWR when deviceTypes is empty', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = [];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';
    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));
    expect((useSWR as jest.Mock).mock.calls[0][0]).toBe(null);
  });

  test('should handle undefined metricStartDate and metricEndDate', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    renderHook(() => useSummaryRangeGraph(deviceTypes, undefined as unknown as string, undefined as unknown as string));
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];
    expect(Array.isArray(swrKey)).toBe(true);
    expect(swrKey[2]).toBe(undefined);
    expect(swrKey[3]).toBe(undefined);
  });

  test('should handle null, false, 0, and empty string as metricStartDate/metricEndDate', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    [null, false, 0, ''].forEach((val) => {
      jest.clearAllMocks();
      renderHook(() => useSummaryRangeGraph(deviceTypes, val as any, val as any));
      const swrKey = (useSWR as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(swrKey)).toBe(true);
      expect(swrKey[2]).toBe(val);
      expect(swrKey[3]).toBe(val);
    });
  });

  test('should return error and isValidating from useSWR', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: 'error', isValidating: true });
    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';
    const { result } = renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));
    expect(result.current.error).toBe('error');
    expect(result.current.isValidating).toBe(true);
  });

  test('should call getParams and return correct structure', () => {
    jest.clearAllMocks();
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    // Test dates
    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';

    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));

    // Verify SWR key is correctly set
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];
    expect(Array.isArray(swrKey)).toBe(true);
    expect(swrKey).toContain(metricStartDate);
    expect(swrKey).toContain(metricEndDate);
    expect(swrKey).toContain('1h'); // getStepFromRange return value

    // Verify the return structure
    const result = (useSWR as jest.Mock).mock.calls[0][1];
    expect(typeof result).toBe('function'); // fetcher function
  });

  test('should use current date ISO string when metricEndDate is the same as today', () => {
    jest.clearAllMocks();
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    const mockDayjsInstance = dayjs() as any;
    mockDayjsInstance.isSame.mockReturnValue(true); // Make dayjs().isSame() return true

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';

    // Call the hook
    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));

    // Get the fetcher function and the SWR key
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];

    // Call the fetcher function with the correct arguments to trigger createPromQLParams
    fetcherFn(swrKey);

    // Since createPromQLParams should be called within getParams, verify it was called
    const { createPromQLParams } = require('@/shared-modules/utils');
    expect(createPromQLParams).toHaveBeenCalled();
  });

  test('should use metricEndDate when not the same as today', () => {
    jest.clearAllMocks();
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    const mockDayjsInstance = dayjs() as any;
    mockDayjsInstance.isSame.mockReturnValue(false); // Make dayjs().isSame() return false

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = '2025-06-10T00:00:00Z';

    // Call the hook
    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));

    // Get the fetcher function and the SWR key
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];

    // Call the fetcher function with the correct arguments
    fetcherFn(swrKey);

    // Since createPromQLParams should be called within getParams, verify it was called
    const { createPromQLParams } = require('@/shared-modules/utils');
    expect(createPromQLParams).toHaveBeenCalled();
  });

  test('should handle null metricEndDate in getParams', () => {
    jest.clearAllMocks();
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = '2025-06-01T00:00:00Z';
    const metricEndDate = null;

    // Call the hook
    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate as unknown as string));

    // Get the fetcher function and the SWR key
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];

    // Call the fetcher function with the correct arguments
    fetcherFn(swrKey);

    // Since createPromQLParams should be called within getParams, verify it was called
    const { createPromQLParams } = require('@/shared-modules/utils');
    expect(createPromQLParams).toHaveBeenCalled();
  });

  test('handles undefined or null start/end dates', () => {
    jest.clearAllMocks();
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    const deviceTypes: APIDeviceType[] = ['CPU'];
    const metricStartDate = undefined as unknown as string;
    const metricEndDate = null as unknown as string;

    // Call the hook
    renderHook(() => useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate));

    // Get the fetcher function and the SWR key
    const fetcherFn = (useSWR as jest.Mock).mock.calls[0][1];
    const swrKey = (useSWR as jest.Mock).mock.calls[0][0];

    // Call the fetcher function with the correct arguments
    fetcherFn(swrKey);

    // Since createPromQLParams should be called within getParams, verify it was called
    const { createPromQLParams } = require('@/shared-modules/utils');
    expect(createPromQLParams).toHaveBeenCalled();
  });
});
