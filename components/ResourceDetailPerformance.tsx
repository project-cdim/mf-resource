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

import { Group, Stack, Title } from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';

import { GraphView } from '@/shared-modules/components';
import { GRAPH_CARD_HEIGHT } from '@/shared-modules/constant';
import { APIPromQL, APIresource } from '@/shared-modules/types';
import {
  formatEnergyValue,
  formatNetworkTransferValue,
  formatPercentValue,
  parseGraphData,
} from '@/shared-modules/utils';
import { DisplayPeriodPicker } from './DisplayPeriodPicker';

/**
 * Performance component displays the performance metrics for a resource.
 *
 * @param props - The component props.
 * @returns The Performance component.
 */
export const ResourceDetailPerformance = (props: {
  data?: APIresource;
  graphData?: APIPromQL;
  metricStartDate?: string;
  metricEndDate?: string;
  loading: boolean;
  dateRange: [Date, Date];
  setDateRange: React.Dispatch<React.SetStateAction<[Date, Date]>>;
}) => {
  const t = useTranslations();
  const currentLanguage = useLocale();

  return (
    <Stack>
      <Group justify='space-between'>
        <Title order={2} fz='lg'>
          {t('Performance')}
        </Title>
        <DisplayPeriodPicker value={props.dateRange} onChange={props.setDateRange} />
      </Group>
      <Group gap='1em' grow={true} h={GRAPH_CARD_HEIGHT}>
        <GraphView
          title={t('Energy Consumptions')}
          data={parseGraphData(
            props.graphData,
            `${props.data?.device.type}_energy`,
            currentLanguage,
            props.metricStartDate,
            props.metricEndDate
          )}
          valueFormatter={formatEnergyValue}
          loading={props.loading}
          dateRange={props.dateRange}
        />
        {props.data?.device.type === 'networkInterface' ? (
          <GraphView
            title={t('Network Transfer Speed')}
            data={parseGraphData(
              props.graphData,
              `${props.data?.device.type}_usage`,
              currentLanguage,
              props.metricStartDate,
              props.metricEndDate
            )}
            valueFormatter={formatNetworkTransferValue}
            loading={props.loading}
            dateRange={props.dateRange}
          />
        ) : (
          <GraphView
            title={t('Usage')}
            data={parseGraphData(
              props.graphData,
              `${props.data?.device.type}_usage`,
              currentLanguage,
              props.metricStartDate,
              props.metricEndDate
            )}
            valueFormatter={formatPercentValue}
            loading={props.loading}
            dateRange={props.dateRange}
          />
        )}
      </Group>
    </Stack>
  );
};
