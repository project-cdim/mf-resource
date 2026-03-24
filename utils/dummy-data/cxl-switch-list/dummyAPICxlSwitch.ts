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

import { APIresource } from '@/shared-modules/types';
import { APIcxlswitches } from '@/types';

// Dummy resource data for CXL switches
const createDummyResource = (
  deviceID: string,
  type: 'CPU' | 'memory' | 'Accelerator',
  options?: {
    health?: 'OK' | 'Warning' | 'Critical';
    state?: 'Enabled' | 'Disabled';
    available?: boolean;
    deviceUnitAvailable?: boolean;
  }
): APIresource => ({
  annotation: {
    available: options?.available ?? true,
  },
  device: {
    deviceID,
    status: {
      health: options?.health ?? 'OK',
      state: options?.state ?? 'Enabled',
    },
    type,
    powerState: 'On',
    powerCapability: true,
    ...(type === 'CPU' && { totalCores: 8 }),
    ...(type === 'memory' && { capacityMiB: 32 * 1024 }),
  },
  resourceGroupIDs: [],
  detected: true,
  nodeIDs: [],
  physicalLocation: {
    rack: {
      id: '00000000-0000-0000-0000-000000000111',
      name: 'rack001',
      chassis: { id: 'ch1', name: 'Jupiter XXXXXXXX' },
    },
  },
  deviceUnit: {
    id: '00000000-0000-0000-0000-000000000333',
    annotation: {
      systemItems: {
        available: options?.deviceUnitAvailable ?? true,
      },
    },
  },
});

/** dummy data for APIcxlswitches */
export const dummyAPICxlSwitch: APIcxlswitches = {
  count: 8,
  CXLSwitches: [
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl001',
      resources: [
        createDummyResource('res001', 'CPU'),
        createDummyResource('res002', 'memory'),
        createDummyResource('res003', 'CPU', { state: 'Disabled' }),
        createDummyResource('res004', 'memory', { health: 'Warning' }),
        createDummyResource('res005', 'Accelerator', { health: 'Critical' }),
      ],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl002',
      resources: [
        createDummyResource('res006', 'CPU', { available: false }),
        createDummyResource('res007', 'memory', { deviceUnitAvailable: false }),
        createDummyResource('res008', 'Accelerator', { health: 'Warning', state: 'Disabled' }),
      ],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl003',
      resources: [
        createDummyResource('res009', 'CPU', { health: 'Critical', available: false }),
        createDummyResource('res010', 'memory', { state: 'Disabled', deviceUnitAvailable: false }),
        createDummyResource('res011', 'CPU', { health: 'Warning' }),
        createDummyResource('res012', 'memory'),
      ],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl004',
      resources: [
        createDummyResource('res013', 'CPU'),
        createDummyResource('res014', 'memory'),
        createDummyResource('res015', 'Accelerator'),
        createDummyResource('res016', 'CPU'),
        createDummyResource('res017', 'memory'),
        createDummyResource('res018', 'Accelerator'),
      ],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl005',
      resources: [],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl006',
      resources: [createDummyResource('res019', 'CPU'), createDummyResource('res020', 'memory')],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl007',
      resources: [
        createDummyResource('res021', 'CPU'),
        createDummyResource('res022', 'memory'),
        createDummyResource('res023', 'Accelerator'),
        createDummyResource('res024', 'CPU'),
      ],
    },
    {
      fabricID: 'fabric1',
      cxlSwitchID: 'cxl008',
      resources: [
        createDummyResource('res025', 'CPU'),
        createDummyResource('res026', 'memory'),
        createDummyResource('res027', 'CPU'),
      ],
    },
  ],
};
