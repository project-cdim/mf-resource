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

import _ from 'lodash';

import { KIB, PERCENT } from '@/shared-modules/constant';
import { APIDeviceType, APIPromQLSingle, APIresources } from '@/shared-modules/types';

import { HistogramViewData } from '@/components';

/**
 * Calculate usage value for a specific type
 * @param type - Device type
 * @param value - Raw value from metric
 * @param resourceData - Resource data
 * @param job - Job identifier
 * @returns Usage value or undefined if calculation fails
 */
const calculateUsage = (
  type: APIDeviceType,
  value: string,
  resourceData: APIresources | undefined,
  job: string
): number | undefined => {
  if (type === 'memory') {
    const capacityMiB = resourceData?.resources.find((resource) => resource.device.deviceID === job)?.device
      .capacityMiB;
    if (capacityMiB === undefined || capacityMiB === null || capacityMiB === 0) {
      return undefined; // Do not count if volume information cannot be obtained
    }
    return (parseInt(value) / (capacityMiB * KIB)) * PERCENT;
  }
  return parseInt(value);
};

/**
 * Process a single metric item and update histogram
 * @param item - Metric item
 * @param types - Array of device types
 * @param histogram - Histogram data to update
 * @param resourceData - Resource data
 * @returns True if item was processed
 */
const processMetricItem = (
  item: APIPromQLSingle['data']['result'][number],
  types: APIDeviceType[],
  histogram: HistogramViewData,
  resourceData: APIresources | undefined
): boolean => {
  const type: APIDeviceType = item.metric.__name__?.split('_')[0] as APIDeviceType;
  if (!types.includes(type)) {
    return false;
  }

  const job = item.metric.job;
  if (!job) {
    return false;
  }

  const usage = calculateUsage(type, item.value[1], resourceData, job);
  if (usage === undefined) {
    return false;
  }

  const rangeIndex = usage === 0 ? 0 : Math.min(Math.floor(usage / 20) + 1, 6);
  /* istanbul ignore next */
  histogram[rangeIndex][_.upperFirst(type) as APIDeviceType] =
    (histogram[rangeIndex][_.upperFirst(type) as APIDeviceType] ?? 0) + 1;
  return true;
};

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
    if (processMetricItem(item, types, histogram, resourceData)) {
      find = true;
    }
  });
  return find ? histogram : undefined;
};
