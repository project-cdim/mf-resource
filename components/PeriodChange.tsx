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

import { useState } from 'react';

import { Button, Group, Modal, Radio } from '@mantine/core';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

/**
 * Display calendar period change modal
 * @param props.chartDataChange Function to call when the period change button is clicked
 * @returns Calendar period change modal JSX.Element
 */
export const PeriodChange = (props: {
  /** Function to call when the period change button is clicked */
  chartDataChange: CallableFunction;
}) => {
  const t = useTranslations();
  const { chartDataChange } = props;
  /** Specifying the open props for <Modal> */
  const [opened, setOpened] = useState(false);
  /** Start Date */
  const [startDate, setStartDateValue] = useState<Date | null>(null);
  /** End Date */
  const [endDate, setEndDateValue] = useState<Date | null>(null);
  /** date or month */
  const [radioValue, setRadioValue] = useState('date');
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={t('Period designation')} size='auto'>
        <Radio.Group value={radioValue} onChange={setRadioValue} withAsterisk>
          <Group mt='xs'>
            <Radio value='date' label={t('Date selection')} />
            <Radio value='month' label={t('Month selection')} />
          </Group>
          <br />
        </Radio.Group>
        {
          // Date selection
          radioValue === 'date' ? (
            <div data-testid='DatePicker'>
              <DatePickerInput
                dropdownType='modal'
                label={t('Start date')}
                placeholder='Pick date'
                valueFormat='YYYY/MM/DD'
                defaultValue={dayjs(new Date()).startOf('month').toDate()}
                maxDate={dayjs(new Date()).toDate()}
                value={startDate}
                onChange={setStartDateValue}
                mx='auto'
                maw={200}
              />
              <DatePickerInput
                dropdownType='modal'
                label={t('End date')}
                placeholder='Pick date'
                valueFormat='YYYY/MM/DD'
                defaultValue={new Date()}
                maxDate={dayjs(new Date()).toDate()}
                value={endDate}
                onChange={setEndDateValue}
                mx='auto'
                maw={200}
              />
            </div>
          ) : (
            // Month selection
            <div data-testid='MonthPicker'>
              <MonthPickerInput
                dropdownType='modal'
                label={t('Start month')}
                placeholder='Pick date'
                valueFormat='YYYY/MM'
                defaultValue={new Date()}
                maxDate={dayjs(new Date()).toDate()}
                value={startDate}
                onChange={setStartDateValue}
                mx='auto'
                maw={200}
                monthsListFormat='MM'
                yearsListFormat='YY'
              />
              <MonthPickerInput
                dropdownType='modal'
                label={t('End month')}
                placeholder='Pick date'
                valueFormat='YYYY/MM'
                defaultValue={new Date()}
                maxDate={dayjs(new Date()).toDate()}
                value={endDate}
                onChange={setEndDateValue}
                mx='auto'
                maw={200}
                monthsListFormat='MM'
                yearsListFormat='YY'
              />
            </div>
          )
        }
        <br />
        <Group justify='flex-end'>
          <Button
            size='xs'
            onClick={() => {
              chartDataChange(startDate, endDate);
              setOpened(false);
            }}
            data-testid='button_decide'
          >
            {t('Select Period')}
          </Button>
        </Group>
      </Modal>
      <Group justify='flex-end'>
        <Button variant='outline' size='xs' onClick={() => setOpened(true)} data-testid='button_open'>
          {t('Select Period')}
        </Button>
      </Group>
    </>
  );
};
