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

'use client';

import { useEffect, useState } from 'react';

import { Box, LoadingOverlay, Tabs, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import { MessageBox } from '@/shared-modules/components';
import { KB } from '@/shared-modules/constant';
import { APIDeviceType, APIPromQL, APIPromQLSingle, APIresources } from '@/shared-modules/types';
import { fetcher, sortByDeviceType } from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';

import { TabList, TabListTab, TabPanel, TabPanelAll, TabPanelAllTab, TabPanelTab } from '@/components';

// import { useMSW } from '@/shared-modules/utils/hooks';
import { useTabFromQuery } from '@/utils/hooks/useTabFromQuery';

/**
 * Resource management summary page
 *
 * @returns Page content
 */
const Home = () => {
  const t = useTranslations();
  const [deviceTypes, setDeviceTypes] = useState<APIDeviceType[]>([]);
  const [deviceTypesTabList, setDeviceTypesTabList] = useState<TabListTab[]>(['summary', 'all']);
  const [deviceTypesTabPanelAll, setDeviceTypesTabPanelAll] = useState<TabPanelAllTab[]>(['all']);
  const [deviceTypesTabPanel, setDeviceTypesTabPanel] = useState<TabPanelTab[]>(['summary']);

  // Tab-related logic
  const [activeTab, setActiveTab] = useState<string>('summary');
  const tabFromQuery = useTabFromQuery();
  // Be careful that the query tab is unintentionally opened when the deviceTypesTabList information is reacquired due to future modifications
  useEffect(() => {
    // If there is a tab in the query parameter, set that tab as active
    if (tabFromQuery && deviceTypesTabList.some((tab) => tab == tabFromQuery)) setActiveTab(tabFromQuery);
  }, [tabFromQuery, deviceTypesTabList]);

  // const mswInitializing = useMSW();
  const mswInitializing = false;

  const { data, error, isValidating } = useSWR<APIresources>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`,
    fetcher,
    {
      refreshInterval: KB * 10, // Revalidate every 5 minutes
    }
  );
  const [metricStartDate, setMetricStartDate] = useState<string>();
  const [metricEndDate, setMetricEndDate] = useState<string>();
  useEffect(() => {
    const currentDate = new Date();
    setMetricEndDate(currentDate.toISOString());
    const OneMonthBeforeDate = currentDate;

    OneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);
    setMetricStartDate(OneMonthBeforeDate.toISOString());
  }, []);

  /** Query to get the energy consumption (sum of differences) for each type */
  const makeEnergyQuery = (): string => {
    const baseString = `label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~".*"}[1h])/3600),"data_label","<type>_energy","","")`;
    const replacedStrings = deviceTypes.map((type) => baseString.replace(/<type>/g, type));
    return replacedStrings.join(' or ');
  };
  /** Query to get the energy consumption (sum of differences) for all devices */
  const makeAllEnergyQuery = `label_replace(sum(increase({__name__=~".*_metricEnergyJoules_reading",job=~".*"}[1h])/3600),"data_label","all_energy","","")`;
  /** Query to get the network transfer speed (total)
      Get the increase in 1 hour and calculate the average increase per second (cannot be shorter than the collection interval of Prometheus, such as 1s) */
  const bytesSent = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesSent';
  const bytesRecv = 'networkInterface_networkInterfaceInformation_networkTraffic_bytesRecv';
  const usageNetworkInterfaceQuery = `label_replace(sum(increase({__name__=~"${bytesSent}|${bytesRecv}",job=~".*"}))[1h]/3600,"data_label","networkInterface_usage","","")`;
  /** Query to get the usage rate for each type (single point) */
  const usageQuery = `label_replace({__name__=~"CPU_usageRate|memory_usedMemory",job=~".*"},"data_label","usage","","")`;
  /** Storage usage (total, single point) */
  const storageUsageQuery = `label_replace(sum({__name__=~"storage_disk_amountUsedDisk",job=~".*"}),"data_label","storage_usage","","")`;

  /** Get graph data (range data) */
  const {
    data: rangeGraphData,
    error: rangeGraphError,
    isValidating: rangeGraphValidating,
  } = useSWR<APIPromQL>(
    deviceTypes.length != 0 &&
      `${
        process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER
      }/query_range?query=${makeEnergyQuery()} or ${makeAllEnergyQuery} or ${usageNetworkInterfaceQuery}&start=${metricStartDate}&end=${metricEndDate}&step=1h`,
    fetcher
  );

  /** Get graph data (single point data) */
  const {
    data: singleGraphData,
    error: singleGraphError,
    isValidating: singleGraphValidating,
  } = useSWR<APIPromQLSingle>(
    deviceTypes.length != 0 &&
      `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query?query=${usageQuery} or ${storageUsageQuery}&time=${metricEndDate}`,
    fetcher
  );

  // Data retrieval and update
  useEffect(() => {
    if (!data) return;
    // Create a list of types
    const typeInData = data.resources.map((resource) => resource.device.type);
    const typeList: APIDeviceType[] = sortByDeviceType(typeInData);
    setDeviceTypes(typeList);
    setDeviceTypesTabList(['summary', 'all', ...typeList]);
    setDeviceTypesTabPanelAll(['all', ...typeList]);
    setDeviceTypesTabPanel(['summary', ...typeList]);
  }, [data]);

  const loading = useLoading(isValidating || rangeGraphValidating || singleGraphValidating);

  return (
    // Designate a position relative, because it is required by a LoadingOverlay.
    <Box pos='relative'>
      <Title size='1.5rem'>{t('Summary')}</Title>
      <Messages error={error} rangeGraphError={rangeGraphError} singleGraphError={singleGraphError} />
      <Tabs
        value={activeTab}
        onChange={(value: string | null) => {
          setActiveTab(value || 'summary');
        }}
      >
        {/* Tab list */}
        <TabList tabs={deviceTypesTabList} />
        {/* All tab */}
        <TabPanelAll
          tabs={deviceTypesTabPanelAll}
          data={data}
          rangeGraphData={rangeGraphData}
          singleGraphData={singleGraphData}
          startDate={metricStartDate}
          endDate={metricEndDate}
        />
        {/* Summary and type-specific tabs */}
        <TabPanel
          tabs={deviceTypesTabPanel}
          data={data}
          rangeGraphData={rangeGraphData}
          singleGraphData={singleGraphData}
          startDate={metricStartDate}
          endDate={metricEndDate}
        />
      </Tabs>
      <LoadingOverlay visible={loading} />
    </Box>
  );
};

const Messages = (props: { error: any; rangeGraphError: any; singleGraphError: any }) => {
  const { error, rangeGraphError, singleGraphError } = props;
  return (
    <>
      {error && (
        <div style={{ marginBlock: '24px' }}>
          <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />
        </div>
      )}
      {rangeGraphError && (
        <div style={{ marginBlock: '24px' }}>
          <MessageBox type='error' title={rangeGraphError.message} message={''} />
        </div>
      )}
      {singleGraphError && (
        <div style={{ marginBlock: '24px' }}>
          <MessageBox type='error' title={singleGraphError.message} message={''} />
        </div>
      )}
    </>
  );
};

export default Home;
