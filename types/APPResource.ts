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

import {
  APIDeviceAvailable,
  APIDeviceHealth,
  APPDeviceOverallStatus,
  APIDevicePowerState,
  APIDeviceState,
  APIDeviceType,
  APIresource,
} from '@/shared-modules/types';

/** Type definition for the resource list table */
export type APPResource = {
  id: string;
  type: APIDeviceType;
  status: APPDeviceOverallStatus;
  powerState: APIDevicePowerState;
  health: APIDeviceHealth;
  state: APIDeviceState;
  detected: boolean;
  resourceGroups: { id: string; name: string }[];
  placement?: APIresource['physicalLocation'];
  cxlSwitch: string[];
  nodeIDs: string[] | [];
  composite?: string;
  resourceAvailable: APIDeviceAvailable;
};
