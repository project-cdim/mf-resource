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

/** Type definition for the table of resource groups */
export type APPResourceGroup = {
  /** Resource group ID */
  id: string;
  /** Resource group name */
  name: string;
  /** Description */
  description: string;
  /** Created at */
  createdAt: Date;
  /** Updated at */
  updatedAt: Date;
  // /** Power consumption (to be implemented in a future iteration) */
  // powerConsumption: number;
  // /** Resource usage rate (to be implemented in a future iteration) */
  // useRate: number;
  // /** Resource */
  // device: {
  //   /** Total number of resources (total number of nodes connected to the CXL switch) */
  //   connected: number;
  //   /** Number of unused resources (nodes) */
  //   unallocated: number;
  //   /** Number of disabled resources */
  //   disabled: number;
  //   /** Number of warning resources */
  //   warning: number;
  //   /** Number of critical resources */
  //   critical: number;
  //   /** Number of resources unavailable for design */
  //   resourceUnavailable: number;
  // };
  /** Performance monitoring (to be implemented in a future iteration) */
};
