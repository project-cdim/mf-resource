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

import { APPResource } from '@/types';

/** dummy data */
export const dummyAPPResource: APPResource[] = [
  {
    id: 'res001',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'On',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: 'deviceUnit001',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res002',
    type: 'memory',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'Off',
    resourceAvailable: 'Unavailable',
    resourceGroups: [{ name: '', id: '0001' }],
    nodeIDs: [],
    cxlSwitch: [],
    composite: '',
    placement: {
      rack: {
        id: 'rack002',
        name: 'RackB',
        chassis: { id: 'chassis002', name: 'Chassis2' },
      },
    },
  },
  {
    id: 'res003',
    type: 'networkInterface',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'PoweringOn',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis003', name: 'Chassis3' },
      },
    },
  },
  {
    id: 'res004',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'PoweringOff',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: 'deviceUnit002',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res005',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'Paused',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack003',
        name: '',
        chassis: { id: 'chassis004', name: '' },
      },
    },
  },
  {
    id: 'res006',
    type: 'CPU',
    status: 'Warning',
    state: 'Enabled',
    health: 'Warning',
    detected: true,
    powerState: 'Unknown',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack002',
        name: 'RackB',
        chassis: { id: 'chassis002', name: 'Chassis2' },
      },
    },
  },
  {
    id: 'res007',
    type: 'CPU',
    status: 'Warning',
    state: 'Enabled',
    health: 'Warning',
    detected: true,
    powerState: 'On',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: 'deviceUnit003',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res008',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'Off',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
  },
  {
    id: 'res009',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'PoweringOn',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res010',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: false,
    powerState: 'PoweringOff',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res011',
    type: 'CPU',
    status: 'OK',
    state: 'Enabled',
    health: 'OK',
    detected: true,
    powerState: 'Paused',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
  {
    id: 'res012',
    type: 'CPU',
    status: 'Critical',
    state: 'Disabled',
    health: 'OK',
    detected: false,
    powerState: 'Unknown',
    resourceAvailable: 'Available',
    resourceGroups: [{ name: 'default', id: '0001' }],
    nodeIDs: ['node001', 'node002'],
    cxlSwitch: ['cxl001'],
    composite: '',
    placement: {
      rack: {
        id: 'rack001',
        name: 'RackA',
        chassis: { id: 'chassis001', name: 'Chassis1' },
      },
    },
  },
];
