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

import { HttpResponse, http } from 'msw';

import { dummyQuery } from '@/shared-modules/utils/dummy-data/PromQL/query';
import { dummyQueryRange } from '@/shared-modules/utils/dummy-data/PromQL/query_range';

import { dummyRack } from '@/utils/dummy-data/chassisList/chassisList';
// import { dummyResourcesDetail } from '@/utils/dummy-data/index/resources';
import { dummyNodeDetail } from '@/utils/dummy-data/node-detail/nodes';
import { dummyAPIResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPIResourceGroups';
import { dummyApiResources } from '@/utils/dummy-data/resource-list/dummyAPIresources';

export const handlers = [
  // Handles a GET /racks request
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/racks/:rackid?detail=true`, () => {
    return HttpResponse.json(dummyRack);
  }),

  // GET /resources
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources`, () => {
    return HttpResponse.json(dummyApiResources);
  }),

  // // GET /resources?detail=true
  // http.get(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`, () => {
  //   return HttpResponse.json(dummyResourcesDetail);
  // }),

  // GET /resource-groups
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups`, () => {
    return HttpResponse.json(dummyAPIResourceGroups);
  }),

  // GET /nodes/{id}
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/nodes/:nodeid`, () => {
    return HttpResponse.json(dummyNodeDetail);
    // return HttpResponse.json(dummyNodeDetailForCapture);
  }),

  // GET /query_range?query=
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`, () => {
    return HttpResponse.json(dummyQueryRange);
  }),
  // POST /query_range?query=
  http.post(`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`, () => {
    return HttpResponse.json(dummyQueryRange);
  }),
  // GET /query?query=
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`, () => {
    return HttpResponse.json(dummyQuery);
  }),
];
