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

import { APIResourceGroup, APIResourceGroups } from '@/types';

/** dummy data */
export const dummyAPIResourceGroup1: APIResourceGroup = {
  id: '00000000-0000-7000-8000-000000000000',
  name: 'Resource Group 1',
  description: 'Resource Group 1 Description',
  createdAt: '2021-07-01T00:00:00Z',
  updatedAt: '2021-07-01T00:00:00Z',
  resources: [
    {
      device: {
        deviceID: '1',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
      },
      resourceGroupIDs: ['1'],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: ['1'],
    },
    {
      device: {
        deviceID: '2',
        type: 'GPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
      },
      resourceGroupIDs: ['1'],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: ['2'],
    },
  ],
};

export const dummyAPIResourceGroup2: APIResourceGroup = {
  id: '00000000-0000-7000-8000-000000000002',
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit aliquam.',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus mattis neque sed ultrices. Ut in libero elementum, bibendum ipsum vitae, dapibus dui. In iaculis eu orci vitae ornare. Nunc sagittis a massa nec lobortis. Vivamus dignissim ante eget.',
  createdAt: '2021-07-01T00:00:00Z',
  updatedAt: '2021-07-01T00:00:00Z',
  resources: [
    {
      device: {
        deviceID: '3',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
      },
      resourceGroupIDs: ['2'],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: ['3'],
    },
    {
      device: {
        deviceID: '4',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
      },
      resourceGroupIDs: ['2'],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: ['4'],
    },
  ],
};

export const dummyAPIResourceGroups: APIResourceGroups = {
  count: 2,
  resourceGroups: [dummyAPIResourceGroup1, dummyAPIResourceGroup2],
};
