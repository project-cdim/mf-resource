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

import { APIresourceForRackChassisDeviceUnit, APIDeviceUnitAnnotation } from '@/shared-modules/types';

/** Definition of chassis information */
export type APIChassis = {
  /** Chassis ID */
  id: string;
  /** Chassis name */
  name?: string;
  /** Model Name */
  modelName: string;
  /** Description */
  description: string;
  /** Unit Position */
  unitPosition: number;
  /** Front / Rear */
  facePosition: 'Front' | 'Rear';
  /** Height */
  height: number;
  /** Depth */
  depth: 'Half' | 'Full';
  /** Created date and time */
  createdAt: string;
  /** Updated date and time */
  updatedAt: string;
  /** Device units list */
  deviceUnits: APIchassisDeviceUnit[];
  /** CXL switches list */
  CXLSwitches: APIchassisCXLSwitch[];
};

/** Definition of device unit in chassis */
export type APIchassisDeviceUnit = {
  /** Device unit ID */
  id: string;
  /** Device unit annotation */
  annotation: APIDeviceUnitAnnotation;
  /** Resources belonging to the device unit */
  resources: APIresourceForRackChassisDeviceUnit[];
};

/** Definition of CXL switch in chassis */
export type APIchassisCXLSwitch = {
  /** CXL switch ID */
  id: string;
};
