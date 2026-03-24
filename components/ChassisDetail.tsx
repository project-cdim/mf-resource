/*
 * Copyright 2026 NEC Corporation.
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

import React, { useMemo } from 'react';

import { ActionIcon, Group, Select, Space, Table, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';

import { CardLoading } from '@/shared-modules/components';

import type { APIChassis } from '@/types';

import { useRackChassisContext } from '@/app/[lng]/rack/RackChassisContext';

/**
 * Renders a button for editing.
 * @returns The rendered button component.
 */
const ButtonEdit = () => {
  const t = useTranslations();
  return (
    <ActionIcon disabled={true} size={30} title={t('Edit')} style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}>
      <IconPencil />
    </ActionIcon>
  );
};

/**
 * Renders a delete button.
 * @returns The delete button component.
 */
const ButtonDelete = () => {
  const t = useTranslations();
  return (
    <ActionIcon disabled={true} size={30} title={t('Delete')} style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}>
      <IconTrash />
    </ActionIcon>
  );
};

/**
 * Counts the number of device types in the given chassis.
 *
 * @param chassis - An APIChassis object.
 * @returns A string representing the count of each device type in the format "DeviceType(count)".
 */
const countDeviceTypes = (chassis?: APIChassis): string => {
  if (!chassis) {
    return '';
  }

  const countMap: { [key: string]: number } = {};

  for (const deviceUnit of chassis.deviceUnits) {
    for (const resource of deviceUnit.resources) {
      const deviceType = resource.device.type;
      countMap[deviceType] = countMap[deviceType] + 1 || 1;
    }
  }

  return Object.entries(countMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${_.upperFirst(key)}(${value})`)
    .join(', ');
};

/**
 * Renders the ChassisDetail component.
 *
 * @param props - The component props.
 * @returns The rendered ChassisDetail component.
 */
// eslint-disable-next-line complexity
export const ChassisDetail = (props: { loading: boolean; chassisList: APIChassis[] | undefined }) => {
  const t = useTranslations();
  const { loading, chassisList } = props;
  const { selectedChassisId, setSelectedChassisId, selectedChassis } = useRackChassisContext();

  /** Get language settings */
  const currentLanguage = useLocale();
  const { Th, Tbody, Td, Tr } = Table;

  // Memoize device type counts to avoid recalculating on every render
  const deviceTypeCounts = useMemo(() => countDeviceTypes(selectedChassis), [selectedChassis]);

  return (
    <CardLoading withBorder loading={loading}>
      <Group justify='space-between'>
        <Text>{t('Selected chassis')}</Text>
        <Group justify='space-between' gap='xs'>
          <ButtonEdit />
          <ButtonDelete />
        </Group>
      </Group>
      <Space h='sm' />

      <article>
        <Group gap='xs'>
          <Select
            key={selectedChassisId || 'no-selection'}
            data-testid='select-testid'
            placeholder={t('chassis')}
            value={selectedChassisId || ''}
            style={{ flexGrow: '1' }}
            data={[
              {
                group: t('Front'),
                items:
                  chassisList
                    ?.filter((item) => item.facePosition === 'Front')
                    .map((item) => ({ value: item.id, label: item.name || item.id })) ?? [],
              },
              {
                group: t('Rear'),
                items:
                  chassisList
                    ?.filter((item) => item.facePosition === 'Rear')
                    .map((item) => ({ value: item.id, label: item.name || item.id })) ?? [],
              },
            ]}
            onChange={(id) => {
              setSelectedChassisId(id || undefined);
            }}
          />
        </Group>
        <Space h='sm' />
        <Table>
          <Tbody>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Model Name')}</Th>
              <Td>{selectedChassis?.modelName}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Description')}</Th>
              <Td>{selectedChassis?.description}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Position')}</Th>
              <Td>
                {selectedChassis ? 'U' + selectedChassis.unitPosition + ' / ' + selectedChassis.facePosition : ''}
              </Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Height(U)')}</Th>
              <Td>{selectedChassis?.height}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Depth')}</Th>
              <Td>{selectedChassis?.depth}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: currentLanguage === 'ja' ? 'nowrap' : 'normal' }}>
                {t('Number of devices per type')}
              </Th>
              <Td>{deviceTypeCounts}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Created')}</Th>
              <Td>
                {selectedChassis?.createdAt && new Date(selectedChassis.createdAt).toLocaleString(currentLanguage)}
              </Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Updated')}</Th>
              <Td>
                {selectedChassis?.updatedAt && new Date(selectedChassis.updatedAt).toLocaleString(currentLanguage)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </article>
    </CardLoading>
  );
};
