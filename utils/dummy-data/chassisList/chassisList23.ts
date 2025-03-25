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

import _ from 'lodash';

import { APIChassis } from '@/types';

// dummy data
const chassisList: APIChassis[] = [];

const chassis: APIChassis = {
  id: 'ch1', // Chassis ID
  name: 'Jupiter XXXXXXXX', // Chassis Name
  modelName: 'xxxx', // Model Name
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat asperiores, culpa tempore hic rem ut at necessitatibus harum. Excepturi illo accusantium doloribus pariatur neque in voluptas repellendus ut laboriosam molestias.', // Description
  unitPosition: 1, //  UnitPosition
  facePosition: 'Rear', //  Front / Rear
  height: 1, //  Height(U)
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
      nodeIDs: [],
    },
  ],
};

const cloneChassis = (
  idNum: string,
  unitPosition: number,
  facePosition: 'Front' | 'Rear',
  height: number = 1,
  depth: 'Half' | 'Full'
) => {
  const clonedChassis = _.cloneDeep(chassis);
  clonedChassis.id += idNum;
  clonedChassis.name = idNum + '-' + clonedChassis.name;
  clonedChassis['unitPosition'] = unitPosition;
  clonedChassis['facePosition'] = facePosition;
  clonedChassis['height'] = height;
  clonedChassis['depth'] = depth;
  chassisList.push(clonedChassis);
};

cloneChassis('1', 1, 'Front', 1, 'Half');
cloneChassis('2', 1, 'Rear', 1, 'Half');
cloneChassis('3f', 2, 'Front', 1, 'Full');
cloneChassis('4r', 3, 'Rear', 1, 'Full');
cloneChassis('5f', 4, 'Front', 2, 'Full');
cloneChassis('6r', 6, 'Rear', 2, 'Full');
cloneChassis('7', 8, 'Front', 3, 'Half');
cloneChassis('8', 11, 'Front', 3, 'Half');
cloneChassis('9', 11, 'Rear', 1, 'Half');
cloneChassis('10', 14, 'Front', 3, 'Half');
cloneChassis('11', 15, 'Rear', 1, 'Half');
cloneChassis('12', 17, 'Front', 1, 'Half');
cloneChassis('13', 18, 'Rear', 1, 'Half');
cloneChassis('14', 20, 'Front', 3, 'Half');
cloneChassis('15', 22, 'Rear', 1, 'Half');
cloneChassis('16', 23, 'Front', 3, 'Half');
cloneChassis('17', 23, 'Rear', 1, 'Half');
cloneChassis('18', 24, 'Rear', 1, 'Half');
cloneChassis('19', 26, 'Front', 3, 'Half');
cloneChassis('20', 27, 'Rear', 1, 'Half');
cloneChassis('21', 28, 'Rear', 1, 'Half');
cloneChassis('22', 29, 'Front', 3, 'Half');
cloneChassis('23', 29, 'Rear', 1, 'Half');
cloneChassis('24', 31, 'Rear', 1, 'Half');
cloneChassis('25', 32, 'Front', 3, 'Half');
cloneChassis('26', 32, 'Rear', 1, 'Half');
cloneChassis('27', 33, 'Rear', 1, 'Half');
cloneChassis('28', 34, 'Rear', 1, 'Half');
cloneChassis('29', 35, 'Front', 2, 'Half');
cloneChassis('30', 36, 'Rear', 2, 'Half');
cloneChassis('31', 38, 'Front', 3, 'Half');
cloneChassis('32', 38, 'Rear', 2, 'Half');
cloneChassis('33', 41, 'Front', 2, 'Half');
cloneChassis('34', 41, 'Rear', 2, 'Half');

export { chassisList };
