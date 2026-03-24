/*
 * Copyright 2026 NEC Corporation.
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
import { useRackIdFromQuery } from '@/utils/hooks/useRackIdFromQuery';
import { useQuery } from '@/shared-modules/utils/hooks';

jest.mock('@/shared-modules/utils/hooks');

describe('useRackIdFromQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return both rackId and chassisId as strings', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: 'rack-1',
      chassisId: 'chassis-1',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', 'chassis-1']);
  });

  test('should return first element when rackId is array', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: ['rack-1', 'rack-2'],
      chassisId: 'chassis-1',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', 'chassis-1']);
  });

  test('should return first element when chassisId is array', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: 'rack-1',
      chassisId: ['chassis-1', 'chassis-2'],
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', 'chassis-1']);
  });

  test('should return first element when both are arrays', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: ['rack-1', 'rack-2'],
      chassisId: ['chassis-1', 'chassis-2'],
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', 'chassis-1']);
  });

  test('should return undefined for missing rackId', () => {
    (useQuery as jest.Mock).mockReturnValue({
      chassisId: 'chassis-1',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual([undefined, 'chassis-1']);
  });

  test('should return undefined for missing chassisId', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: 'rack-1',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', undefined]);
  });

  test('should return both undefined when query has no parameters', () => {
    (useQuery as jest.Mock).mockReturnValue({});

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual([undefined, undefined]);
  });

  test('should return both undefined when query is undefined', () => {
    (useQuery as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual([undefined, undefined]);
  });

  test('should return both undefined when query is null', () => {
    (useQuery as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual([undefined, undefined]);
  });

  test('should return undefined when rackId is empty string', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: '',
      chassisId: 'chassis-1',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['', 'chassis-1']);
  });

  test('should return undefined when chassisId is empty string', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: 'rack-1',
      chassisId: '',
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual(['rack-1', '']);
  });

  test('should return undefined when array is empty', () => {
    (useQuery as jest.Mock).mockReturnValue({
      rackId: [],
      chassisId: [],
    });

    const { result } = renderHook(() => useRackIdFromQuery());

    expect(result.current).toEqual([undefined, undefined]);
  });
});
