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

import { APIChassis, APIrack } from '@/types';

// dummy data
const chassisList: APIChassis[] = [
  {
    id: 'ch1', // Chassis ID
    name: 'Jupiter XXXXXXXX', // Chassis Name
    modelName: 'xxxx', // Model Name
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat asperiores, culpa tempore hic rem ut at necessitatibus harum. Excepturi illo accusantium doloribus pariatur neque in voluptas repellendus ut laboriosam molestias.', // Description
    unitPosition: 30, //  UnitPosition
    facePosition: 'Front', //  Front / Rear
    height: 1, //  Height
    depth: 'Full', //  Depth
    createdAt: '2023-06-19T12:33:11Z', // Created date and time
    updatedAt: '2023-06-19T12:33:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10101',
              type: 'CPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10101'],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
    ],
  },
  {
    id: 'ch2', // Chassis ID
    name: 'Saturn aaaaaaaa', // Chassis Name
    modelName: 'aaaa', // Model Name
    description: '', // Description
    unitPosition: 34, //  UnitPosition
    facePosition: 'Front', //  Front / Rear
    height: 2, //  Height
    depth: 'Half', //  Depth
    createdAt: '2023-06-20T12:33:11Z', // Created date and time
    updatedAt: '2023-06-20T12:33:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000334',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10102',
              type: 'CPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'Warning',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000335',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10112',
              type: 'memory',
              attribute: {},
              status: {
                state: 'Starting',
                health: 'Warning',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
              powerState: 'Off',
              powerCapability: false,
              constraints: {
                nonRemovableDevices: [
                  {
                    deviceID: 'string',
                  },
                ],
              },
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
    ],
  },
  {
    id: 'ch3', // Chassis ID
    name: 'Mars YYYYYYY', // Chassis Name
    modelName: 'yyyy', // Model Name
    description: '', // Description
    unitPosition: 38, //  UnitPosition
    facePosition: 'Rear', //  Front / Rear
    height: 3, //  Height
    depth: 'Half', //  Depth
    createdAt: '2023-06-29T00:00:11Z', // Created date and time
    updatedAt: '2023-07-30T00:00:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000336',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10205',
              type: 'memory',
              attribute: {},
              status: {
                state: 'InTest',
                health: 'Critical',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000337',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10215',
              type: 'memory',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'Warning',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
              powerState: 'Unknown',
              powerCapability: false,
              constraints: {
                nonRemovableDevices: [
                  {
                    deviceID: 'string',
                  },
                ],
              },
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
    ],
  },
  {
    id: 'ch4', // Chassis ID
    name: 'Venus ZZZZZZZZZ', // Chassis Name
    modelName: 'zzzz', // Model Name
    description: '', // Description
    unitPosition: 20, //  UnitPosition
    facePosition: 'Rear', //  Front / Rear
    height: 4, //  Height
    depth: 'Full', //  Depth
    createdAt: '2023-06-29T00:00:11Z', // Created date and time
    updatedAt: '2023-06-29T00:00:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000338',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10205',
              type: 'memory',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000339',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10206',
              type: 'CPU',
              attribute: {},
              status: {
                state: 'Disabled',
                health: 'Critical',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10206'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000340',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10207',
              type: 'storage',
              attribute: {},
              status: {
                state: 'Updating',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA12' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
              powerState: 'Off',
              powerCapability: false,
              constraints: {
                nonRemovableDevices: [
                  {
                    deviceID: 'string',
                  },
                ],
              },
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
      {
        id: 'CXLA11',
      },
      {
        id: 'CXLA12',
      },
    ],
  },
  {
    id: 'ch5', // Chassis ID
    name: 'Uranus oooooooooooooooooooo', // Chassis Name
    modelName: 'pppp', // Model Name
    description: 'xxxxxx', // Description
    unitPosition: 27, //  UnitPosition
    facePosition: 'Front', //  Front / Rear
    height: 1, //  Height
    depth: 'Half', //  Depth
    createdAt: '2023-06-20T20:00:11Z', // Created date and time
    updatedAt: '2023-06-20T20:00:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000341',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10207',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
              powerState: 'Unknown',
              powerCapability: false,
              constraints: {
                nonRemovableDevices: [
                  {
                    deviceID: 'string',
                  },
                ],
              },
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000342',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10208',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
    ],
  },
  {
    id: 'ch6', // Chassis ID
    name: 'Neptune oooooooooooooooooooo', // Chassis Name
    modelName: 'pppp', // Model Name
    description: 'xxxxxx', // Description
    unitPosition: 34, //  UnitPosition
    facePosition: 'Rear', //  Front / Rear
    height: 1, //  Height
    depth: 'Half', //  Depth
    createdAt: '2023-06-23T23:00:11Z', // Created date and time
    updatedAt: '2023-06-23T23:00:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000343',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10207',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [],
              powerState: 'On',
              powerCapability: true,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10101', 'res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000344',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10208',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
              powerState: 'Off',
              powerCapability: false,
              constraints: {
                nonRemovableDevices: [
                  {
                    deviceID: 'string',
                  },
                ],
              },
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000345',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10209',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Off',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10101', 'res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000346',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10301',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Unknown',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000347',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10302',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'On',
              powerCapability: true,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000348',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10303',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'On',
              powerCapability: true,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000349',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10304',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Off',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: [],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000350',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10305',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Unknown',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10101'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000351',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10306',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'On',
              powerCapability: true,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10101'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000352',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10307',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'On',
              powerCapability: true,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10101'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000353',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10308',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Off',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: true,
            nodeIDs: ['res10102'],
          },
        ],
      },
      {
        id: '00000000-0000-0000-0000-000000000354',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10309',
              type: 'GPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'OK',
              },
              devicePortList: [{ switchID: 'CXLA11' }],
              links: [],
              powerState: 'Unknown',
              powerCapability: false,
              constraints: {},
            },
            resourceGroupIDs: ['string'],
            annotation: {
              available: false,
            },
            detected: false,
            nodeIDs: ['res10101'],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
      {
        id: 'CXLA11',
      },
    ],
  },
  {
    id: 'ch8', // Chassis ID
    name: 'Test XXXXXXXX', // Chassis Name
    modelName: 'yyyy', // Model Name
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat asperiores, culpa tempore hic rem ut at necessitatibus harum. Excepturi illo accusantium doloribus pariatur neque in voluptas repellendus ut laboriosam molestias.', // Description
    unitPosition: 15, //  UnitPosition
    facePosition: 'Front', //  Front / Rear
    height: 1, //  Height
    depth: 'Full', //  Depth
    createdAt: '2023-06-19T12:33:11Z', // Created date and time
    updatedAt: '2023-06-19T12:33:11Z', // Updated date and time
    deviceUnits: [
      {
        id: '00000000-0000-0000-0000-000000000333',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            device: {
              deviceID: 'res10101',
              type: 'CPU',
              attribute: {},
              status: {
                state: 'Enabled',
                health: 'Critical',
              },
              devicePortList: [{ switchID: 'CXLA10' }],
              links: [
                {
                  type: 'CPU',
                  deviceID: 'string',
                },
              ],
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
            resourceGroupIDs: ['string'],
            annotation: {
              available: true,
            },
            detected: true,
            nodeIDs: ['res10101'],
          },
        ],
      },
    ],
    CXLSwitches: [
      {
        id: 'CXLA10',
      },
    ],
  },
];

export const dummyRack: APIrack = {
  // Rack ID
  id: 'rack001',
  // Rack Name
  name: 'rackname1',
  // Height(U) - Rack unit count
  height: 42,
  // chassis
  chassis: chassisList,
};

export const dummyRack111 = {
  id: '00000000-0000-0000-0000-000000000111',
  name: 'rack001', // rack name defined
  height: 42,
  chassis: [
    {
      id: 'ch1',
      name: 'Jupiter XXXXXXXX',
      modelName: '',
      description: '',
      unitPosition: 1,
      facePosition: 'Front',
      height: 1,
      depth: 'Half',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      deviceUnits: [],
      CXLSwitches: [],
    },
  ],
};

// Dummy rack where rack name is empty but chassis name is defined
export const dummyRack222 = {
  id: '11100000-0000-0000-0000-000000000111',
  name: '', // rack name intentionally empty
  height: 42,
  chassis: [
    {
      id: '11100000-0000-0000-0000-000000000222',
      name: 'ch2', // chassis name defined
      modelName: '',
      description: '',
      unitPosition: 1,
      facePosition: 'Rear',
      height: 1,
      depth: 'Half',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      deviceUnits: [],
      CXLSwitches: [],
    },
  ],
};
