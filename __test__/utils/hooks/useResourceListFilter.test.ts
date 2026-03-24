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

import { act, renderHook } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { useQueryArrayObject } from '@/shared-modules/utils/hooks';

import { dummyAPPResource } from '@/utils/dummy-data/resource-list/dummyAPPResource';
import { useResourceListFilter } from '@/utils/hooks/useResourceListFilter';
import { mockQuery } from '@/shared-modules/__test__/test-utils';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQueryArrayObject: jest.fn(),
}));

jest.mock('next-intl');

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

  test('That only resources matching the specified query (cxlSwitch) are returned', async () => {
    mockQuery('cxlSwitch', ['cxl001']);
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

  test('That only composite resources are returned when composite=["Composite"]', () => {
    mockQuery('composite', ['Composite']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const expectedCount = dummyAPPResource.filter((r) => Boolean(r.composite && r.composite !== '')).length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has composite value
    result.current.filteredRecords.forEach((record) => {
      expect(record.composite).not.toBe('');
      expect(record.composite).toBeTruthy();
    });
  });

  test('That only non-composite resources are returned when composite=["none"]', () => {
    mockQuery('composite', ['none']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    const expectedCount = dummyAPPResource.filter((r) => !r.composite || r.composite === '').length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has empty composite value
    result.current.filteredRecords.forEach((record) => {
      expect(record.composite || '').toBe('');
    });
  });

  test('That all resources are returned when both composite states are selected', () => {
    mockQuery('composite', ['Composite', 'none']);
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    expect(result.current.filteredRecords).toHaveLength(12);
  });

  test('That only resources matching the specified placement (Rack A) are returned', () => {
    mockQuery('placement', ['RackA']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    const expectedCount = dummyAPPResource.filter((r) =>
      Boolean(r.placement?.rack.name && r.placement.rack.name.includes('RackA'))
    ).length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has matching rack name
    result.current.filteredRecords.forEach((record) => {
      expect(record.placement?.rack.name).toBe('RackA');
    });
    jest.useRealTimers();
  });

  test('That only resources matching the specified placement (Chassis 2) are returned', () => {
    mockQuery('placement', ['Chassis 2']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    const expectedCount = dummyAPPResource.filter((r) =>
      Boolean(r.placement?.rack.chassis.name && r.placement.rack.chassis.name.includes('Chassis2'))
    ).length;
    expect(result.current.filteredRecords).toHaveLength(expectedCount);
    // Verify each returned record has matching chassis name
    result.current.filteredRecords.forEach((record) => {
      expect(record.placement?.rack.chassis.name).toBe('Chassis2');
    });
    jest.useRealTimers();
  });

  test('That resources without placement are filtered out when placement query is specified', () => {
    mockQuery('placement', ['Rack A']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    // res008 has no placement, so it should be excluded
    expect(result.current.filteredRecords.every((r) => r.id !== 'res008')).toBe(true);
    jest.useRealTimers();
  });

  test('That placement uses rack.id when rack.name is empty', () => {
    mockQuery('placement', ['rack003']);
    jest.useFakeTimers();
    const { result } = renderHook(() => useResourceListFilter(dummyAPPResource));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].id).toBe('res005');
    jest.useRealTimers();
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

  test('Device-specific power states are not treated as Unknown for filtering', () => {
    mockQuery('power', ['Unknown']);
    // Create test data with device-specific power states
    const recordsWithCustomState = [
      ...dummyAPPResource,
      {
        ...dummyAPPResource[0],
        id: 'res997',
        powerState: 'Reset' as any,
      },
      {
        ...dummyAPPResource[0],
        id: 'res998',
        powerState: 'Reboot' as any,
      },
    ];
    const { result } = renderHook(() => useResourceListFilter(recordsWithCustomState));

    // Should return only records with powerState='Unknown', not device-specific states
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.length).toBeGreaterThan(0);

    // Verify it includes the actual 'Unknown' state
    const hasUnknown = filteredRecords.some((r) => r.powerState === 'Unknown');
    expect(hasUnknown).toBe(true);

    // Verify it does NOT include device-specific states (Reset, Reboot)
    const hasReset = filteredRecords.some((r) => r.id === 'res997');
    const hasReboot = filteredRecords.some((r) => r.id === 'res998');
    expect(hasReset).toBe(false);
    expect(hasReboot).toBe(false);
  });

  test('Device-specific power states are not returned when filtering by other power states', () => {
    mockQuery('power', ['On']);
    const recordsWithCustomState = [
      ...dummyAPPResource,
      {
        ...dummyAPPResource[0],
        id: 'res999',
        powerState: 'Reset' as any,
      },
    ];
    const { result } = renderHook(() => useResourceListFilter(recordsWithCustomState));

    // Should only return records with powerState='On', not device-specific states
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((r) => r.powerState === 'On')).toBe(true);
    expect(filteredRecords.some((r) => r.id === 'res999')).toBe(false);
  });

  test('selectOptions.powerState includes device-specific power states without translation', () => {
    // Mock useTranslations to return false for t.has when checking 'CustomState'
    const t = (str: string) => str;
    t.has = (key: string) => key !== 'CustomState';
    (useTranslations as jest.Mock).mockReturnValue(t);

    mockQuery('', []);
    const recordsWithCustomState = [
      ...dummyAPPResource,
      {
        ...dummyAPPResource[0],
        id: 'res1000',
        powerState: 'CustomState' as any,
      },
    ];
    const { result } = renderHook(() => useResourceListFilter(recordsWithCustomState));

    const powerStateOptions = result.current.selectOptions.powerState;
    const customStateOption = powerStateOptions.find((opt) => opt.value === 'CustomState');

    expect(customStateOption).toBeDefined();
    expect(customStateOption?.label).toBe('CustomState');
  });
});
