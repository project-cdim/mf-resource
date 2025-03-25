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

import { Stack, Tabs } from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';

import { processorTypeOrder } from '@/shared-modules/constant';
import { APIDeviceType, APIPromQL, APIPromQLSingle, APIresources, isAPIDeviceType } from '@/shared-modules/types';
import {
  formatEnergyValue,
  formatNetworkTransferValue,
  formatNumberOfResources,
  parseGraphData,
} from '@/shared-modules/utils';
import { formatUnitValue } from '@/shared-modules/utils/formatUnitValue';
import { typeToUnit } from '@/shared-modules/utils/typeToUnit';
import { typeToVolumeKey } from '@/shared-modules/utils/typeToVolumeKey';

import {
  AllocatedView,
  AllocatedViewProps,
  GraphGroup,
  GraphGroupItem,
  NumberGroup,
  NumberViewProps,
} from '@/components';

import { parseHistogramData } from '@/utils/parse/parseHistogramData';
import { parseStorageGraphData } from '@/utils/parse/parseStorageGraphData';

/**
 * Props for the TabPanel component
 */
export type TabPanelTab = APIDeviceType | 'summary';

/**
 * Props for the TabPanel component.
 */
export type TabPanelProps = {
  /** List of device types {@link APIDeviceType}[] */
  tabs: TabPanelTab[];
  /** All resource information {@link APIresources} */
  data: APIresources | undefined;
  /** Graph data (time range) */
  rangeGraphData: APIPromQL | undefined;
  /** Graph data (single point) */
  singleGraphData: APIPromQLSingle | undefined;
  /** Start date for the graph data */
  startDate?: string;
  /** End date for the graph data */
  endDate?: string;
};

/**
 * Component that displays the content of each tab for different types
 * @param props {@link TabPanelProps}
 * @returns JSX.Element displaying the content of each tab for different types
 */
export const TabPanel = (props: TabPanelProps) => {
  /** Get the current language setting */
  const currentLanguage = useLocale();
  const t = useTranslations();

  /** Type of graph */
  type GraphType = APIDeviceType | 'processor' | 'energyConsumption';
  /** Generate props from graph type and tab */
  const getGraphViewProps = (graphType: GraphType, tab: TabPanelTab): GraphGroupItem => {
    if (graphType === 'storage') {
      return {
        type: 'storage',
        props: {
          title: getTitle(tab === 'summary' ? graphType : undefined),
          data: parseStorageGraphData(props.data, props.singleGraphData),
          linkTitle: t('Resources.list'),
          link: '/cdim/res-resource-list',
          query: { type: ['storage'] },
        },
      };
    } else if (graphType === 'networkInterface') {
      return {
        type: 'graphView',
        props: {
          title: getTitle(graphType),
          data: parseGraphData(
            props.rangeGraphData,
            'networkInterface_usage',
            currentLanguage,
            props.startDate,
            props.endDate
          ),
          linkTitle: t('Resources.list'),
          valueFormatter: formatNetworkTransferValue,
          link: '/cdim/res-resource-list',
          query: { type: ['networkInterface'] },
        },
      };
    } else if (graphType === 'energyConsumption') {
      return {
        type: 'graphView',
        props: {
          title: getTitle(graphType),
          data: parseGraphData(
            props.rangeGraphData,
            (tab === 'summary' ? 'all' : tab) + '_energy',
            currentLanguage,
            props.startDate,
            props.endDate
          ),
          valueFormatter: formatEnergyValue,
          linkTitle: t('Resources.list'),
          link: '/cdim/res-resource-list',
          query: { type: tab === 'summary' ? [] : [tab] },
        },
      };
    } else {
      return {
        type: 'histogram',
        props: {
          title: getTitle(tab === 'summary' ? graphType : undefined),
          data: parseHistogramData(
            props.singleGraphData,
            graphType === 'processor' ? processorTypeOrder : [graphType],
            props.data
          ),
          valueFormatter: formatNumberOfResources,
          stack: graphType === 'processor', // Stack processors
          linkTitle: t('Resources.list'),
          link: '/cdim/res-resource-list',
          query: graphType === 'processor' ? { type: processorTypeOrder } : { type: [graphType] },
        },
      };
    }
  };

  /** Get the title based on the graph type */
  const getTitle = (graphType: GraphType | 'default' = 'default') => {
    switch (graphType) {
      case 'energyConsumption':
        return t('Energy Consumptions');
      case 'processor':
        return t('Processor Usage');
      case 'memory':
        return t('Memory Usage');
      case 'storage':
        return t('Storage Usage');
      case 'networkInterface':
        return t('Network Transfer Speed');
      case 'default':
      default:
        return t('Usage');
    }
  };

  /** Generate an array of props for graph display */
  const getGraph = (tab: TabPanelTab): GraphGroupItem[] => {
    // Generate graph information
    switch (tab) {
      case 'summary': {
        const graphsForSummary: GraphType[] = [
          'energyConsumption',
          'processor',
          'memory',
          'storage',
          'networkInterface',
        ];
        return graphsForSummary.map((graphType) => ({
          ...getGraphViewProps(graphType, tab),
          isFullWidth: graphType === 'energyConsumption',
        }));
      }
      case 'graphicController':
      case 'virtualMedia':
        return [];
      default: {
        const graphsForOtherTabs: GraphType[] = ['energyConsumption', tab];
        return graphsForOtherTabs.map((graphType) => getGraphViewProps(graphType, tab));
      }
    }
  };

  /** Generate props for number information display */
  const getNumber = (type: APIDeviceType | 'summary'): NumberViewProps[] =>
    [t('Total'), t('Unallocated'), t('Disabled'), t('Warning'), t('Critical'), t('Excluded from design')].map(
      (title) => ({
        title: title,
        number:
          props.data?.resources.filter(
            (resource) =>
              (type === 'summary' || resource.device.type === type) &&
              (title === t('Total')
                ? true
                : title === t('Unallocated')
                  ? !resource.nodeIDs.length
                  : title === t('Disabled')
                    ? resource.device.status.state === 'Disabled'
                    : title === t('Warning')
                      ? resource.device.status.health === 'Warning'
                      : title === t('Critical')
                        ? resource.device.status.health === 'Critical'
                        : //title === t('Excluded from designs')
                          !resource.annotation.available)
          ).length ?? undefined, // Return undefined if not available
        link: '/cdim/res-resource-list',
        linkTitle: t('Resources.list'),
        query: {
          ...(type !== 'summary' && { type: [type] }),
          ...(title === t('Unallocated') && { allocatednode: ['Unallocated'] }),
          ...(title === t('Disabled') && { state: ['Disabled'] }),
          ...(title === t('Warning') && { health: ['Warning'] }),
          ...(title === t('Critical') && { health: ['Critical'] }),
          ...(title === t('Excluded from design') && {
            resourceAvailable: ['Unavailable'],
          }),
        },
      })
    );

  /** Data on the number of resources in the node configuration: Generate props for number information display */
  const getAllocatedItem = (tab: TabPanelTab): AllocatedViewProps['item'] => {
    if (props.data === undefined) {
      return undefined;
    }
    const allocatedItem: AllocatedViewProps['item'] = {
      device: {
        /** Number of allocated resources */
        allocated: props.data.resources.filter(
          (resource) => (tab === 'summary' || resource.device.type === tab) && resource.nodeIDs.length
        ).length,
        /** Total number of resources */
        all: props.data.resources.filter((resource) => tab === 'summary' || resource.device.type === tab).length,
      },
    };
    const typeKey = tab === 'summary' ? false : typeToVolumeKey[tab];
    if (isAPIDeviceType(tab) && typeKey) {
      const allVolume = props.data.resources
        .filter((resource) => resource.device.type === tab)
        .reduce((acc, resource) => acc + (resource.device[typeKey] ?? 0), 0);
      const unit = typeToUnit(tab, allVolume);
      const allocatedVolume = props.data.resources
        .filter((resource) => resource.device.type === tab && resource.nodeIDs.length)
        .reduce((acc, resource) => acc + (resource.device[typeKey] ?? 0), 0);
      allocatedItem.volume = {
        /** Number of allocated volumes */
        allocated: formatUnitValue(tab, allocatedVolume, unit),
        /** Total number of volumes */
        all: formatUnitValue(tab, allVolume, unit),
        /** Volume display unit */
        unit: unit,
      };
    }
    return allocatedItem;
  };

  /** Generate the content for each tab based on the device type */
  const tabPanels = props.tabs.map((tab, index) => (
    <Tabs.Panel value={tab} key={index}>
      <Stack>
        <GraphGroup title='' items={getGraph(tab)} />
        <NumberGroup title={t('Resources.number')} items={getNumber(tab)} />
        <AllocatedView title={t('Allocated Resources')} item={getAllocatedItem(tab)} />
      </Stack>
    </Tabs.Panel>
  ));

  return <>{tabPanels}</>;
};
