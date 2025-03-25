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

import {
  Card,
  ColorSwatch,
  Divider,
  Group,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useTranslations } from 'next-intl';

import { PageLink } from '@/shared-modules/components';
import { PERCENT } from '@/shared-modules/constant';
import { ResourceListQuery } from '@/shared-modules/types';
import { bytesToUnit } from '@/shared-modules/utils/bytesToUnit';
import { formatUnitValue } from '@/shared-modules/utils/formatUnitValue';

export type StorageGraphViewData = {
  /** Used capacity */
  used: number | undefined;
  /** Allocated capacity per node */
  allocated: number | undefined;
  /** Overall capacity */
  overall: number | undefined;
};

/** Props for the StorageGraphView component */
export type StorageGraphViewProps = {
  /** Title */
  title: string;
  /** Capacity data */
  data: StorageGraphViewData;
  /** Link destination */
  link?: string;
  linkTitle?: string;
  /** Link destination query parameters */
  query?: ResourceListQuery;
};

/**
 * Component that displays a graph
 *
 * @param props {@link StorageGraphViewProps}
 * @returns Graph JSX.Element
 */
export const StorageGraphView = (props: StorageGraphViewProps) => {
  const t = useTranslations();

  const { title, data, link, linkTitle, query } = props;
  const { used, allocated, overall } = data;
  const theme = useMantineTheme();
  /** Perform calculations and add units */
  const calculateValues = (value: number | undefined, total: number | undefined) => {
    if (value === undefined || total === undefined || total === 0) {
      return { bytes: 'B', percentage: '-' };
    }
    const unit = bytesToUnit(value);
    return {
      bytes: `${formatUnitValue('storage', value, unit)} ${unit}`,
      percentage: `${Math.floor((PERCENT * value) / total)}%`,
    };
  };
  const usedValues = calculateValues(used, overall);
  const allocatedValues = calculateValues(allocated, overall);
  const overallBytes =
    overall === undefined
      ? '- B'
      : `${formatUnitValue('storage', overall, bytesToUnit(overall))} ${bytesToUnit(overall)}`;

  return (
    <Card withBorder h='100%'>
      <Stack justify='flex-end' h={'100%'}>
        <PageLink
          title={linkTitle || t('View details')}
          path={link}
          query={query}
          color='rgb(55 65 81 / var(--tw-text-opacity))'
        >
          <Group mih='2.90625rem' align='flex-end'>
            <Title order={3} size='h4'>
              {title}
            </Title>
          </Group>
        </PageLink>
        <Divider />
        <Progress.Root mt='lg' radius='xs' size={40}>
          <Tooltip label={`${t('Used')} ${usedValues.bytes}`}>
            <Progress.Section value={used && overall ? (used / overall) * PERCENT : 0} color='blue.6' />
          </Tooltip>

          <Tooltip label={`${t('Allocated')} ${allocatedValues.bytes}`}>
            <Progress.Section
              value={overall && allocated ? ((allocated - (used ?? 0)) / overall) * PERCENT : 0}
              color='gray.5'
            />
          </Tooltip>
        </Progress.Root>

        <Legend
          legendItems={[
            { color: theme.colors.blue[6], text: `${t('Used')} ${usedValues.percentage} (${usedValues.bytes})` },
            {
              color: theme.colors.gray[5],
              text: `${t('Allocated')} ${allocatedValues.percentage} (${allocatedValues.bytes})`,
            },
            { color: theme.colors.gray[2], text: `${t('Total Capacity')} ${overallBytes}` },
          ]}
        />
      </Stack>
    </Card>
  );
};

/**
 * Generates a legend component based on the provided legend items.
 *
 * @param legendItems - An array of objects representing the legend items.
 * Each object should have a `color` property representing the color of the item,
 * and a `text` property representing the text to be displayed for the item.
 * @returns A React component representing the legend.
 */
const Legend = ({ legendItems }: { legendItems: { color: string; text: string }[] }) => (
  <Stack mt='lg' gap={2} mb='auto'>
    {legendItems.map((item, index) => (
      <Group key={index}>
        <ColorSwatch color={item.color} radius='xs' size='25' />
        <Text size='xl'>{item.text}</Text>
      </Group>
    ))}
  </Stack>
);
