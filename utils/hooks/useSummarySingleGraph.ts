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
import { fetcherForPromqlByPost } from '@/shared-modules/utils';

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
  // Generate PromQL queries for usage metrics
  const usageQuery = `label_replace({__name__=~".*_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","")`;
  const storageUsageQuery = `label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")`;
  // Combine queries for single API call efficiency
  const combinedQuery = `${usageQuery} or ${storageUsageQuery}`;
  // Create SWR key for caching
  const swrKey =
    deviceTypes.length !== 0
      ? [`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query`, combinedQuery, metricEndDate]
      : null;

  const { data, error, isValidating } = useSWR<APIPromQLSingle>(
    swrKey,
    ([url, query, time]: [string, string, string | undefined]) => {
      const params = new URLSearchParams({
        query,
        time: time ?? '',
      });
      return fetcherForPromqlByPost(url, params);
    }
  );
  return { data, error, isValidating };
};
