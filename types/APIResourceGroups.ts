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

import { APIresource } from '@/shared-modules/types';

/** Type definition for the response of GET /resource-groups */
export type APIResourceGroup = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  resources?: APIresource[]; // Optional, only if withResources=true
};
export type APIResourceGroups = {
  count: number;
  resourceGroups: APIResourceGroup[];
};
