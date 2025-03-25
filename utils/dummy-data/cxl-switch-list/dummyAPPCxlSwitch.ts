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

import { APPCxlSwitch } from '@/types';

/** dummy data */
export const dummyAPPCxlSwitch: APPCxlSwitch[] = [
  {
    id: 'cxl001',
    device: {
      connected: 40,
      unallocated: 20,
      disabled: 4,
      warning: 3,
      critical: 2,
      resourceUnavailable: 1,
    },
  },
  {
    id: 'cxl002',
    device: {
      connected: 20,
      unallocated: 10,
      disabled: 1,
      warning: 2,
      critical: 3,
      resourceUnavailable: 4,
    },
  },
  {
    id: 'cxl003',
    device: {
      connected: 30,
      unallocated: 10,
      disabled: 0,
      warning: 1,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl004',
    device: {
      connected: 88,
      unallocated: 10,
      disabled: 3,
      warning: 0,
      critical: 4,
      resourceUnavailable: 8,
    },
  },
  {
    id: 'cxl005',
    device: {
      connected: 0,
      unallocated: 0,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl006',
    device: {
      connected: 55,
      unallocated: 22,
      disabled: 0,
      warning: 0,
      critical: 11,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl007',
    device: {
      connected: 66,
      unallocated: 33,
      disabled: 11,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl008',
    device: {
      connected: 33,
      unallocated: 11,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 11,
    },
  },
  {
    id: 'cxl009',
    device: {
      connected: 40,
      unallocated: 20,
      disabled: 0,
      warning: 1,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl010',
    device: {
      connected: 40,
      unallocated: 20,
      disabled: 0,
      warning: 0,
      critical: 1,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl011',
    device: {
      connected: 40,
      unallocated: 20,
      disabled: 1,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'cxl012',
    device: {
      connected: 40,
      unallocated: 20,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 1,
    },
  },
];
