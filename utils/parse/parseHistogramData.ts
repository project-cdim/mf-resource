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

import _ from 'lodash';

import { KIB, PERCENT } from '@/shared-modules/constant';
import { APIDeviceType, APIPromQLSingle, APIresources } from '@/shared-modules/types';

import { HistogramViewData } from '@/components';

/**
 * Convert the response data from PromQL to HistogramView data.
 *
 * @param graphData PromQL response data
 * @param types Array of types
 * @returns HistogramView data
 */
export const parseHistogramData = (
  graphData: APIPromQLSingle | undefined,
  types: APIDeviceType[],
  resourceData: APIresources | undefined
): HistogramViewData | undefined => {
  if (!graphData) return undefined;

  const histogram: HistogramViewData = [
    { name: '0%' },
    { name: '1 - 19%' },
    { name: '20 - 39%' },
    { name: '40 - 59%' },
    { name: '60 - 79%' },
    { name: '80 - 99%' },
    { name: '100%' },
  ];
  // Initialize the count of all device types to 0 for each range
  types.forEach((type) => {
    histogram.forEach((range) => (range[_.upperFirst(type) as APIDeviceType] = 0));
  });
  // Aggregate the data
  let find = false;
  graphData.data.result.forEach((item) => {
    const type: APIDeviceType = item.metric.__name__?.split('_')[0] as APIDeviceType;
    if (types.includes(type)) {
      let usage = 0;
      if (type === 'memory') {
        const capacityMiB = resourceData?.resources.find((resource) => resource.device.deviceID === item.metric.job)
          ?.device.capacityMiB;
        if (!capacityMiB) return; // Do not count if volume information cannot be obtained
        usage = (parseInt(item.value[1]) / (capacityMiB * KIB)) * PERCENT;
      } else {
        usage = parseInt(item.value[1]);
      }
      const rangeIndex = usage === 0 ? 0 : Math.min(Math.floor(usage / 20) + 1, 6);
      histogram[rangeIndex][_.upperFirst(type) as APIDeviceType] =
        (histogram[rangeIndex][_.upperFirst(type) as APIDeviceType] || 0) + 1;
      find = true;
    }
  });
  return find ? histogram : undefined;
};
