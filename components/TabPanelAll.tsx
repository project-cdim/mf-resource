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

import { DatePicker } from '@/shared-modules/components';
import { APIDeviceType, APIPromQL, APIPromQLSingle, APIresources, isAPIDeviceType } from '@/shared-modules/types';
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
} from '@/components';

import { parseHistogramData } from '@/utils/parse/parseHistogramData';
import { parseStorageGraphData } from '@/utils/parse/parseStorageGraphData';

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
  /** All resource information {@link APIresources} */
  data: APIresources | undefined;
  /** Graph data (time range) */
  rangeGraphData: APIPromQL | undefined;
  /** Graph data (single point in time) */
  singleGraphData: APIPromQLSingle | undefined;
  /** Start date for the graph data */
  startDate: string | undefined;
  /** End date for the graph data */
  endDate: string | undefined;
};

/**
 * Component to display the content of the All tab
 * @param props {@link TabPanelAllProps}
 * @returns JSX.Element displaying the content of the All tab
 */
export const TabPanelAll = (props: TabPanelAllProps) => {
  /** Get the current language setting */
  const currentLanguage = useLocale();
  const t = useTranslations();

  const energyAllGraphData =
    props.rangeGraphData &&
    mergeMultiGraphData(
      props.tabs
        .filter((tab) => tab !== 'all')
        .map((type) =>
          parseGraphData(props.rangeGraphData, `${type}_energy`, currentLanguage, props.startDate, props.endDate)
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
                    : parseGraphData(
                        props.rangeGraphData,
                        `${tab}_energy`,
                        currentLanguage,
                        props.startDate,
                        props.endDate
                      ),
                stack: tab === 'all' ? true : false,
                valueFormatter: formatEnergyValue,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: tab === 'all' ? undefined : { type: [tab] },
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
                  props.rangeGraphData,
                  'networkInterface_usage',
                  currentLanguage,
                  props.startDate,
                  props.endDate
                ),
                valueFormatter: formatNetworkTransferValue,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
              },
            };
          } else if (tab === 'storage') {
            return {
              type: 'storage',
              props: {
                title: t('Storage Usage'),
                data: parseStorageGraphData(props.data, props.singleGraphData),
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
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
                data: parseHistogramData(props.singleGraphData, [tab], props.data),
                valueFormatter: formatNumberOfResources,
                link: '/cdim/res-resource-list',
                linkTitle: t('Resources.list'),
                query: { type: [tab] },
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
        props.data?.resources.filter(
          (resource) =>
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
    }));
  /** Data on the number of resources in the node layout: Generate props for displaying the number of resources in the node layout */
  const getAllocated = (): AllocatedViewAllProps[] =>
    props.tabs.map((tab) => {
      if (props.data === undefined) {
        return {
          title: _.upperFirst(tab),
          device: undefined,
          volume: undefined,
        };
      }
      const AllocatedViewAllProps: AllocatedViewAllProps = {
        title: _.upperFirst(tab),
        device: {
          /** Number of allocated resources */
          allocated: props.data.resources.filter(
            (resource) => (tab === 'all' || resource.device.type === tab) && resource.nodeIDs.length
          ).length,
          /** Total number of resources */
          all: props.data.resources.filter((resource) => tab === 'all' || resource.device.type === tab).length,
        },
      };
      const typeKey = tab === 'all' ? false : typeToVolumeKey[tab];
      if (isAPIDeviceType(tab) && typeKey) {
        const allVolume = props.data.resources
          .filter((resource) => resource.device.type === tab)
          .reduce((acc, resource) => acc + (resource.device[typeKey] ?? 0), 0);
        const unit = typeToUnit(tab, allVolume);
        const allocatedVolume = props.data.resources
          .filter((resource) => resource.device.type === tab && resource.nodeIDs.length)
          .reduce((acc, resource) => acc + (resource.device[typeKey] ?? 0), 0);
        AllocatedViewAllProps.volume = {
          /** Number of allocated volumes */
          allocated: formatUnitValue(tab, allocatedVolume, unit),
          /** Total number of volumes */
          all: formatUnitValue(tab, allVolume, unit),
          /** Volume display unit */
          unit: unit,
        };
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
      <Group justify='flex-end' mt={15} mb={-40}>
        <DatePicker />
      </Group>
      {graphTitles.map((title, index) => (
        <GraphGroup title={`${t('Performance')}(${title})`} items={getGraph(title)} key={index} noHeader={true} />
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
