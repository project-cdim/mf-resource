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

import { DateRangePickerInput, IconWithInfo } from '@/shared-modules/components';
import { Group, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

/**
 * DisplayPeriodPicker component allows users to select a date range for displaying data.
 *
 * @component
 * @returns The rendered DisplayPeriodPicker component.
 */

export type DisplayPeriodPickerProps = {
  value: [Date, Date];
  onChange: (range: [Date, Date]) => void;
};

export const DisplayPeriodPicker = ({ value, onChange }: DisplayPeriodPickerProps) => {
  const t = useTranslations();
  return (
    <Group gap={5}>
      <Text fz='sm'>{t('Display period')}</Text>
      <IconWithInfo type='info' label={t('Display period of performance information')} />
      <DateRangePickerInput value={value} onChange={onChange} />
    </Group>
  );
};
