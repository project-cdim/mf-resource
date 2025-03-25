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

cloneChassis('1', 1, 'Front', 4, 'Half');
cloneChassis('2', 1, 'Rear', 2, 'Half');
cloneChassis('3', 3, 'Rear', 1, 'Half');
cloneChassis('4', 4, 'Rear', 1, 'Half');
cloneChassis('5', 5, 'Front', 4, 'Half');
cloneChassis('6', 5, 'Rear', 2, 'Half');
cloneChassis('7', 7, 'Rear', 2, 'Half');
cloneChassis('8', 9, 'Rear', 3, 'Half');
cloneChassis('9', 12, 'Front', 1, 'Half');
cloneChassis('10', 12, 'Rear', 3, 'Half');
cloneChassis('11', 16, 'Front', 1, 'Half');
cloneChassis('12', 15, 'Rear', 3, 'Half');
cloneChassis('13', 18, 'Rear', 1, 'Half');
cloneChassis('14', 19, 'Front', 1, 'Half');
cloneChassis('15', 23, 'Front', 1, 'Half');
cloneChassis('16', 21, 'Rear', 3, 'Half');
cloneChassis('17', 24, 'Front', 1, 'Half');
cloneChassis('18', 24, 'Rear', 3, 'Half');
cloneChassis('19', 25, 'Front', 1, 'Half');
cloneChassis('20', 27, 'Rear', 3, 'Half');
cloneChassis('21', 28, 'Front', 1, 'Half');
cloneChassis('22', 29, 'Front', 1, 'Half');
cloneChassis('23', 30, 'Front', 1, 'Half');
cloneChassis('24', 30, 'Rear', 3, 'Half');
cloneChassis('25', 32, 'Front', 1, 'Half');
cloneChassis('26', 33, 'Front', 1, 'Half');
cloneChassis('27', 33, 'Rear', 3, 'Half');
cloneChassis('28', 34, 'Front', 1, 'Half');
cloneChassis('29', 35, 'Front', 1, 'Half');
cloneChassis('30', 36, 'Rear', 2, 'Half');
cloneChassis('31', 37, 'Front', 2, 'Half');
cloneChassis('32', 39, 'Front', 2, 'Half');
cloneChassis('33', 39, 'Rear', 3, 'Half');

export { chassisList };
