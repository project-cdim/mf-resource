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

import { APPResourceGroup } from '@/types';

/** dummy data */
export const dummyAPPResourceGroups: APPResourceGroup[] = [
  {
    id: '00000000-0000-7000-8000-000000000000',
    name: 'Resource Group 1',
    description: 'Resource Group 1 Description',
    createdAt: new Date('2021-07-01T00:00:00Z'),
    updatedAt: new Date('2021-08-12T00:00:00Z'),
  },
  {
    id: '10000000-0000-7000-8000-000000000002',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit aliquam.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus mattis neque sed ultrices. Ut in libero elementum, bibendum ipsum vitae, dapibus dui. In iaculis eu orci vitae ornare. Nunc sagittis a massa nec lobortis. Vivamus dignissim ante eget.',
    createdAt: new Date('2021-07-02T00:00:00Z'),
    updatedAt: new Date('2021-07-12T00:00:00Z'),
  },
  {
    id: '10000000-0000-7000-8000-000000000003',
    name: 'Resource Group 3',
    description: 'Resource Group 3 Description',
    createdAt: new Date('2021-07-03T00:00:00Z'),
    updatedAt: new Date('2021-07-13T00:00:00Z'),
  },
  {
    id: '20000000-0000-7000-8000-000000000004',
    name: 'Resource Group 4',
    description: 'Resource Group 4 Description',
    createdAt: new Date('2021-07-04T00:00:00Z'),
    updatedAt: new Date('2021-07-14T00:00:00Z'),
  },
  {
    id: '20000000-0000-7000-8000-000000000005',
    name: 'Resource Group 5',
    description: 'Resource Group 5 Description',
    createdAt: new Date('2021-07-05T00:00:00Z'),
    updatedAt: new Date('2021-07-15T00:00:00Z'),
  },
];
