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

'use client';

import { useEffect, useState } from 'react';

import { Box, Breadcrumbs, Tabs, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import _ from 'lodash';
import { SWRConfig } from 'swr';
import type { SWRConfiguration } from 'swr';

import { MessageBox } from '@/shared-modules/components';
import { APIDeviceType } from '@/shared-modules/types';
import { sortByDeviceType, fetcher } from '@/shared-modules/utils';
import { useMetricDateRange } from '@/shared-modules/utils/hooks';
import { TabList, TabListTab, TabPanel, TabPanelAll, TabPanelAllTab, TabPanelTab } from '@/components';
import { useResourceSummary } from '@/utils/hooks/useResourceSummary';
import { useSummaryRangeGraph } from '@/utils/hooks/useSummaryRangeGraph';
import { useSummarySingleGraph } from '@/utils/hooks/useSummarySingleGraph';
import { useTabFromQuery } from '@/utils/hooks/useTabFromQuery';

/**
 * Home component for the summary page.
 *
 * @returns {JSX.Element} The Home component wrapped with SWRConfig providing refresh interval options.
 */
const Home = () => {
  const envInterval = Number(process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS);
  const DEFAULTINTERVAL = 60;
  const ONESECOND = 1000;
  const interval =
    Number.isInteger(envInterval) && envInterval !== 0 ? envInterval * ONESECOND : DEFAULTINTERVAL * ONESECOND;

  const SWR_OPTIONS: SWRConfiguration = {
    fetcher: fetcher,
    refreshInterval: interval,
  };

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

  // use custom hook for resource summary
  const { data, error } = useResourceSummary();
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    return [oneMonthAgo, today];
  });
  const [metricStartDate, metricEndDate] = useMetricDateRange(dateRange);

  // use custom hooks for graph data
  const { error: rangeGraphError } = useSummaryRangeGraph(deviceTypes, metricStartDate, metricEndDate);
  const { error: singleGraphError } = useSummarySingleGraph(deviceTypes, metricEndDate);

  // Data retrieval and update
  useEffect(() => {
    if (!data || data.resources.length === 0) return;
    // Create a list of types
    const typeInData = data.resources.map((resource) => resource.device.type);
    const typeList: APIDeviceType[] = sortByDeviceType(typeInData) as APIDeviceType[];
    setDeviceTypes(typeList);
    setDeviceTypesTabList(['summary', 'all', ...typeList]);
    setDeviceTypesTabPanelAll(['all', ...typeList]);
    setDeviceTypesTabPanel(['summary', ...typeList]);
  }, [data]);

  const handleTabChange = _.debounce((value: string | null) => {
    setActiveTab(value || 'summary');
  }, 200);

  return (
    // Designate a position relative, because it is required by a LoadingOverlay.
    <SWRConfig value={SWR_OPTIONS}>
      <Box pos='relative'>
        <Breadcrumbs fz='sm'>
          {[
            <span key='Resource Management'>{t('Resource Management')}</span>,
            <span key='Summary'>{t('Summary')}</span>,
          ]}
        </Breadcrumbs>
        <Title size='1.5rem' pt={'0.5rem'}>
          {t('Summary')}
        </Title>
        <Messages error={error} rangeGraphError={rangeGraphError} singleGraphError={singleGraphError} />
        <Tabs value={activeTab} onChange={handleTabChange} data-testid='tabs-root'>
          {/* Tab list */}
          <TabList tabs={deviceTypesTabList} />
          {/* All tab */}
          <TabPanelAll tabs={deviceTypesTabPanelAll} dateRange={dateRange} setDateRange={setDateRange} />
          {/* Summary and type-specific tabs */}
          <TabPanel tabs={deviceTypesTabPanel} dateRange={dateRange} setDateRange={setDateRange} />
        </Tabs>
      </Box>
    </SWRConfig>
  );
};
/**
 * Renders error messages using the `MessageBox` component for different error states.
 * Displays messages for general errors, range graph errors, and single graph errors.
 */
const Messages = (props: { error: any; rangeGraphError: any; singleGraphError: any }) => {
  const { error, rangeGraphError, singleGraphError } = props;
  return (
    <>
      {error && (
        <div style={{ marginBlock: '24px' }}>
          <MessageBox type='error' title={error.message} message={error.response?.data?.message || ''} />
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
