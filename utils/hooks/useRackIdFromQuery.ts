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

import { useQuery } from '@/shared-modules/utils/hooks';

/**
 * Custom hook to extract rackId and chassisId from query parameters
 * @returns Tuple of [rackId, chassisId] as strings or undefined
 */
export const useRackIdFromQuery = (): [string | undefined, string | undefined] => {
  const query = useQuery();

  const rackId = query?.rackId;
  const chassisId = query?.chassisId;

  // Helper to extract first element if array, otherwise return as-is
  const extractValue = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) return value[0];
    if (typeof value === 'string') return value;
    return undefined;
  };

  return [extractValue(rackId), extractValue(chassisId)];
};
