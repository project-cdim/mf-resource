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

import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { GraphView, GraphViewProps } from '@/shared-modules/components';
import { GRAPH_CARD_HEIGHT } from '@/shared-modules/constant';

import {
  HistogramView,
  HistogramViewProps,
  StorageGraphView,
  StorageGraphViewProps,
  DisplayPeriodPicker,
} from '@/components';

/** Represents an item in a graph group.  */
export type GraphGroupItem = {
  /**
   * The type of the graph group item.
   */
  type: 'graphView' | 'histogram' | 'storage';
  /**
   * The props specific to the type of the graph group item.
   */
  props: GraphViewProps | HistogramViewProps | StorageGraphViewProps;
  /** Whether the energy graph should be displayed in a wide format */
  isFullWidth?: boolean;
};
/**  Props for the GraphGroup component.  */
export type GraphGroupProps = {
  /** Group title */
  title: string;
  /** Array of {@link GraphViewProps} */
  items: GraphGroupItem[];
  /** Whether to hide the header of the graph group */
  noHeader?: boolean;
  /** Date range for the DisplayPeriodPicker */
  dateRange: [Date, Date];
  /** Setter for the date range */
  setDateRange: (range: [Date, Date]) => void;
};

/**
 * Component that displays a group of graphs
 *
 * @param props {@link GraphGroupProps}
 * @returns JSX.Element of the graph group
 */
export const GraphGroup = (props: GraphGroupProps) => {
  const t = useTranslations();
  const WIDE_SPAN = 12;
  const NARROW_SPAN = 6;
  const items = props.items?.map(({ type, props: itemProps, isFullWidth }, index) => {
    return (
      <Grid.Col span={isFullWidth ? WIDE_SPAN : NARROW_SPAN} key={index} h={GRAPH_CARD_HEIGHT}>
        {type === 'graphView' && <GraphView {...(itemProps as GraphViewProps)} />}
        {type === 'histogram' && <HistogramView {...(itemProps as HistogramViewProps)} />}
        {type === 'storage' && <StorageGraphView {...(itemProps as StorageGraphViewProps)} />}
      </Grid.Col>
    );
  });

  return (
    <>
      <Title order={2} fz='lg'>
        {props.title}
      </Title>
      <Stack>
        {props.noHeader ? (
          <></>
        ) : (
          <>
            <Group justify='space-between' align='end'>
              <Title order={2} fz='lg'>
                {t('Performance')}
              </Title>
              <DisplayPeriodPicker value={props.dateRange} onChange={props.setDateRange} />
            </Group>
            {items.length === 0 ? <Text>{t('No data')}</Text> : <></>}
          </>
        )}
        <Grid align='stretch'>{items}</Grid>
      </Stack>
    </>
  );
};
