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

import { APInodes } from '@/shared-modules/types';

// Dummy data source
export const dummyAPInodes: APInodes = {
  count: 117,
  nodes: [
    {
      id: '00000000-0000-0000-0000-000000000101',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000101',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
                available: false,
              },
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: false },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000202',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000701',
            status: { health: 'OK', state: 'Enabled' },
            type: 'Accelerator',
            powerState: 'On',
            powerCapability: true,
          },
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
                available: false,
              },
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000102',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000302',
            status: { health: 'Warning', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000401',
            status: { health: 'OK', state: 'Enabled' },
            type: 'networkInterface',
            powerState: 'On',
            powerCapability: true,
          },
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
                available: false,
              },
            },
          },
          resourceGroupIDs: ['0199a922-016c-7528-a859-6da59fe091f0'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000109',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000109',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            devicePortList: [
              { fabricID: 'fabric1', switchID: 'CXL002' },
              { fabricID: 'fabric1', switchID: 'CXL002-2' },
            ],
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000201',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            devicePortList: [
              { fabricID: 'fabric1', switchID: 'CXL002' },
              { fabricID: 'fabric1', switchID: 'CXL002-2' },
            ],
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: false },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000205',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000303',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000502',
            status: { health: 'OK', state: 'Enabled' },
            type: 'graphicController',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000110',
      resources: [
        {
          annotation: { available: false },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000110',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000501',
            status: { health: 'OK', state: 'Enabled' },
            type: 'graphicController',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000602',
            status: { health: 'OK', state: 'Enabled' },
            type: 'virtualMedia',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000111',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000111',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000217',
            status: { health: 'OK', state: 'Disabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000702',
            status: { health: 'Critical', state: 'Enabled' },
            type: 'Accelerator',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000113',
      resources: [
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000113',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000206',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000304',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000115',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000115',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000207',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000305',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000119',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000119',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000211',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000308',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0000-000000000125',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000125',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000225',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000325',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0000-000000000425',
            status: { health: 'OK', state: 'Enabled' },
            type: 'networkInterface',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000101',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000101',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: false },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000202',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000701',
            status: { health: 'OK', state: 'Enabled' },
            type: 'Accelerator',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000102',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000102',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000302',
            status: { health: 'Warning', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000401',
            status: { health: 'OK', state: 'Enabled' },
            type: 'networkInterface',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['0199a922-016c-7528-a859-6da59fe091f0'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000109',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000109',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000201',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: false },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000205',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000303',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000502',
            status: { health: 'OK', state: 'Enabled' },
            type: 'graphicController',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000110',
      resources: [
        {
          annotation: { available: false },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000110',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000501',
            status: { health: 'OK', state: 'Enabled' },
            type: 'graphicController',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000602',
            status: { health: 'OK', state: 'Enabled' },
            type: 'virtualMedia',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000111',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000111',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000217',
            status: { health: 'OK', state: 'Disabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000702',
            status: { health: 'Critical', state: 'Enabled' },
            type: 'Accelerator',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000113',
      resources: [
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000113',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000206',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000304',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000115',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000115',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000207',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000305',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000119',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000119',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000211',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000308',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0001-000000000125',
      resources: [
        {
          annotation: { available: false },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000125',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000225',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000325',
            status: { health: 'OK', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0001-000000000425',
            status: { health: 'OK', state: 'Enabled' },
            type: 'networkInterface',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0002-000000000101',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000101',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: false },
          detected: false,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000202',
            status: { health: 'OK', state: 'Enabled' },
            type: 'memory',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000701',
            status: { health: 'OK', state: 'Enabled' },
            type: 'Accelerator',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
      ],
    },
    {
      id: '00000000-0000-0000-0002-000000000102',
      resources: [
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000102',
            status: { health: 'OK', state: 'Enabled' },
            type: 'CPU',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000302',
            status: { health: 'Warning', state: 'Enabled' },
            type: 'storage',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
        },
        {
          annotation: { available: true },
          detected: true,
          device: {
            deviceID: '00000000-0000-0000-0002-000000000401',
            status: { health: 'OK', state: 'Enabled' },
            type: 'networkInterface',
            powerState: 'On',
            powerCapability: true,
          },
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
            },
          },
          resourceGroupIDs: ['0199a922-016c-7528-a859-6da59fe091f0'],
        },
      ],
    },
  ],
};
