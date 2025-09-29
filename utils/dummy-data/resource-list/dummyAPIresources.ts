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

import { APIresources } from '@/shared-modules/types';

export const dummyApiResources: APIresources = {
  count: 1,
  resources: [
    {
      annotation: {
        available: false,
      },
      detected: true,
      device: {
        deviceID: '0001',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        // @ts-ignore
        type: 'Not Default Type',
      },
      nodeIDs: ['0001'],
      resourceGroupIDs: ['10000000-0000-7000-8000-000000000001'],
    },
  ],
};
