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

import { APPNode } from '@/types';

/** dummy data */
export const dummyAPPNode: APPNode[] = [
  {
    id: 'node001',
    device: {
      connected: 40,
      disabled: 4,
      warning: 3,
      critical: 2,
      resourceUnavailable: 1,
    },
  },
  {
    id: 'node002',
    device: {
      connected: 20,
      disabled: 1,
      warning: 2,
      critical: 3,
      resourceUnavailable: 4,
    },
  },
  {
    id: 'node003',
    device: {
      connected: 30,
      disabled: 0,
      warning: 1,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node004',
    device: {
      connected: 88,
      disabled: 3,
      warning: 0,
      critical: 4,
      resourceUnavailable: 8,
    },
  },
  {
    id: 'node005',
    device: {
      connected: 0,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node006',
    device: {
      connected: 55,
      disabled: 0,
      warning: 0,
      critical: 11,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node007',
    device: {
      connected: 66,
      disabled: 11,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node008',
    device: {
      connected: 33,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 11,
    },
  },
  {
    id: 'node009',
    device: {
      connected: 40,
      disabled: 0,
      warning: 1,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node010',
    device: {
      connected: 40,
      disabled: 0,
      warning: 0,
      critical: 1,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node011',
    device: {
      connected: 40,
      disabled: 1,
      warning: 0,
      critical: 0,
      resourceUnavailable: 0,
    },
  },
  {
    id: 'node012',
    device: {
      connected: 40,
      disabled: 0,
      warning: 0,
      critical: 0,
      resourceUnavailable: 1,
    },
  },
];
