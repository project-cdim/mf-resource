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

import { APIresource, APIresources } from '@/shared-modules/types';

// Dummy data source
const resourcesOrg: APIresource = {
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
    devicePortList: [{ fabricID: 'fabric1', switchID: 'CXLxxx' }],
    links: [
      {
        type: 'CPU',
        deviceID: 'xxx',
      },
    ],
    // totalCores: 8,
    // capacityMiB: 32 * 1024, // 32 GiB
    // driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, // 4 TiB
    powerState: 'On',
    powerCapability: true,
    // constraints: {
    //   nonRemovableDevices: [
    //     {
    //       deviceID: 'string',
    //     },
    //   ],
    // },
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

// dummy data
export const dummyAPIresources: APIresources = {
  count: 100,
  resources: [
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST101',
        type: 'CPU',
        totalCores: 8,
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST102',
        type: 'memory',
        capacityMiB: 32 * 1024, // 32GiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST103',
        type: 'storage',
        driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, // 4 TiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST104',
        type: 'networkInterface',
        links: [],
      },
      nodeIDs: [],
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST105',
        type: 'CPU',
        totalCores: 16,
        links: [],
        constraints: {},
      },
      nodeIDs: [],
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST106',
        type: 'memory',
        capacityMiB: 64 * 1024,
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '11100000-0000-0000-0000-000000000111',
          name: 'rack002',
          chassis: { id: '11100000-0000-0000-0000-000000000222', name: 'chassis002' },
        },
      },
      deviceUnit: {
        id: '11100000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: true,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST107',
        type: 'storage',
        driveCapacityBytes: 8 * 1024 * 1024 * 1024 * 1024,
        links: [],
        constraints: {
          nonRemovableDevices: [],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '22200000-0000-0000-0000-000000000111',
          name: '',
          chassis: { id: '22200000-0000-0000-0000-000000000222', name: '' },
        },
      },
      deviceUnit: {
        id: '22200000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: false,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },
    {
      // Maintenance completed successfully
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST108',
        type: 'networkInterface',
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '22200000-0000-0000-0000-000000000111',
          name: '',
          chassis: { id: '22200000-0000-0000-0000-000000000222', name: '' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000444',
        annotation: {
          systemItems: {
            available: false,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },

    {
      // 404 network error
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST109',
        type: 'networkInterface',
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '22200000-0000-0000-0000-000000000111',
          name: '',
          chassis: { id: '22200000-0000-0000-0000-000000000222', name: '' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000555',
        annotation: {
          systemItems: {
            available: false,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },

    {
      // 500 error
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST110',
        type: 'networkInterface',
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: 'rackid001',
          name: '',
          chassis: { id: 'chid001', name: '' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000666',
        annotation: {
          systemItems: {
            available: false,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },

    {
      // Maintenance start → network error
      // rack name empty / chassis name exists pattern
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST111',
        type: 'networkInterface',
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '22200000-0000-0000-0000-000000000222',
          name: '',
          chassis: { id: '22200000-0000-0000-0000-000000000333', name: 'chassisName001' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000777',
        annotation: {
          systemItems: {
            available: true,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },

    {
      // Maintenance start → 500 error
      // rack name exists / chassis name empty pattern
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST112',
        type: 'networkInterface',
        devicePortList: [],
        links: [],
        constraints: {
          nonRemovableDevices: [
            {
              deviceID: 'string',
            },
          ],
        },
      },
      nodeIDs: [],
      physicalLocation: {
        rack: {
          id: '22200000-0000-0000-0000-000000000111',
          name: 'rackName001',
          chassis: { id: '22200000-0000-0000-0000-000000000333', name: '' },
        },
      },
      deviceUnit: {
        id: '00000000-0000-0000-0000-000000000888',
        annotation: {
          systemItems: {
            available: true,
          },
          // userItems: {
          //   [index: string]: string | number | boolean | undefined,
          // },
        },
      },
    },

    // Additional test data covering various states, health, and detection status
    {
      // Resource with resourceGroupIDs populated, CXL switch variant, PowerState: Off
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST201',
        type: 'networkInterface',
        devicePortList: [
          { fabricID: 'fabric1', switchID: 'CXL001aaaaaaaaaaaaaaaaaaa-dddddddddddddddddddddddddd-bbbbbbbbbbbbbbb' },
        ],
        powerState: 'Off',
        links: [],
      },
      resourceGroupIDs: ['group001', 'group002'],
      nodeIDs: [],
    },
    {
      // State: Disabled, Health: Warning, CXL switch variant, PowerState: On
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST202',
        type: 'networkInterface',
        status: {
          health: 'Warning',
          state: 'Disabled',
        },
        devicePortList: [
          { fabricID: 'fabric1', switchID: 'CXL002' },
          { fabricID: 'fabric1', switchID: 'CXL002-2' },
        ],
        //@ts-ignore
        powerState: 'Reset',
        links: [],
      },
      resourceGroupIDs: ['group003'],
      nodeIDs: ['00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000109'],
    },
    {
      // State: StandbyOffline, Health: Critical, CXL switch variant, PowerState: PoweringOff
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST203',
        type: 'networkInterface',
        status: {
          health: 'Critical',
          state: 'StandbyOffline',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL003' }],
        powerState: 'PoweringOff',
        links: [],
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      // State: StandbySpare, Health: OK, CXL switch variant, PowerState: PoweringOn
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST204',
        type: 'networkInterface',
        status: {
          health: 'OK',
          state: 'StandbySpare',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL004' }],
        powerState: 'PoweringOn',
        links: [],
      },
      resourceGroupIDs: ['group004'],
      nodeIDs: [],
    },
    {
      // State: InTest, Health: Warning, CXL switch variant, PowerState: Paused
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST205',
        type: 'networkInterface',
        status: {
          health: 'Warning',
          state: 'InTest',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL005' }],
        powerState: 'Paused',
        links: [],
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      // State: Starting, Health: Critical, CXL switch variant, PowerState: Unknown
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST206',
        type: 'networkInterface',
        status: {
          health: 'Critical',
          state: 'Starting',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL006' }],
        powerState: 'Unknown',
        links: [],
      },
      resourceGroupIDs: ['group005', 'group006'],
      nodeIDs: [],
    },
    {
      // State: Absent, Health: OK, detected: false, PowerState: Off
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST207',
        type: 'networkInterface',
        status: {
          health: 'OK',
          state: 'Absent',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL007' }],
        powerState: 'Off',
        links: [],
      },
      resourceGroupIDs: [],
      detected: false,
      nodeIDs: [],
    },
    {
      // State: UnavailableOffline, Health: Warning, detected: false, PowerState: On
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST208',
        type: 'networkInterface',
        status: {
          health: 'Warning',
          state: 'UnavailableOffline',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL008' }],
        powerState: 'On',
        links: [],
      },
      resourceGroupIDs: ['group007'],
      detected: false,
      nodeIDs: [],
    },
    {
      // State: Deferring, Health: Critical, PowerState: PoweringOff
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST209',
        type: 'networkInterface',
        status: {
          health: 'Critical',
          state: 'Deferring',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL009' }],
        powerState: 'PoweringOff',
        links: [],
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      // State: Quiesced, Health: OK, PowerState: PoweringOn
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST210',
        type: 'networkInterface',
        status: {
          health: 'OK',
          state: 'Quiesced',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL010' }],
        powerState: 'PoweringOn',
        links: [],
      },
      resourceGroupIDs: ['group008'],
      nodeIDs: [],
    },
    {
      // State: Updating, Health: Warning, PowerState: Paused
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST211',
        type: 'networkInterface',
        status: {
          health: 'Warning',
          state: 'Updating',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL011' }],
        powerState: 'Paused',
        links: [],
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      // State: Qualified, Health: Critical, PowerState: Unknown
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST212',
        // @ts-ignore
        type: 'Not Default Type',
        status: {
          health: 'Critical',
          state: 'Qualified',
        },
        devicePortList: [{ fabricID: 'fabric1', switchID: 'CXL012' }],
        powerState: 'Unknown',
        links: [],
      },
      resourceGroupIDs: ['group009', 'group010'],
      nodeIDs: [],
    },
  ],
};
