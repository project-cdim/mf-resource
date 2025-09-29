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

import React from 'react';

import { BarChart, ChartTooltip } from '@mantine/charts';
import { Divider, Group, Stack, Title, Box } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CardLoading, NoData, PageLink } from '@/shared-modules/components';
import { CHART_COLORS } from '@/shared-modules/constant';
import { APIDeviceType, ResourceListQuery } from '@/shared-modules/types';
import { useLocaleDateString } from '@/shared-modules/utils/hooks';

/**
 * Represents the data for the HistogramView component.
 * It is an array of objects, where each object contains a 'name' property and optional properties for each APIDeviceType.
 */
export type HistogramViewData = ({ name: string } & { [key in APIDeviceType]?: number })[];

/** Props for the HistogramView component */
export type HistogramViewProps = {
  /** The title of the histogram. */
  title: string;
  /** The data for the histogram. */
  data: HistogramViewData | undefined;
  /** Text formatter for the y-axis values. Also used in the Tooltip */
  valueFormatter: (value: number) => string;
  /** Whether to stack the histogram bars. */
  stack?: boolean;
  /** The link to navigate to when the histogram is clicked. */
  link?: string;
  linkTitle?: string;
  /** The query for the resource list associated with the histogram. */
  query?: ResourceListQuery;
  /** Loading state */
  loading: boolean;
  /** Date string to display */
  date?: string;
};

/**
 * Component to display a graph
 *
 * @param props {@link HistogramViewProps}
 * @returns Graph JSX.Element
 */
export const HistogramView = (props: HistogramViewProps) => {
  return (
    <CardLoading withBorder h={'100%'} loading={props.loading}>
      <HistogramViewInner {...props} />
    </CardLoading>
  );
};

export const HistogramViewInner = (props: Exclude<HistogramViewProps, 'loading'>) => {
  const t = useTranslations();
  const { title, data, stack, valueFormatter, link, linkTitle, query, date } = props;
  const formattedDate = useLocaleDateString(date ? new Date(date) : undefined);

  // Get keys other than 'name' as an array
  const categories = data && data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'name') : [];

  const series = categories.map((category, idx) => ({
    name: category,
    color: CHART_COLORS[idx],
  }));

  return (
    // <Card withBorder h={'100%'}>
    <Stack justify='flex-end' h={'100%'}>
      <PageLink
        title={linkTitle || t('View details')}
        path={link}
        query={query}
        color='rgb(55 65 81 / var(--tw-text-opacity))'
      >
        <Group justify='space-between' align='flex-end' mih='2.90625rem'>
          <Title order={3} size='h4'>
            {title}
          </Title>
          {date && (
            <Box component='time' fz={12} pb={5}>
              <time suppressHydrationWarning>{t('At "{date}"', { date: formattedDate })}</time>
            </Box>
          )}
        </Group>
      </PageLink>
      <Divider />
      <NoData isNoData={categories.length <= 0}>
        <BarChart
          h='100%'
          data={data || []}
          dataKey='name'
          series={series}
          valueFormatter={valueFormatter}
          type={stack ? 'stacked' : 'default'}
          withLegend
          yAxisProps={{
            allowDecimals: false,
            tickFormatter: (value: number) => Intl.NumberFormat().format(value).toString(),
          }}
          strokeDasharray='0 0'
          tooltipProps={{
            content: ({ label, payload }) => (
              <ChartTooltip
                label={label}
                // @ts-ignore
                payload={payload?.toReversed()}
                series={series}
                valueFormatter={valueFormatter}
              />
            ),
          }}
        />
      </NoData>
    </Stack>
    // </Card>
  );
};
