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

import { HttpResponse, http } from 'msw';

import { dummyQuery } from '@/shared-modules/utils/dummy-data/PromQL/query';
import { dummyQueryRange } from '@/shared-modules/utils/dummy-data/PromQL/query_range';

import { dummyRack, dummyRack111, dummyRack222 } from '@/utils/dummy-data/chassisList/chassisList';
// import {
//   dummyAPIDeviceUnit,
//   dummyAPIDeviceUnitMaintenance,
// } from '@/utils/dummy-data/composite-resource-detail/dummyAPIDeviceUnit';
import {
  GetDummyAPIDeviceUnit,
  GetDummyAPIDeviceUnitMaintenance,
} from '@/utils/dummy-data/composite-resource-detail/dummyAPIDeviceUnit';
import { dummyAPIresources } from '@/utils/dummy-data/resource-list/dummyAPIresources';
import { dummyNodeDetail } from '@/utils/dummy-data/node-detail/nodes';
import { dummyAPInodes } from '@/utils/dummy-data/node-list/dummyAPINode';
import {
  dummyAPIResourceGroup1,
  dummyAPIResourceGroups,
} from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';
// import { dummyApiResources } from '@/utils/dummy-data/resource-list/dummyAPIresources';

import { dummyAPICxlSwitch } from '@/utils/dummy-data/cxl-switch-list/dummyAPICxlSwitch';

const configManagerUrl = process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER;
const performanceManagerUrl = process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER;

// ===== Racks Handlers =====
// Endpoints: GET /racks/:rackid
const racksHandlers = [
  http.get(`${configManagerUrl}/racks/:rackid?detail=true`, ({ params }) => {
    const { rackid } = params;

    if (rackid === dummyRack111.id) {
      return HttpResponse.json(dummyRack111);
    } else if (rackid === dummyRack222.id) {
      return HttpResponse.json(dummyRack222);
    }
    return HttpResponse.json(dummyRack);
  }),
];

// ===== CXL Switches Handlers =====
// Endpoints: GET /cxlswitches
const cxlSwitchesHandlers = [
  http.get(`${configManagerUrl}/cxlswitches`, () => {
    return HttpResponse.json(dummyAPICxlSwitch);
  }),
];

// ===== Device Units Handlers =====
// Endpoints: GET /device-units/:id, PUT /device-units/:id/annotation/system-items
const deviceUnitsHandlers = [
  http.get(`${configManagerUrl}/device-units/:id`, ({ params }) => {
    const { id } = params;
    if (
      id === 'unit001' ||
      id === '00000000-0000-0000-0000-000000000333' ||
      id === '00000000-0000-0000-0000-000000000555' ||
      id === '00000000-0000-0000-0000-000000000666' ||
      id === '00000000-0000-0000-0000-000000000777' ||
      id === '00000000-0000-0000-0000-000000000888'
    ) {
      return HttpResponse.json(GetDummyAPIDeviceUnit(id));
    }
    if (
      id === 'unit002' ||
      id === '11100000-0000-0000-0000-000000000333' ||
      id === '00000000-0000-0000-0000-000000000444'
    ) {
      return HttpResponse.json(GetDummyAPIDeviceUnitMaintenance(id));
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.put(`${configManagerUrl}/device-units/:id/annotation/system-items`, async ({ params, request }) => {
    const { id } = params;
    if (
      id === 'unit001' ||
      id === '00000000-0000-0000-0000-000000000333' ||
      id === '00000000-0000-0000-0000-000000000444'
    ) {
      const body = (await request.json()) as { available: boolean };
      return HttpResponse.json(
        {
          available: body.available,
        },
        { status: 200 }
      );
    }
    if (id === '11100000-0000-0000-0000-000000000333') {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: 'The "available" field is required',
        },
        { status: 400 }
      );
    }

    if (id === '00000000-0000-0000-0000-000000000555' || id === '00000000-0000-0000-0000-000000000777') {
      return HttpResponse.json(
        {
          code: '',
          message: 'NETWORK_ERROR',
          details: '',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        code: 'ERROR',
        message: 'Error',
        details: 'Error',
      },
      { status: 500 }
    );
  }),
];

// ===== Resources Handlers =====
// Endpoints: GET /resources/:resourceid, GET /resources?detail=true
const resourcesHandlers = [
  http.get(`${configManagerUrl}/resources/:resourceid`, ({ params }) => {
    const { resourceid } = params;
    console.log(resourceid);
    const resource = dummyAPIresources.resources.find((r) => r.device.deviceID === resourceid);

    if (resource) {
      return HttpResponse.json(resource);
    }

    // Resource not found
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${configManagerUrl}/resources?detail=true`, () => {
    return HttpResponse.json(dummyAPIresources);
  }),
];

// ===== Resource Groups Handlers =====
// Endpoints: GET /resource-groups, GET /resource-groups/:groupid
const resourceGroupsHandlers = [
  http.get(`${configManagerUrl}/resource-groups`, () => {
    return HttpResponse.json(dummyAPIResourceGroups);
  }),

  http.get(`${configManagerUrl}/resource-groups/:groupid`, () => {
    return HttpResponse.json(dummyAPIResourceGroup1);
  }),
];

// ===== Nodes Handlers =====
// Endpoints: GET /nodes/:nodeid, GET /nodes
const nodesHandlers = [
  http.get(`${configManagerUrl}/nodes/:nodeid`, ({ params }) => {
    const { nodeid } = params;
    const node = dummyAPInodes.nodes.find((n) => n.id === nodeid);

    if (node) {
      return HttpResponse.json(node);
    }

    // Node not found in dummyAPInodes, return default
    return HttpResponse.json(dummyNodeDetail);
  }),

  http.get(`${configManagerUrl}/nodes`, () => {
    return HttpResponse.json(dummyAPInodes);
  }),
];

// ===== Performance Manager Handlers =====
// Endpoints: GET /query_range, POST /query_range, GET /query
const performanceHandlers = [
  http.get(`${performanceManagerUrl}/query_range`, () => {
    return HttpResponse.json(dummyQueryRange);
  }),
  http.post(`${performanceManagerUrl}/query_range`, () => {
    return HttpResponse.json(dummyQueryRange);
  }),
  http.get(`${performanceManagerUrl}/query`, () => {
    return HttpResponse.json(dummyQuery);
  }),
];

// Default export for backward compatibility
export const handlers = [
  ...racksHandlers,
  ...cxlSwitchesHandlers,
  ...deviceUnitsHandlers,
  ...resourcesHandlers,
  ...resourceGroupsHandlers,
  ...nodesHandlers,
  ...performanceHandlers,
];

/**
 * Create handlers based on configuration
 * @returns Array of enabled MSW request handlers
 */
export const createHandlers = () => {
  // Import config dynamically to avoid issues during module initialization
  const { getMSWMockConfig } = require('./config');
  const config = getMSWMockConfig();
  const handlers = [];

  if (config.racks) handlers.push(...racksHandlers);
  if (config.nodes) handlers.push(...nodesHandlers);
  if (config.resources) handlers.push(...resourcesHandlers);
  if (config.deviceUnits) handlers.push(...deviceUnitsHandlers);
  if (config.resourceGroups) handlers.push(...resourceGroupsHandlers);
  if (config.cxlSwitches) handlers.push(...cxlSwitchesHandlers);
  if (config.performance) handlers.push(...performanceHandlers);

  return handlers;
};
