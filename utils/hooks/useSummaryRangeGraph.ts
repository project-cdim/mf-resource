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
 * Custom hook to fetch range graph data for summary page
 */
import useSWR from 'swr';
import { APIPromQL, APIDeviceType } from '@/shared-modules/types';
import { fetcherForPromqlByPost, getStepFromRange, createPromQLParams } from '@/shared-modules/utils';

/**
 * Custom React hook to generate and execute PromQL queries for energy usage and network interface metrics
 * over a specified time range for given device types.
 *
 * @param deviceTypes - An array of device type strings used to construct energy metric queries.
 * @param metricStartDate - The start date (ISO string) for the metrics query range.
 * @param metricEndDate - The end date (ISO string) for the metrics query range.
 * @returns An object containing:
 *   - `data`: The fetched PromQL data (or undefined if not yet loaded).
 *   - `error`: Any error encountered during the fetch.
 *   - `isValidating`: Boolean indicating if the request is in progress.
 */
export const useSummaryRangeGraph = (deviceTypes: APIDeviceType[], metricStartDate: string, metricEndDate: string) => {
  // Calculate step and window using getStepFromRange for consistency
  const step = getStepFromRange(metricStartDate, metricEndDate);

  // Replace the window part of the query according to the step
  const makeEnergyQuery = (): string => {
    const baseString = `label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~".*"}[${step}])/3600),"data_label","<type>_energy","","")`;
    const replacedStrings = deviceTypes.map((type) => baseString.replace(/<type>/g, type));
    return replacedStrings.join(' or ');
  };
  const makeAllEnergyQuery = `label_replace(sum(increase({__name__=~".*_metricEnergyJoules_reading",job=~".*"}[${step}])/3600),"data_label","all_energy","","")`;
  const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
  const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
  const usageNetworkInterfaceQuery = `label_replace(sum(rate({__name__=~"${bytesSent}|${bytesRecv}",job=~".*"})[${step}]),"data_label","networkInterface_usage","","")`;

  const performanceQueries = `${makeEnergyQuery()} or ${makeAllEnergyQuery} or ${usageNetworkInterfaceQuery}`;

  // Create SWR key that includes metricStartDate and metricEndDate for re-fetching when they change
  const swrKey =
    deviceTypes.length !== 0
      ? [
          `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`,
          performanceQueries,
          metricStartDate,
          metricEndDate,
          step,
        ]
      : null;

  const getParams = () => createPromQLParams(performanceQueries, metricStartDate, metricEndDate, step);

  const { data, error, isValidating } = useSWR<APIPromQL>(
    swrKey,
    ([url]: [string, string, string | undefined, string | undefined, string]) =>
      fetcherForPromqlByPost(url, getParams())
    // {
    //   refreshInterval: isDynamicEnd ? 60000 : 0, // Do not poll if 0
    //   revalidateOnFocus: isDynamicEnd,
    //   revalidateOnReconnect: isDynamicEnd,
    // }
  );
  return { data, error, isValidating };
};
