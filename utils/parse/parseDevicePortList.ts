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

import { DevicePortList } from '@/shared-modules/types/APIresources';

/**
 * Parse devicePortList array to extract all switchIDs with fabricID
 *
 * @param devicePortList Device port list array
 * @returns Array of combined fabricID-switchID strings, or empty array if not found
 */
export const parseDevicePortList = (devicePortList: DevicePortList | undefined): string[] => {
  if (!devicePortList || devicePortList.length === 0) {
    return [];
  }

  return devicePortList
    .map((port) => {
      if (port.switchID && port.fabricID && port.switchID.trim() !== '' && port.fabricID.trim() !== '') {
        return `${port.fabricID}-${port.switchID}`;
      }
      return undefined;
    })
    .filter((id): id is string => id !== undefined);
};
