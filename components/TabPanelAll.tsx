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

import { Group, Stack, Tabs } from '@mantine/core';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';

import { useResourceSummary } from '@/utils/hooks/useResourceSummary';
import { useSummaryRangeGraph } from '@/utils/hooks/useSummaryRangeGraph';
import { useSummarySingleGraph } from '@/utils/hooks/useSummarySingleGraph';
import { APIDeviceType, isAPIDeviceType } from '@/shared-modules/types';
import {
  formatEnergyValue,
  formatNetworkTransferValue,
  formatNumberOfResources,
  mergeMultiGraphData,
  parseGraphData,
} from '@/shared-modules/utils';
import { formatUnitValue } from '@/shared-modules/utils/formatUnitValue';
import { typeToUnit } from '@/shared-modules/utils/typeToUnit';
import { typeToVolumeKey } from '@/shared-modules/utils/typeToVolumeKey';

import {
  AllocatedGroup,
  AllocatedViewAllProps,
  GraphGroup,
  GraphGroupItem,
  NumberGroup,
  NumberViewProps,
  DisplayPeriodPicker,
} from '@/components';

import { parseHistogramData } from '@/utils/parse/parseHistogramData';
import { parseStorageGraphData } from '@/utils/parse/parseStorageGraphData';
import { useLoading, useMetricDateRange } from '@/shared-modules/utils/hooks';

/**
 * Represents a tab in the TabPanelAll component.
 * It can be either an APIDeviceType or the string 'all'.
 */
export type TabPanelAllTab = APIDeviceType | 'all';
/**
 * Props for the TabPanelAll component.
 */
export type TabPanelAllProps = {
  /** List of device types {@link APIDeviceType}[] */
  tabs: TabPanelAllTab[];
  /** Date range for the graph data */
  dateRange: [Date, Date];
  /** Setter for the date range */
  setDateRange: (range: [Date, Date]) => void;
};

/**
 * TabPanelAll component displays a comprehensive dashboard for all resource types,
 * including performance graphs, resource counts, and allocation summaries.
 *
 * This component aggregates and visualizes resource data based on the selected date range
 * and the provided tabs, supporting multiple resource types and summary views.
 * It uses various custom hooks to fetch and process data for graphs and number displays.
 *
 * @param props - The properties for TabPanelAll.
 * @param props.tabs - An array of resource type tabs to display (including 'all' and specific device types).
 * @param props.dateRange - The currently selected date range for metrics and graphs.
 * @param props.setDateRange - Callback to update the selected date range.
 *
 * @returns A React element rendering the "All" tab panel with performance graphs, resource numbers,
 *          allocation summaries, and additional resource status groups.
 *
 * @remarks
 * - Uses custom hooks for data fetching: useResourceSummary, useSummaryRangeGraph, useSummarySingleGraph.
 * - Dynamically generates graph and number groups based on the provided tabs and translations.
 * - Handles loading states and localization.
 */
export const TabPanelAll = (props: TabPanelAllProps) => {
  const [metricStartDate, metricEndDate] = useMetricDateRange(props.dateRange);
  // --- custom hooks ---
  const { data, isValidating } = useResourceSummary();
  const { data: rangeGraphData, isValidating: rangeGraphValidating } = useSummaryRangeGraph(
    props.tabs.filter((t): t is APIDeviceType => t !== 'all'),
    metricStartDate,
    metricEndDate
  );
  const { data: singleGraphData, isValidating: singleGraphValidating } = useSummarySingleGraph(
    props.tabs.filter((t): t is APIDeviceType => t !== 'all'),
    metricEndDate
  );

  const resourceLoading = useLoading(isValidating);
  const rangeGraphLoading = useLoading(rangeGraphValidating);
  const singleGraphLoading = useLoading(singleGraphValidating);

  /** Get the current language setting */
  const currentLanguage = useLocale();
  const t = useTranslations();

  const energyAllGraphData =
    rangeGraphData &&
    mergeMultiGraphData(
      props.tabs
        .filter((tab) => tab !== 'all')
        .map((type) =>
          parseGraphData(rangeGraphData, `${type}_energy`, currentLanguage, metricStartDate, metricEndDate)
        )
    );

  /** Generate props for graph display */
  const getGraph = (title: string): GraphGroupItem[] => {
    if (title === t('Energy Consumptions')) {
      return props.tabs
        .map<GraphGroupItem | undefined>((tab) => {
          if (tab === 'graphicController' || tab === 'virtualMedia') {
            // Do not display
            return undefined;
          } else {
            return {
              type: 'graphView',
              props: {
                title: _.upperFirst(tab),
                data:
                  tab === 'all'
                    ? energyAllGraphData
                    : parseGraphData(rangeGraphData, `${tab}_energy`, currentLanguage, metricStartDate, metricEndDate),
                stack: tab === 'all' ? true : false,
                valueFormatter: formatEnergyValue,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: tab === 'all' ? undefined : { type: [tab] },
                loading: rangeGraphLoading,
                dateRange: props.dateRange,
              },
            };
          }
        })
        .filter((v): v is Exclude<typeof v, undefined> => {
          return v !== undefined;
        });
    } else {
      // 'Resource Usage'
      return props.tabs
        .map<GraphGroupItem | undefined>((tab) => {
          if (tab === 'networkInterface') {
            return {
              type: 'graphView',
              props: {
                title: t('Network Transfer Speed'),
                data: parseGraphData(
                  rangeGraphData,
                  'networkInterface_usage',
                  currentLanguage,
                  metricStartDate,
                  metricEndDate
                ),
                valueFormatter: formatNetworkTransferValue,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
                loading: rangeGraphLoading,
                dateRange: props.dateRange,
              },
            };
          } else if (tab === 'storage') {
            return {
              type: 'storage',
              props: {
                title: t('Storage Usage'),
                data: parseStorageGraphData(data, singleGraphData),
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
                loading: singleGraphLoading,
                date: metricEndDate,
              },
            };
          } else if (tab === 'all' || tab === 'graphicController' || tab === 'virtualMedia') {
            // Do not display
            return undefined;
          } else {
            return {
              type: 'histogram',
              props: {
                title: _.upperFirst(tab),
                data: parseHistogramData(singleGraphData, [tab], data),
                valueFormatter: formatNumberOfResources,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
                loading: singleGraphLoading,
                date: metricEndDate,
              },
            };
          }
        })
        .filter((v): v is Exclude<typeof v, undefined> => {
          return v !== undefined;
        });
    }
  };
  /** Generate props for number display */
  const getNumber = (title: string): NumberViewProps[] =>
    props.tabs.map((tab) => ({
      title: _.upperFirst(tab),
      number:
        data?.resources.filter(
          (resource: any) =>
            (tab === 'all' || resource.device.type === tab) &&
            (title === t('Total')
              ? true
              : title === t('Unallocated Resources')
                ? !resource.nodeIDs.length
                : title === t('Disabled Resources')
                  ? resource.device.status.state === 'Disabled'
                  : title === t('Warning Resources')
                    ? resource.device.status.health === 'Warning'
                    : title === t('Critical Resources')
                      ? resource.device.status.health === 'Critical'
                      : //title === t('Excluded from designs')
                        !resource.annotation.available)
        ).length ?? undefined, // If it cannnot be obtained, it is undefined
      link: '/cdim/res-resource-list',
      linkTitle: t('Resources.list'),
      query: {
        ...(tab !== 'all' && { type: [tab] }),
        ...(title === t('Unallocated Resources') && { allocatednode: ['Unallocated'] }),
        ...(title === t('Disabled Resources') && { state: ['Disabled'] }),
        ...(title === t('Warning Resources') && { health: ['Warning'] }),
        ...(title === t('Critical Resources') && { health: ['Critical'] }),
        ...(title === t('Excluded Resources') && {
          resourceAvailable: ['Unavailable'],
        }),
      },
      loading: resourceLoading,
    }));
  /** Data on the number of resources in the node layout: Generate props for displaying the number of resources in the node layout */
  const getAllocated = (): AllocatedViewAllProps[] =>
    props.tabs.map((tab) => {
      if (data === undefined) {
        return {
          title: _.upperFirst(tab),
          device: undefined,
          volume: undefined,
          loading: resourceLoading,
        };
      }
      const AllocatedViewAllProps: AllocatedViewAllProps = {
        title: _.upperFirst(tab),
        device: {
          type: tab,
          /** Number of allocated resources */
          allocated: data.resources.filter(
            (resource: any) => (tab === 'all' || resource.device.type === tab) && resource.nodeIDs.length
          ).length,
          /** Total number of resources */
          all: data.resources.filter((resource: any) => tab === 'all' || resource.device.type === tab).length,
        },
        loading: resourceLoading,
      };
      const typeKey = tab === 'all' ? false : typeToVolumeKey[tab];
      if (isAPIDeviceType(tab) && typeKey !== false) {
        const allVolume = data.resources
          .filter((resource: any) => resource.device.type === tab)
          .reduce((acc: number, resource: any) => acc + (resource.device[typeKey] ?? 0), 0);
        const unit = typeToUnit(tab, allVolume);
        const allocatedVolume = data.resources
          .filter((resource: any) => resource.device.type === tab && resource.nodeIDs.length)
          .reduce((acc: number, resource: any) => acc + (resource.device[typeKey] ?? 0), 0);
        AllocatedViewAllProps.volume = {
          /** Number of allocated volumes */
          allocated: formatUnitValue(tab, allocatedVolume, unit),
          /** Total number of volumes */
          all: formatUnitValue(tab, allVolume, unit),
          /** Volume display unit */
          unit: unit,
        };
        AllocatedViewAllProps.loading = resourceLoading;
      }
      return AllocatedViewAllProps;
    });

  /** List of graph group titles */
  const graphTitles: string[] = [t('Energy Consumptions'), t('Usage')];
  /** List of number group titles */
  const numberTitles: string[] = [
    t('Unallocated Resources'),
    t('Disabled Resources'),
    t('Warning Resources'),
    t('Critical Resources'),
    t('Excluded Resources'),
  ];
  /** Create graph group components */
  const graphGroups = (
    <Stack>
      <Group justify='flex-end' mt={15} mb={-40} style={{ zIndex: 1000 }}>
        <DisplayPeriodPicker value={props.dateRange} onChange={props.setDateRange} />
      </Group>
      {graphTitles.map((title, index) => (
        <GraphGroup
          title={`${t('Performance')}(${title})`}
          items={getGraph(title)}
          key={index}
          noHeader={true}
          dateRange={props.dateRange}
          setDateRange={props.setDateRange}
        />
      ))}
    </Stack>
  );

  /** Create number group component for all resources */
  const allResourceGroups = <NumberGroup title={t('Resources.number')} items={getNumber(t('Total'))} />;
  /** Create number group component for resources in the node layout */
  const allocatedGroups = <AllocatedGroup title={t('Allocated Resources')} items={getAllocated()} />;
  /** Create number group components for number display */
  const numberGroups = numberTitles.map((title, index) => (
    <NumberGroup title={title} items={getNumber(title)} key={index} />
  ));
  return (
    <Tabs.Panel value='all'>
      <Stack>
        {graphGroups}
        {allResourceGroups}
        {allocatedGroups}
        {numberGroups}
      </Stack>
    </Tabs.Panel>
  );
};
