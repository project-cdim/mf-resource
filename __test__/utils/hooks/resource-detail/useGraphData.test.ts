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
import useSWRImmutable from 'swr/immutable';
import dayjs from 'dayjs';

import { APIresource } from '@/shared-modules/types';
import { useGraphData } from '@/utils/hooks/resource-detail/useGraphData';
import { getStepFromRange } from '@/shared-modules/utils';

// Mock dependencies
jest.mock('swr/immutable');
jest.mock('dayjs', () => {
  const actual = jest.requireActual('dayjs');
  const mockDayjs = jest.fn().mockImplementation((...args) => {
    const instance = actual(...args);
    // Add mocked isSame method to the dayjs instance
    instance.isSame = jest.fn().mockReturnValue(false); // Default to false
    return instance;
  });

  // Copy all properties from actual dayjs
  Object.assign(mockDayjs, actual);

  // Add mocked prototype to allow manipulation in tests
  mockDayjs.prototype = {
    ...actual.prototype,
    isSame: jest.fn().mockReturnValue(false),
  };

  return mockDayjs;
});
jest.mock('@/shared-modules/utils', () => ({
  fetcherForPromqlByPost: jest.fn(),
  getStepFromRange: jest.fn().mockReturnValue('1h'),
  createPromQLParams: jest.fn().mockImplementation((query, start, end, step) => {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('start', start || '');
    params.append('end', end || '');
    params.append('step', step);
    return params;
  }),
}));
jest.mock('@/shared-modules/types', () => ({
  isAPIDeviceType: jest.fn().mockReturnValue(true), // Default to true
}));

// Sample mock data for different device types
const mockMemoryResource: APIresource = {
  device: {
    deviceID: 'memory-123',
    type: 'memory',
    capacityMiB: 16384, // 16GB in MiB
    // Other properties as needed
  },
  // Other required properties
} as APIresource;

const mockStorageResource: APIresource = {
  device: {
    deviceID: 'storage-123',
    type: 'storage',
    driveCapacityBytes: 1000000000000, // 1TB in bytes
    // Other properties as needed
  },
  // Other required properties
} as APIresource;

const mockNetworkInterfaceResource: APIresource = {
  device: {
    deviceID: 'network-123',
    type: 'networkInterface',
    // Other properties as needed
  },
  // Other required properties
} as APIresource;

const mockCPUResource: APIresource = {
  device: {
    deviceID: 'cpu-123',
    type: 'CPU',
    // Other properties as needed
  },
  // Other required properties
} as APIresource;

const mockGraphData = {
  status: 'success',
  data: {
    resultType: 'matrix',
    result: [
      {
        metric: { data_label: 'memory_usage' },
        values: [[1625097600, '45.5']],
      },
    ],
  },
};

describe('useGraphData', () => {
  // Mock dates
  const metricStartDate = '2023-07-01T00:00:00.000Z';
  const metricEndDate = '2023-07-02T00:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: mockGraphData,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    // Reset createPromQLParams mock to default behavior
    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation((...args: any[]) => {
      const [query, start, end, step] = args;
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      params.append('end', end || '');
      params.append('step', step);
      return params;
    });
  });

  test('returns null SWR key when data is undefined', () => {
    // Call the hook with undefined data
    const { result } = renderHook(() => useGraphData(undefined, metricStartDate, metricEndDate));

    // useSWRImmutable should be called with null key
    expect(useSWRImmutable).toHaveBeenCalledWith(null, expect.any(Function));

    // Also verify that the hook returns the expected result structure even with null data
    expect(result.current).toHaveProperty('graphData');
    expect(result.current).toHaveProperty('graphError');
    expect(result.current).toHaveProperty('graphValidating');
    expect(result.current).toHaveProperty('graphMutate');
  });

  test('returns correct query for memory device type', () => {
    renderHook(() => useGraphData(mockMemoryResource, metricStartDate, metricEndDate));

    // Check that useSWRImmutable is called with appropriate key array
    const swrCall = (useSWRImmutable as jest.Mock).mock.calls[0][0];
    expect(swrCall).toEqual([
      `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`,
      expect.stringContaining('memory_metricEnergyJoules_reading'),
      metricStartDate,
      metricEndDate,
      '1h',
    ]);

    // Verify that the query includes memory-specific calculation
    expect(swrCall[1]).toContain('memory_usedMemory');
    expect(swrCall[1]).toContain('16384*1024');
  });

  test('returns correct query for storage device type', () => {
    renderHook(() => useGraphData(mockStorageResource, metricStartDate, metricEndDate));

    // Check that useSWRImmutable is called with appropriate key array
    const swrCall = (useSWRImmutable as jest.Mock).mock.calls[0][0];
    expect(swrCall[1]).toContain('storage_disk_amountUsedDisk');
    expect(swrCall[1]).toContain('1000000000000');
  });

  test('returns correct query for networkInterface device type', () => {
    renderHook(() => useGraphData(mockNetworkInterfaceResource, metricStartDate, metricEndDate));

    // Check that useSWRImmutable is called with appropriate key array
    const swrCall = (useSWRImmutable as jest.Mock).mock.calls[0][0];
    expect(swrCall[1]).toContain('networkInterface_networkInterfaceInformation_networkTraffic_bytesSent');
    expect(swrCall[1]).toContain('networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv');
    expect(swrCall[1]).toContain('rate(');
  });

  test('returns correct query for default device type (CPU)', () => {
    renderHook(() => useGraphData(mockCPUResource, metricStartDate, metricEndDate));

    // Check that useSWRImmutable is called with appropriate key array
    const swrCall = (useSWRImmutable as jest.Mock).mock.calls[0][0];
    expect(swrCall[1]).toContain('CPU_usageRate');
  });

  test('uses current date for end time when end date is today', () => {
    // Mock current date
    const today = dayjs().format('YYYY-MM-DD');
    const todayDate = `${today}T12:00:00.000Z`;
    const currentISOString = '2023-07-11T12:34:56.789Z';

    // Mock createPromQLParams to capture the behavior
    const mockCreatePromQLParams = jest.fn().mockImplementation((...args: any[]) => {
      const [query, start, , step] = args; // end is not used in this test
      // Simulate the behavior of createPromQLParams when end date is today
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      // When dayjs().isSame() returns true, createPromQLParams should use new Date().toISOString()
      params.append('end', currentISOString);
      params.append('step', step);
      return params;
    });

    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation(mockCreatePromQLParams);

    // Setup fetcherForPromqlByPost mock
    const fetcherForPromqlByPostMock = jest.fn();
    jest
      .spyOn(require('@/shared-modules/utils'), 'fetcherForPromqlByPost')
      .mockImplementation(fetcherForPromqlByPostMock);

    // Set dayjs mock to return true for isSame
    (dayjs as jest.MockedFunction<typeof dayjs>).mockImplementation((...args) => {
      const instance = jest.requireActual('dayjs')(...args);
      instance.isSame = jest.fn().mockReturnValue(true);
      return instance;
    });

    renderHook(() => useGraphData(mockCPUResource, metricStartDate, todayDate));

    // Get the fetcher function
    const fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];

    // Call the fetcher function manually with the complete SWR key array
    const swrKey = (useSWRImmutable as jest.Mock).mock.calls[0][0];
    fetcherFn(swrKey);

    // Verify that createPromQLParams was called with the correct parameters
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      metricStartDate,
      todayDate,
      '1h'
    );

    // Verify that fetcherForPromqlByPost was called with the result
    expect(fetcherForPromqlByPostMock).toHaveBeenCalled();
    const searchParams = fetcherForPromqlByPostMock.mock.calls[0][1];
    expect(searchParams.get('end')).toBe(currentISOString);
  });

  test('uses provided end date when end date is not today', () => {
    // Mock createPromQLParams to verify the correct parameters are passed
    const mockCreatePromQLParams = jest.fn().mockImplementation((...args: any[]) => {
      const [query, start, end, step] = args;
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      params.append('end', end || '');
      params.append('step', step);
      return params;
    });

    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation(mockCreatePromQLParams);

    // Setup fetcherForPromqlByPost mock
    const fetcherForPromqlByPostMock = jest.fn();
    jest
      .spyOn(require('@/shared-modules/utils'), 'fetcherForPromqlByPost')
      .mockImplementation(fetcherForPromqlByPostMock);

    // Set dayjs mock to return false for isSame
    (dayjs as jest.MockedFunction<typeof dayjs>).mockImplementation((...args) => {
      const instance = jest.requireActual('dayjs')(...args);
      instance.isSame = jest.fn().mockReturnValue(false);
      return instance;
    });

    renderHook(() => useGraphData(mockCPUResource, metricStartDate, metricEndDate));

    // Get the fetcher function
    const fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];

    // Call the fetcher function manually
    fetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

    // Verify that createPromQLParams was called with the original metricEndDate
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      metricStartDate,
      metricEndDate,
      '1h'
    );

    // Verify that the end date in the URLSearchParams is the original metricEndDate
    const searchParamsArg = fetcherForPromqlByPostMock.mock.calls[0][1];
    expect(searchParamsArg.get('end')).toBe(metricEndDate);
  });

  test('returns graph data, error, validating state and mutate function', () => {
    const { result } = renderHook(() => useGraphData(mockCPUResource, metricStartDate, metricEndDate));

    expect(result.current.graphData).toBe(mockGraphData);
    expect(result.current.graphError).toBeNull();
    expect(result.current.graphValidating).toBe(false);
    expect(typeof result.current.graphMutate).toBe('function');
  });
  test('passes correct step from getStepFromRange', () => {
    renderHook(() => useGraphData(mockCPUResource, metricStartDate, metricEndDate));

    expect(getStepFromRange).toHaveBeenCalledWith(metricStartDate, metricEndDate);
  });

  test('handles undefined or null start/end dates', () => {
    // Mock createPromQLParams to verify behavior with undefined/null dates
    const mockCreatePromQLParams = jest.fn().mockImplementation((...args: any[]) => {
      const [query, start, end, step] = args;
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      params.append('end', end || '');
      params.append('step', step);
      return params;
    });

    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation(mockCreatePromQLParams);

    const fetcherForPromqlByPostMock = jest.fn();
    jest
      .spyOn(require('@/shared-modules/utils'), 'fetcherForPromqlByPost')
      .mockImplementation(fetcherForPromqlByPostMock);

    // Test with undefined start date
    renderHook(() => useGraphData(mockCPUResource, undefined as unknown as string, metricEndDate));

    // Get the fetcher function
    let fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];

    // Call the fetcher function manually
    fetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

    // Verify that createPromQLParams was called with undefined start
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      undefined,
      metricEndDate,
      '1h'
    );

    // Check that start date defaults to empty string in URLSearchParams
    let searchParamsArg = fetcherForPromqlByPostMock.mock.calls[0][1];
    expect(searchParamsArg.get('start')).toBe('');
    expect(searchParamsArg.get('query')).toContain('CPU_metricEnergyJoules_reading');
    expect(searchParamsArg.get('query')).toContain('CPU_usageRate');
    expect(searchParamsArg.get('step')).toBe('1h');

    // Test with null end date
    jest.clearAllMocks();
    renderHook(() => useGraphData(mockCPUResource, metricStartDate, null as unknown as string));

    // Get the fetcher function
    fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];

    // Call the fetcher function manually
    fetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

    // Verify that createPromQLParams was called with null end
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      metricStartDate,
      null,
      '1h'
    );

    // Check that end date defaults to empty string in URLSearchParams
    searchParamsArg = fetcherForPromqlByPostMock.mock.calls[0][1];
    expect(searchParamsArg.get('end')).toBe('');

    // Test with both undefined dates
    jest.clearAllMocks();
    renderHook(() => useGraphData(mockCPUResource, undefined as unknown as string, undefined as unknown as string));

    // Get the fetcher function and call it
    const testFetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];
    testFetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

    // Verify that createPromQLParams was called with both undefined dates
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      undefined,
      undefined,
      '1h'
    );

    // Verify that the fetcher function has created all necessary params
    const testParams = fetcherForPromqlByPostMock.mock.calls[0][1];
    expect(testParams.has('query')).toBe(true);
    expect(testParams.has('start')).toBe(true);
    expect(testParams.has('end')).toBe(true);
    expect(testParams.has('step')).toBe(true);
    expect(testParams.get('start')).toBe('');
    expect(testParams.get('end')).toBe('');
  });

  test('returns null key when device type is not valid', () => {
    // Create a resource with invalid device type
    const invalidResource = {
      ...mockCPUResource,
      device: {
        ...mockCPUResource.device,
        type: 'invalidType', // Not a valid APIDeviceType
      },
    } as unknown as APIresource;

    // Mock isAPIDeviceType to return false
    jest.spyOn(require('@/shared-modules/types'), 'isAPIDeviceType').mockReturnValue(false);

    renderHook(() => useGraphData(invalidResource, metricStartDate, metricEndDate));

    // useSWRImmutable should be called with null key
    expect(useSWRImmutable).toHaveBeenCalledWith(null, expect.any(Function));
  });

  test('verifies createPromQLParams is called with correct parameters for each device type', () => {
    const mockCreatePromQLParams = jest.fn().mockImplementation((...args: any[]) => {
      const [query, start, end, step] = args;
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      params.append('end', end || '');
      params.append('step', step);
      return params;
    });

    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation(mockCreatePromQLParams);
    jest.spyOn(require('@/shared-modules/utils'), 'fetcherForPromqlByPost').mockImplementation(jest.fn());

    // Test each device type
    const testCases = [
      { resource: mockCPUResource, expectedQueryPart: 'CPU_usageRate' },
      { resource: mockMemoryResource, expectedQueryPart: 'memory_usedMemory' },
      { resource: mockStorageResource, expectedQueryPart: 'storage_disk_amountUsedDisk' },
      {
        resource: mockNetworkInterfaceResource,
        expectedQueryPart: 'networkInterface_networkInterfaceInformation_networkTraffic',
      },
    ];

    testCases.forEach(({ resource, expectedQueryPart }) => {
      jest.clearAllMocks();

      renderHook(() => useGraphData(resource, metricStartDate, metricEndDate));

      // Get the fetcher function and call it
      const fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];
      fetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

      // Verify createPromQLParams was called with correct parameters
      expect(mockCreatePromQLParams).toHaveBeenCalledWith(
        expect.stringContaining(expectedQueryPart),
        metricStartDate,
        metricEndDate,
        '1h'
      );

      // Also verify it contains energy query part
      expect(mockCreatePromQLParams).toHaveBeenCalledWith(
        expect.stringContaining(`${resource.device.type}_metricEnergyJoules_reading`),
        metricStartDate,
        metricEndDate,
        '1h'
      );
    });
  });

  test('verifies createPromQLParams handles edge cases correctly', () => {
    const mockCreatePromQLParams = jest.fn().mockImplementation((...args: any[]) => {
      const [query, start, end, step] = args;
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('start', start || '');
      params.append('end', end || '');
      params.append('step', step);
      return params;
    });

    jest.spyOn(require('@/shared-modules/utils'), 'createPromQLParams').mockImplementation(mockCreatePromQLParams);
    jest.spyOn(require('@/shared-modules/utils'), 'fetcherForPromqlByPost').mockImplementation(jest.fn());

    // Test with empty string dates
    renderHook(() => useGraphData(mockCPUResource, '', ''));

    const fetcherFn = (useSWRImmutable as jest.Mock).mock.calls[0][1];
    fetcherFn([`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`]);

    // Verify createPromQLParams was called with empty strings
    expect(mockCreatePromQLParams).toHaveBeenCalledWith(
      expect.stringContaining('CPU_metricEnergyJoules_reading'),
      '',
      '',
      '1h'
    );
  });
});
