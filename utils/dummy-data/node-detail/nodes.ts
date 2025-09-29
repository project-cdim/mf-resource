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

import { APIresourceForNodeDetail } from '@/shared-modules/types';
import { APInode } from '@/shared-modules/types';

// Dummy data source
const resourcesOrg: APIresourceForNodeDetail = {
  annotation: {
    available: true,
  },
  // nodeIDs: ['node1'],
  device: {
    deviceID: 'resTEST101',
    status: {
      health: 'OK',
      state: 'Enabled',
    },
    type: 'CPU',
    deviceSwitchInfo: 'CXLxxx',
    links: [
      {
        type: 'CPU',
        deviceID: 'xxx',
      },
    ],
    // totalCores: 8,
    // capacityMiB: 32 * 1024, // 32 GiB
    // driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, // 4 TiB
  },
  detected: true,
  resourceGroupIDs: [],
};

// dummy data
export const dummyNodeDetail: APInode = {
  id: 'dummy001',
  resources: [
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST101',
        type: 'CPU',
        totalCores: 8,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST102',
        status: {
          health: 'Warning',
          state: 'Enabled',
        },
        type: 'memory',
        capacityMiB: 32 * 1024, // 32GiB
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: [],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST103',
        status: {
          health: 'Critical',
          state: 'Enabled',
        },
        type: 'storage',
        driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, //4 TiB
      },
    },
    {
      ...resourcesOrg,
      annotation: {
        available: false,
      },
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST104',
        type: 'networkInterface',
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: [],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST105',
        type: 'CPU',
        totalCores: 16,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST106',
        status: {
          health: 'Warning',
          state: 'Enabled',
        },
        type: 'memory',
        capacityMiB: 64 * 1024,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST107',
        type: 'storage',
        driveCapacityBytes: 8 * 1024 * 1024 * 1024 * 1024,
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: [],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST108',
        type: 'CPU',
        totalCores: 8,
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST109',
        type: 'memory',
        capacityMiB: 32 * 1024, // 32GiB
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST110',
        type: 'storage',
        driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, //4 TiB
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST111',
        type: 'networkInterface',
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node1', 'node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST112',
        type: 'CPU',
        totalCores: 16,
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node1', 'node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST113',
        type: 'memory',
        capacityMiB: 64 * 1024,
      },
    },
    {
      ...resourcesOrg,
      // nodeIDs: ['node1', 'node2'],
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST114',
        type: 'storage',
        driveCapacityBytes: 8 * 1024 * 1024 * 1024 * 1024,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST115',
        type: 'CPU',
        totalCores: 8,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST116',
        type: 'memory',
        capacityMiB: 32 * 1024, // 32GiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST117',
        type: 'storage',
        driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, //4 TiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST120',
        type: 'networkInterface',
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST121',
        type: 'CPU',
        totalCores: 16,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST122',
        type: 'memory',
        capacityMiB: 64 * 1024,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST122',
        type: 'storage',
        driveCapacityBytes: 8 * 1024 * 1024 * 1024 * 1024,
      },
    },
  ],
};

// Dummy data for screen capture
// export const dummyNodeDetailForCapture: APInode = {
//   // exampleNode1: 'node10102',
//   id: 'res10102',
//   resources: [
//     {
//       annotation: { available: false },
//       // detected: true,
//       device: {
//         baseSpeedMHz: 4000,
//         deviceID: 'res10102',
//         deviceSwitchInfo: 'CXLA10',
//         links: [
//           { deviceID: 'res10203', type: 'memory' },
//           { deviceID: 'res10302', type: 'storage' },
//           { deviceID: 'res10401', type: 'networkInterface' },
//         ],
//         status: { health: 'OK', state: 'Enabled' },
//         totalCores: 2,
//         type: 'CPU',
//       },
//       resourceGroupIDs: [],
//     },
//     {
//       annotation: { available: false },
//       // detected: true,
//       device: {
//         capacityMiB: 4096,
//         deviceID: 'res10203',
//         deviceSwitchInfo: 'CXLA10',
//         links: [{ deviceID: 'res10102', type: 'CPU' }],
//         status: { health: 'OK', state: 'Enabled' },
//         type: 'memory',
//       },
//       resourceGroupIDs: [],
//     },
//     {
//       annotation: { available: true },
//       // detected: true,
//       device: {
//         deviceID: 'res10302',
//         deviceSwitchInfo: 'CXLA10',
//         driveCapacityBytes: 899527000000,
//         links: [{ deviceID: 'res10102', type: 'CPU' }],
//         status: { health: 'OK', state: 'Enabled' },
//         type: 'storage',
//       },
//       resourceGroupIDs: ['rgrpb10'],
//     },
//     {
//       annotation: { available: false },
//       // detected: true,
//       device: {
//         deviceID: 'res10401',
//         deviceSwitchInfo: 'CXLA10',
//         links: [{ deviceID: 'res10102', type: 'CPU' }],
//         status: { health: 'OK', state: 'Enabled' },
//         type: 'networkInterface',
//       },
//       resourceGroupIDs: [],
//     },
//     {
//       annotation: { available: true },
//       // detected: true,
//       device: {
//         deviceID: 'res10604',
//         deviceSwitchInfo: 'CXLA10',
//         status: { health: 'Critical', state: 'Disabled' },
//         type: 'virtualMedia',
//         links: [],
//       },
//       resourceGroupIDs: [],
//     },
//     {
//       annotation: {
//         available: false,
//       },
//       // "detected": true,
//       device: {
//         deviceID: 'res10603',
//         deviceSwitchInfo: 'CXLA10',
//         status: {
//           health: 'Warning',
//           state: 'Disabled',
//         },
//         type: 'virtualMedia',
//         links: [],
//       },
//       resourceGroupIDs: [],
//     },
//   ],
// };
