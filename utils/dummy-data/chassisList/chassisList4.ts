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

import { APIChassis } from '@/types';

// dummy data
export const chassisList: APIChassis[] = [
  {
    id: 'ch1', // Chassis ID
    name: 'Jupiter XXXXXXXX', // Chassis Name
    modelName: 'xxxx', // Model Name
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat asperiores, culpa tempore hic rem ut at necessitatibus harum. Excepturi illo accusantium doloribus pariatur neque in voluptas repellendus ut laboriosam molestias.', // Description
    unitPosition: 1, //  UnitPosition
    facePosition: 'Front', //  Front / Rear
    height: 42, //  Height(U)
    depth: 'Half', //  Depth
    lastUpdate: '2023/06/19 12:33', // Last Update
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
        detected: true,
        nodeIDs: [],
      },
    ],
  },
];
