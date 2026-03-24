/*
 * Copyright 2026 NEC Corporation.
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

import { APIDeviceHealth, APIDeviceState, APPDeviceOverallStatus } from '@/shared-modules/types';

/**
 * Check if state is critical-level state
 * @param state - Device state
 * @returns True if state is critical-level
 */
const isCriticalState = (state: APIDeviceState): boolean => {
  return ['Disabled', 'Absent', 'UnavailableOffline', 'Degraded'].includes(state);
};

/**
 * Check if state is warning-level state
 * @param state - Device state
 * @returns True if state is warning-level
 */
const isWarningState = (state: APIDeviceState): boolean => {
  return ['StandbyOffline', 'StandbySpare', 'InTest', 'Starting', 'Deferring', 'Quiesced', 'Updating'].includes(state);
};

/**
 * Calculate status when health is OK
 * @param state - Device state
 * @returns Overall status
 */
const calculateOKHealthStatus = (state: APIDeviceState): APPDeviceOverallStatus => {
  if (state === 'Enabled') return 'OK';
  if (isCriticalState(state)) return 'Critical';
  return 'Warning';
};

/**
 * Calculate status when health is Warning
 * @param state - Device state
 * @returns Overall status
 */
const calculateWarningHealthStatus = (state: APIDeviceState): APPDeviceOverallStatus => {
  if (state === 'Enabled' || isWarningState(state)) return 'Warning';
  if (isCriticalState(state)) return 'Critical';
  return 'Warning';
};

/**
 * Calculate overall status based on health and state.
 * Based on the specification table
 *
 * @param health - Device health status
 * @param state - Device state
 * @returns Overall status (OK, Warning, or Critical)
 */
export const calculateOverallStatus = (health: APIDeviceHealth, state: APIDeviceState): APPDeviceOverallStatus => {
  if (health === 'Critical') return 'Critical';
  if (health === 'OK') return calculateOKHealthStatus(state);
  if (health === 'Warning') return calculateWarningHealthStatus(state);
  return 'Critical';
};
