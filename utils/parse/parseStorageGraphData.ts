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

import { APIPromQLSingle, APIresources } from '@/shared-modules/types';

import { StorageGraphViewData } from '@/components';

/**
 * Convert PromQL response data to HistogramView data.
 *
 * @param graphData PromQL response data
 * @param types Type array
 * @returns HistogramView data
 */
export const parseStorageGraphData = (
  data: APIresources | undefined,
  graphData: APIPromQLSingle | undefined
): StorageGraphViewData => {
  const usedValue = graphData?.data.result.find((result) => result.metric.data_label === 'storage_usage')?.value[1];
  return {
    used: usedValue !== undefined ? parseInt(usedValue) : undefined,
    allocated:
      data?.resources
        .filter((resource) => resource.device.type === 'storage' && resource.nodeIDs.length)
        .reduce((acc, resource) => acc + (resource.device.driveCapacityBytes ?? 0), 0) ?? undefined,
    overall:
      data?.resources
        .filter((resource) => resource.device.type === 'storage')
        .reduce((acc, resource) => acc + (resource.device.driveCapacityBytes ?? 0), 0) ?? undefined,
  };
};
