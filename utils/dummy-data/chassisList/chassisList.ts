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
    height: 1, //  Height(U)
    depth: 'Full', //  Depth
    lastUpdate: '2023-06-19T12:33:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: ['res10101'],
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
    height: 2, //  Height(U)
    depth: 'Half', //  Depth
    lastUpdate: '2023-06-20T12:33:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10102'],
      },
      {
        device: {
          deviceID: 'res10112',
          type: 'memory',
          attribute: {},
          status: {
            state: 'Starting',
            health: 'Warning',
          },
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: ['res10102'],
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
    height: 3, //  Height(U)
    depth: 'Half', //  Depth
    lastUpdate: '2023-06-29T00:00:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: ['res10102'],
      },
      {
        device: {
          deviceID: 'res10215',
          type: 'memory',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'Warning',
          },
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: ['res10102'],
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
    height: 4, //  Height(U)
    depth: 'Full', //  Depth
    lastUpdate: '2023-06-29T00:00:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10206',
          type: 'CPU',
          attribute: {},
          status: {
            state: 'Disabled',
            health: 'Critical',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10206'],
      },
      {
        device: {
          deviceID: 'res10207',
          type: 'storage',
          attribute: {},
          status: {
            state: 'Updating',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA12',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
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
    height: 1, //  Height(U)
    depth: 'Half', //  Depth
    lastUpdate: '2023-06-20T20:00:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10208',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA10',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
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
    height: 1, //  Height(U)
    depth: 'Half', //  Depth
    lastUpdate: '2023-06-23T23:00:11Z', // Last Update
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
          deviceSwitchInfo: 'CXLA10',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: true,
        },
        nodeIDs: ['res10101', 'res10102'],
      },
      {
        device: {
          deviceID: 'res10208',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [
            {
              type: 'CPU',
              deviceID: 'string',
            },
          ],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10209',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10101', 'res10102'],
      },
      {
        device: {
          deviceID: 'res10301',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10302',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10303',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10102'],
      },
      {
        device: {
          deviceID: 'res10304',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: [],
      },
      {
        device: {
          deviceID: 'res10305',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10101'],
      },
      {
        device: {
          deviceID: 'res10306',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10101'],
      },
      {
        device: {
          deviceID: 'res10307',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10101'],
      },
      {
        device: {
          deviceID: 'res10308',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10102'],
      },
      {
        device: {
          deviceID: 'res10309',
          type: 'GPU',
          attribute: {},
          status: {
            state: 'Enabled',
            health: 'OK',
          },
          deviceSwitchInfo: 'CXLA11',
          links: [],
        },
        resourceGroupIDs: ['string'],
        annotation: {
          available: false,
        },
        nodeIDs: ['res10101'],
      },
    ],
  },
];

export const dummyRack: APIrack = {
  // Rack ID
  id: 'rack1',
  // Rack Name
  name: 'rackname1',
  // Description
  description: 'xxxx',
  // Height(U)
  height: 42,
  // chassis
  chassis: chassisList,
};
