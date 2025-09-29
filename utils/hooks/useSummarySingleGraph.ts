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
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Custom hook to fetch single point graph data for summary page
 */
import useSWR from 'swr';
import { APIPromQLSingle, APIDeviceType } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils';

/**
 * Custom React hook to fetch and return summary metrics for CPU, memory, and storage usage
 * for the specified device types at a given end date.
 *
 * @param deviceTypes - An array of device types to filter the metrics.
 * @param metricEndDate - The end date (as a string) for the metric query, or undefined.
 * @returns An object containing:
 *   - data: The fetched metrics data (or undefined if not yet loaded).
 *   - error: Any error encountered during fetching.
 *   - isValidating: Boolean indicating if the data is currently being validated/refetched.
 */
export const useSummarySingleGraph = (deviceTypes: APIDeviceType[], metricEndDate: string | undefined) => {
  const usageQuery = `label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","")`;
  const storageUsageQuery = `label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")`;

  const { data, error, isValidating } = useSWR<APIPromQLSingle>(
    deviceTypes.length !== 0 &&
      `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query?query=${usageQuery} or ${storageUsageQuery}&time=${metricEndDate}`,
    fetcher
  );
  return { data, error, isValidating };
};
