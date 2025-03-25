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

import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';
import { useTranslations } from 'next-intl';

import { APPCxlSwitch } from '@/types';

import { NumberOptionValue } from './useNodeListFilter';
import { isAllStringIncluded, isExistanceSelected } from '@/shared-modules/utils';

type APPCxlSwitchQuery = {
  id: string;
  connected: NumberOptionValue[];
  unallocated: NumberOptionValue[];
  disabled: NumberOptionValue[];
  warning: NumberOptionValue[];
  critical: NumberOptionValue[];
  unavailable: NumberOptionValue[];
};
type APPCxlSwitchSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  connected: Dispatch<SetStateAction<NumberOptionValue[]>>;
  unallocated: Dispatch<SetStateAction<NumberOptionValue[]>>;
  disabled: Dispatch<SetStateAction<NumberOptionValue[]>>;
  warning: Dispatch<SetStateAction<NumberOptionValue[]>>;
  critical: Dispatch<SetStateAction<NumberOptionValue[]>>;
  unavailable: Dispatch<SetStateAction<NumberOptionValue[]>>;
};

export type CxlSwitchListFilter = {
  /** Filtered records */
  filteredRecords: APPCxlSwitch[];
  /** Filter values */
  query: APPCxlSwitchQuery;
  /** Set functions */
  setQuery: APPCxlSwitchSetQuery;
  /** MultiSelect options */
  selectOptions: {
    number: { value: NumberOptionValue; label: string }[];
  };
};

/**
 * Custom hook for CxlSwitch list filter
 *
 * @param records All records
 * @param queryObject Initial filter values
 * @returns Filtered records, filter information
 */
export const useCxlSwitchListFilter = (records: APPCxlSwitch[]): CxlSwitchListFilter => {
  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [connectedQuery, setConnectedQuery] = useState<NumberOptionValue[]>([]);
  const [unallocatedQuery, setUnallocatedQuery] = useState<NumberOptionValue[]>([]);
  const [disabledQuery, setDisabledQuery] = useState<NumberOptionValue[]>([]);
  const [warningQuery, setWarningQuery] = useState<NumberOptionValue[]>([]);
  const [criticalQuery, setCriticalQuery] = useState<NumberOptionValue[]>([]);
  const [unavailableQuery, setUnavailableQuery] = useState<NumberOptionValue[]>([]);

  const t = useTranslations();

  // MultiSelect options
  const numberOptions: { value: NumberOptionValue; label: string }[] = [
    { value: 'notExist', label: t('equal 0') },
    { value: 'exist', label: t('1 or more') },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isExistanceSelected(record.device.connected, connectedQuery) &&
        isExistanceSelected(record.device.unallocated, unallocatedQuery) &&
        isExistanceSelected(record.device.disabled, disabledQuery) &&
        isExistanceSelected(record.device.warning, warningQuery) &&
        isExistanceSelected(record.device.critical, criticalQuery) &&
        isExistanceSelected(record.device.resourceUnavailable, unavailableQuery)
    );
  }, [
    records,
    debouncedIdQuery,
    connectedQuery,
    unallocatedQuery,
    disabledQuery,
    warningQuery,
    criticalQuery,
    unavailableQuery,
  ]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      connected: connectedQuery,
      unallocated: unallocatedQuery,
      disabled: disabledQuery,
      warning: warningQuery,
      critical: criticalQuery,
      unavailable: unavailableQuery,
    },
    setQuery: {
      id: setIdQuery,
      connected: setConnectedQuery,
      unallocated: setUnallocatedQuery,
      disabled: setDisabledQuery,
      warning: setWarningQuery,
      critical: setCriticalQuery,
      unavailable: setUnavailableQuery,
    },
    selectOptions: { number: numberOptions },
  };
};
