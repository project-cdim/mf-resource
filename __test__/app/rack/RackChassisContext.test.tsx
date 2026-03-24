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

import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';

import { RackChassisProvider, useRackChassisContext } from '@/app/[lng]/rack/RackChassisContext';
import { APIrack } from '@/types';
import { dummyRack } from '@/utils/dummy-data/chassisList/chassisList';

describe('RackChassisContext', () => {
  test('throws error when used outside of RackChassisProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useRackChassisContext());
    }).toThrow('useRackChassisContext must be used within RackChassisProvider');

    consoleError.mockRestore();
  });

  test('provides default context values when rackData is undefined', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={undefined}>{children}</RackChassisProvider>,
    });

    expect(result.current.selectedChassisId).toBeUndefined();
    expect(result.current.selectedChassis).toBeUndefined();
    expect(result.current.selectedChassisResources).toEqual([]);
  });

  test('provides default context values when selectedChassisId is undefined', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    expect(result.current.selectedChassisId).toBeUndefined();
    expect(result.current.selectedChassis).toBeUndefined();
    expect(result.current.selectedChassisResources).toEqual([]);
  });

  test('sets selected chassis ID', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[0].id);
    });

    expect(result.current.selectedChassisId).toBe(dummyRack.chassis[0].id);
  });

  test('returns selected chassis when chassisId is set', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[0].id);
    });

    expect(result.current.selectedChassis).toEqual(dummyRack.chassis[0]);
  });

  test('returns resources for selected chassis with physicalLocation and deviceUnit', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[0].id);
    });

    const resources = result.current.selectedChassisResources;

    expect(resources.length).toBeGreaterThan(0);

    // Check first resource has correct structure
    expect(resources[0]).toHaveProperty('physicalLocation');
    expect(resources[0].physicalLocation).toEqual({
      rack: {
        id: dummyRack.id,
        name: dummyRack.name,
        chassis: {
          id: dummyRack.chassis[0].id,
          name: dummyRack.chassis[0].name,
        },
      },
    });
    expect(resources[0]).toHaveProperty('deviceUnit');
    expect(resources[0].deviceUnit).toHaveProperty('id');
    expect(resources[0].deviceUnit).toHaveProperty('annotation');
  });

  test('returns empty array when rackData is undefined but chassisId is set', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={undefined}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId('some-chassis-id');
    });

    expect(result.current.selectedChassisResources).toEqual([]);
  });

  test('returns empty array when selectedChassis is undefined', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId('non-existent-chassis-id');
    });

    expect(result.current.selectedChassis).toBeUndefined();
    expect(result.current.selectedChassisResources).toEqual([]);
  });

  test('updates selected chassis when chassisId changes', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    // Select first chassis
    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[0].id);
    });

    expect(result.current.selectedChassis).toEqual(dummyRack.chassis[0]);

    // Select second chassis
    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[1].id);
    });

    expect(result.current.selectedChassis).toEqual(dummyRack.chassis[1]);
  });

  test('clears selected chassis when chassisId is set to undefined', () => {
    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={dummyRack}>{children}</RackChassisProvider>,
    });

    // Select first chassis
    act(() => {
      result.current.setSelectedChassisId(dummyRack.chassis[0].id);
    });

    expect(result.current.selectedChassis).toEqual(dummyRack.chassis[0]);

    // Clear selection
    act(() => {
      result.current.setSelectedChassisId(undefined);
    });

    expect(result.current.selectedChassisId).toBeUndefined();
    expect(result.current.selectedChassis).toBeUndefined();
    expect(result.current.selectedChassisResources).toEqual([]);
  });

  test('flattens resources from all deviceUnits in selected chassis', () => {
    const mockRackData: APIrack = {
      ...dummyRack,
      chassis: [
        {
          ...dummyRack.chassis[0],
          deviceUnits: [
            {
              id: 'unit1',
              annotation: { systemItems: { available: true } },
              resources: [
                {
                  device: {
                    deviceID: 'res1',
                    type: 'CPU',
                    status: { state: 'Enabled', health: 'OK' },
                    powerState: 'On',
                    powerCapability: true,
                  },
                  resourceGroupIDs: [],
                  annotation: { available: true },
                  detected: true,
                  nodeIDs: [],
                },
              ],
            },
            {
              id: 'unit2',
              annotation: { systemItems: { available: false } },
              resources: [
                {
                  device: {
                    deviceID: 'res2',
                    type: 'memory',
                    status: { state: 'Enabled', health: 'OK' },
                    powerState: 'On',
                    powerCapability: true,
                  },
                  resourceGroupIDs: [],
                  annotation: { available: true },
                  detected: true,
                  nodeIDs: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const { result } = renderHook(() => useRackChassisContext(), {
      wrapper: ({ children }) => <RackChassisProvider rackData={mockRackData}>{children}</RackChassisProvider>,
    });

    act(() => {
      result.current.setSelectedChassisId(mockRackData.chassis[0].id);
    });

    const resources = result.current.selectedChassisResources;

    expect(resources).toHaveLength(2);
    expect(resources[0].device.deviceID).toBe('res1');
    expect(resources[0].deviceUnit.id).toBe('unit1');
    expect(resources[1].device.deviceID).toBe('res2');
    expect(resources[1].deviceUnit.id).toBe('unit2');
  });
});
