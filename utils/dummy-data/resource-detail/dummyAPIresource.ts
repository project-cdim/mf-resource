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

import { APIresource, APIresources } from '@/shared-modules/types';

// Dummy data source
export const dummyAPIresource: APIresource = {
  annotation: {
    available: true,
  },
  device: {
    deviceID: 'resTEST101',
    status: {
      health: 'OK',
      state: 'Enabled',
    },
    type: 'CPU',
    devicePortList: [{ switchID: 'CXLxxx' }],
    links: [
      {
        type: 'CPU',
        deviceID: 'xxx',
      },
    ],
    totalCores: 8,
    capacityMiB: 32 * 1024, // 32 GiB
    driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, // 4 TiB
    powerState: 'On',
    powerCapability: true,
    constraints: {
      nonRemovableDevices: [
        {
          deviceID: 'string',
        },
      ],
    },
  },
  resourceGroupIDs: [],
  detected: true,
  nodeIDs: ['node01'],
  physicalLocation: {
    rack: {
      id: '00000000-0000-0000-0000-000000000111',
      name: 'rack001',
      // chassis: { id: '00000000-0000-0000-0000-000000000222', name: 'chassis001' },
      chassis: { id: 'ch1', name: 'Jupiter XXXXXXXX' },
    },
  },
  deviceUnit: {
    id: '00000000-0000-0000-0000-000000000333',
    annotation: {
      systemItems: {
        available: true,
      },
      // userItems: {
      //   [index: string]: string | number | boolean | undefined,
      // },
    },
  },
};
