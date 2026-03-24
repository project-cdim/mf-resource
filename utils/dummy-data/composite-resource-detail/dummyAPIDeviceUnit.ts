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

import { APIDeviceUnit, APIresourceForDeviceUnit } from '@/shared-modules/types';

// Base resource template for composite resource
const baseResource: Omit<APIresourceForDeviceUnit, 'device'> = {
  annotation: {
    available: true,
  },
  resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
  detected: true,
  nodeIDs: ['00000000-0000-7000-8000-000000000000'],
  physicalLocation: {
    rack: {
      id: '00000000-0000-0000-0000-000000000111',
      name: 'rack001',
      chassis: { id: 'ch1', name: 'Jupiter XXXXXXXX' },
    },
  },
};

export const GetDummyAPIDeviceUnit = (id: string) => {
  const physicalLocation = {
    rack: {
      id: '00000000-0000-0000-0000-000000000111',
      name: 'rack001',
      chassis: { id: 'ch1', name: 'Jupiter XXXXXXXX' },
    },
  };

  if (id === '00000000-0000-0000-0000-000000000888') {
    // Rack name exists / Chassis name empty
    physicalLocation.rack.chassis.name = '';
  } else if (id === '00000000-0000-0000-0000-000000000555') {
    // Rack name empty / Chassis name exists
    physicalLocation.rack.name = '';
  } else if (id === '00000000-0000-0000-0000-000000000666') {
    // Rack name empty / Chassis name empty
    physicalLocation.rack.name = '';
    physicalLocation.rack.chassis.name = '';
  }

  return {
    ...dummyAPIDeviceUnit,
    id: id,
    resources: dummyAPIDeviceUnit.resources.map((resource) => ({
      ...resource,
      physicalLocation,
    })),
  };
};

export const GetDummyAPIDeviceUnitMaintenance = (id: string) => {
  return { ...dummyAPIDeviceUnitMaintenance, id: id };
};

// Dummy data for composite resource detail
export const dummyAPIDeviceUnit: APIDeviceUnit = {
  id: 'unit001',
  annotation: {
    systemItems: {
      available: true,
    },
    userItems: {
      customField1: 'example-value',
      customField2: 123,
      customField3: true,
    },
  },
  resources: [
    {
      ...baseResource,
      device: {
        deviceID: 'res-cpu-001',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'CPU',
        devicePortList: [
          { fabricID: 'fabric2', switchID: 'CXL-switch-001' },
          { fabricID: 'fabric2', switchID: 'CXL-switch-001-2' },
        ],
        links: [
          {
            type: 'memory',
            deviceID: 'res-memory-001',
          },
        ],
        totalCores: 16,
        powerState: 'On',
        powerCapability: true,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res-memory-001',
            },
            {
              deviceID: 'res-storage-001',
            },
          ],
        },
      },
    },
    {
      ...baseResource,
      device: {
        deviceID: 'res-memory-001',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'memory',
        devicePortList: [{ switchID: 'CXL-switch-001' }],
        links: [
          {
            type: 'CPU',
            deviceID: 'res-cpu-001',
          },
        ],
        capacityMiB: 64 * 1024, // 64 GiB
        powerState: 'On',
        powerCapability: true,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res-cpu-001',
            },
          ],
        },
      },
    },
    {
      ...baseResource,
      device: {
        deviceID: 'res-storage-001',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'storage',
        devicePortList: [{ switchID: 'CXL-switch-001' }],
        links: [],
        driveCapacityBytes: 2 * 1024 * 1024 * 1024 * 1024, // 2 TiB
        powerState: 'On',
        powerCapability: true,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res-cpu-001',
            },
          ],
        },
      },
    },
  ],
};

// Dummy data for composite resource under maintenance
export const dummyAPIDeviceUnitMaintenance: APIDeviceUnit = {
  id: 'unit002',
  annotation: {
    systemItems: {
      available: false,
    },
  },
  resources: [
    {
      ...baseResource,
      annotation: {
        available: false,
      },
      detected: false,
      device: {
        deviceID: 'res-cpu-002',
        status: {
          health: 'Warning',
          state: 'StandbyOffline',
        },
        type: 'CPU',
        devicePortList: [{ switchID: 'CXL-switch-002' }],
        links: [],
        totalCores: 8,
        powerState: 'Off',
        powerCapability: true,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res-memory-002',
            },
          ],
        },
      },
    },
    {
      ...baseResource,
      annotation: {
        available: false,
      },
      device: {
        deviceID: 'res-memory-002',
        status: {
          health: 'OK',
          state: 'StandbyOffline',
        },
        type: 'memory',
        devicePortList: [{ switchID: 'CXL-switch-002' }],
        links: [],
        capacityMiB: 32 * 1024, // 32 GiB
        powerState: 'Off',
        powerCapability: true,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'res-cpu-002',
            },
          ],
        },
      },
    },
  ],
};
