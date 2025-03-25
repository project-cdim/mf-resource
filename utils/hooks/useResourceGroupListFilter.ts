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
import { APPResourceGroup } from '@/types';

import { isAllStringIncluded, isDateInRange } from '@/shared-modules/utils';
import { DateRange } from '@/shared-modules/types';

export type NumberOptionValue = 'notExist' | 'exist';
type APPResourceGroupQuery = {
  id: string;
  name: string;
  description: string;
  createdAt: DateRange;
  updatedAt: DateRange;
};
type APPResourceGroupSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  name: Dispatch<SetStateAction<string>>;
  description: Dispatch<SetStateAction<string>>;
  createdAt: Dispatch<SetStateAction<DateRange>>;
  updatedAt: Dispatch<SetStateAction<DateRange>>;
};

export type ResourceGroupListFilter = {
  /** Filtered records */
  filteredRecords: APPResourceGroup[];
  /** Filter values */
  query: APPResourceGroupQuery;
  /** Set functions */
  setQuery: APPResourceGroupSetQuery;
};

/**
 * Custom hook for ResourceGroup list filtering
 *
 * @param records All records
 * @param queryObject Initial filter values
 * @returns Filtered records, filter information
 */
export const useResourceGroupListFilter = (records: APPResourceGroup[]): ResourceGroupListFilter => {
  const [idQuery, setIdQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [createdAtQuery, setCreatedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [updatedAtQuery, setUpdatedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [debouncedNameQuery] = useDebouncedValue(nameQuery, 200);
  const [debouncedDescriptionQuery] = useDebouncedValue(descriptionQuery, 200);

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isAllStringIncluded(record.name, debouncedNameQuery) &&
        isAllStringIncluded(record.description, debouncedDescriptionQuery) &&
        isDateInRange(record.createdAt, createdAtQuery) &&
        isDateInRange(record.updatedAt, updatedAtQuery)
    );
  }, [records, debouncedIdQuery, debouncedNameQuery, debouncedDescriptionQuery, createdAtQuery, updatedAtQuery]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      name: nameQuery,
      description: descriptionQuery,
      createdAt: createdAtQuery,
      updatedAt: updatedAtQuery,
    },
    setQuery: {
      id: setIdQuery,
      name: setNameQuery,
      description: setDescriptionQuery,
      createdAt: setCreatedAtQuery,
      updatedAt: setUpdatedAtQuery,
    },
  };
};
