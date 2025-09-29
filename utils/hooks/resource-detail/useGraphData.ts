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

import useSWRImmutable from 'swr/immutable';
import { APIPromQL, APIresource, isAPIDeviceType } from '@/shared-modules/types';
import { fetcherForPromqlByPost, getStepFromRange, createPromQLParams } from '@/shared-modules/utils';

/**
 * A custom hook that fetches and processes graph data for different resource types.
 * Constructs Prometheus queries based on device type and fetches corresponding metrics data.
 *
 * @param data - The resource data containing device information and metrics
 * @param metricStartDate - The start date string for metrics query range
 * @param metricEndDate - The end date string for metrics query range
 * @returns An object containing:
 * - graphData: The fetched Prometheus query data
 * - graphError: Any error that occurred during the fetch
 * - graphValidating: Boolean indicating if data is currently being fetched
 * - graphMutate: Function to trigger a re-fetch of the data
 */
export const useGraphData = (data: APIresource | undefined, metricStartDate: string, metricEndDate: string) => {
  const energyMetric = data ? `${data.device.type}_metricEnergyJoules_reading` : undefined;
  const deviceID = data?.device.deviceID;
  /** Get graph data */

  // Calculate step and window using getStepFromRange for consistency
  const step = getStepFromRange(metricStartDate, metricEndDate);

  const getUsageQuery = (deviceType: string | undefined) => {
    switch (deviceType) {
      case 'memory':
        // Memory usage rate: calculate the percentage from the capacity and round to 2 decimal places
        return `label_replace(round(({__name__=~"memory_usedMemory",job=~"${deviceID}"}/(${data?.device.capacityMiB}*1024)*100)*100)/100,"data_label","${data?.device.type}_usage","","")`;
      case 'storage':
        // Storage usage rate: calculate the percentage from the drive capacity and round to 2 decimal places
        return `label_replace(round(({__name__=~"storage_disk_amountUsedDisk",job=~"${deviceID}"}/(${data?.device.driveCapacityBytes})*100)*100)/100,"data_label","${data?.device.type}_usage","","")`;
      case 'networkInterface': {
        // Network transfer speed: get the increase in the last window and calculate the average increase per second
        const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
        const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
        return `label_replace(sum(rate({__name__=~"${bytesSent}|${bytesRecv}",job=~"${deviceID}"}[${step}])),"data_label","${data?.device.type}_usage","","")`;
      }
      default:
        return `label_replace({__name__=~"${deviceType}_usageRate",job=~"${deviceID}"},"data_label","${data?.device.type}_usage","","")`;
    }
  };
  const energyQuery = `label_replace(increase({__name__=~"${energyMetric}",job=~"${deviceID}"}[${step}])/3600,"data_label","${data?.device.type}_energy","","")`;
  const usageQuery = getUsageQuery(data?.device.type);

  // Create SWR key that includes metricStartDate and metricEndDate for re-fetching when they change
  const swrKey =
    data && isAPIDeviceType(data.device.type)
      ? [
          `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`,
          `${energyQuery} or ${usageQuery}`,
          metricStartDate,
          metricEndDate,
          step,
        ]
      : null;

  const getParams = () => createPromQLParams(`${energyQuery} or ${usageQuery}`, metricStartDate, metricEndDate, step);

  const {
    data: graphData,
    error: graphError,
    isValidating: graphValidating,
    mutate: graphMutate,
  } = useSWRImmutable<APIPromQL>(swrKey, ([url]: [string, string, string | undefined, string | undefined, string]) =>
    fetcherForPromqlByPost(url, getParams())
  );

  return { graphData, graphError, graphValidating, graphMutate };
};
