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

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';
import _ from 'lodash';
import { useTranslations } from 'next-intl';

import { availableOrder, healthOrder, stateOrder } from '@/shared-modules/constant';
import {
  APIDeviceAvailable,
  APIDeviceHealth,
  APIDeviceState,
  APIDeviceType,
  ResourceListQuery,
} from '@/shared-modules/types';
import { sortByDeviceType, isAllStringIncluded, isSelected } from '@/shared-modules/utils';
import { useQuery } from '@/shared-modules/utils/hooks';
import { APPResource } from '@/types';

type APPResourceQuery = {
  id: string;
  types: APIDeviceType[];
  states: APIDeviceState[];
  healths: APIDeviceHealth[];
  available: APIDeviceAvailable[];
  nodeIDs: string;
  cxlSwitchId: string;
  allocatedNodes: string[];
  allocatedCxl: string[];
};
type APPResourceSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  types: Dispatch<SetStateAction<APIDeviceType[]>>;
  states: Dispatch<SetStateAction<APIDeviceState[]>>;
  healths: Dispatch<SetStateAction<APIDeviceHealth[]>>;
  available: Dispatch<SetStateAction<APIDeviceAvailable[]>>;
  nodeIDs: Dispatch<SetStateAction<string>>;
  cxlSwitchId: Dispatch<SetStateAction<string>>;
  allocatedNodes: Dispatch<SetStateAction<string[]>>;
  allocatedCxl: Dispatch<SetStateAction<string[]>>;
};
export type ResourceListFilter = {
  /** Filtered records */
  filteredRecords: APPResource[];
  /** Filter values */
  query: APPResourceQuery;
  /** Set functions */
  setQuery: APPResourceSetQuery;
  /** MultiSelect options */
  selectOptions: {
    type: { value: APIDeviceType; label: string }[];
    state: APIDeviceState[];
    health: APIDeviceHealth[];
    available: { value: APIDeviceAvailable; label: string }[];
    allocate: { value: string; label: string }[];
  };
};

/**
 * Custom hook for resource list filter
 *
 * @param records All records
 * @returns Filtered records, filter information
 */
export const useResourceListFilter = (records: APPResource[]): ResourceListFilter => {
  const t = useTranslations();
  const queryObject = useResourceQuery();
  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [typeQuery, setTypeQuery] = useState<APIDeviceType[]>([]);
  const [stateQuery, setStateQuery] = useState<APIDeviceState[]>([]);
  const [healthQuery, setHealthQuery] = useState<APIDeviceHealth[]>([]);
  const [availableQuery, setAvailableQuery] = useState<APIDeviceAvailable[]>([]);
  const [allocatedNodesQuery, setAllocatedNodesQuery] = useState<string[]>([]);
  const [nodeIDsQuery, setNodeIDsQuery] = useState('');
  const [debouncedNodeIDsQuery] = useDebouncedValue(nodeIDsQuery, 200);
  const [allocatedCxlQuery, setAllocatedCxlquery] = useState<string[]>([]);
  const [cxlSwitchIdQuery, setCxlSwitchIdQuery] = useState('');
  const [debouncedCxlSwitchIdQuery] = useDebouncedValue(cxlSwitchIdQuery, 200);
  // MultiSelect options
  const deviceTypeInRecords = records.map((record) => record.type);
  const typeOptions = sortByDeviceType(deviceTypeInRecords).map((type) => ({
    value: type,
    label: _.upperFirst(type),
  }));

  /** Update luigi's query asynchronously using useEffect */
  useEffect(() => {
    setTypeQuery(queryObject.type);
    setHealthQuery(queryObject.health);
    setStateQuery(queryObject.state);
    setCxlSwitchIdQuery(queryObject.cxlSwitchId?.join(' ') || '');
    setAllocatedCxlquery(queryObject.allocatedCxl);
    setNodeIDsQuery(queryObject.nodeId?.join(' ') || '');
    setAllocatedNodesQuery(queryObject.allocatednode);
    setAvailableQuery(queryObject.resourceAvailable);
  }, [queryObject]);

  const stateInRecords = Array.from(new Set(records.map((record) => record.state)));
  const stateOptions = stateOrder.filter((item: APIDeviceState) => stateInRecords.includes(item));
  const healthInRecords = Array.from(new Set(records.map((record) => record.health)));
  const healthOptions = healthOrder.filter((item: APIDeviceHealth) => healthInRecords.includes(item));
  const availableInRecords = Array.from(new Set(records.map((record) => record.resourceAvailable)));
  const availableOptions = availableOrder
    .filter((item: APIDeviceAvailable) => availableInRecords.includes(item))
    .map((item) => {
      return { value: item, label: item === 'Available' ? t('Included') : t('Excluded') };
    });
  const allocateOptions = [
    { value: 'Unallocated', label: t('Unallocated') },
    { value: 'Allocated', label: t('Allocated') },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isSelected(record.type, typeQuery) &&
        isSelected(record.state, stateQuery) &&
        isSelected(record.health, healthQuery) &&
        isSelected(record.resourceAvailable, availableQuery) &&
        filterNodeIds(record.nodeIDs, allocatedNodesQuery, debouncedNodeIDsQuery) &&
        filterCxlSwitchIds(record.cxlSwitchId, allocatedCxlQuery, debouncedCxlSwitchIdQuery)
    );
  }, [
    records,
    debouncedIdQuery,
    typeQuery,
    stateQuery,
    healthQuery,
    availableQuery,
    debouncedNodeIDsQuery,
    debouncedCxlSwitchIdQuery,
    allocatedNodesQuery,
    allocatedCxlQuery,
  ]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      types: typeQuery,
      states: stateQuery,
      healths: healthQuery,
      available: availableQuery,
      nodeIDs: nodeIDsQuery,
      cxlSwitchId: cxlSwitchIdQuery,
      allocatedNodes: allocatedNodesQuery,
      allocatedCxl: allocatedCxlQuery,
    },
    setQuery: {
      id: setIdQuery,
      types: setTypeQuery,
      states: setStateQuery,
      healths: setHealthQuery,
      available: setAvailableQuery,
      nodeIDs: setNodeIDsQuery,
      cxlSwitchId: setCxlSwitchIdQuery,
      allocatedNodes: setAllocatedNodesQuery,
      allocatedCxl: setAllocatedCxlquery,
    },
    selectOptions: {
      type: typeOptions,
      state: stateOptions,
      health: healthOptions,
      available: availableOptions,
      allocate: allocateOptions,
    },
  };
};

const useResourceQuery = (): Required<ResourceListQuery> => {
  const query = useQuery();
  return useMemo(
    () => ({
      // Store as an array (empty array if undefined)
      type: query.type ? [splitAndFlatQueryString(query.type) as APIDeviceType[]].flat(2) : [],
      health: [(query.health as APIDeviceHealth | APIDeviceHealth[] | undefined) || []].flat(2),
      state: [(query.state as APIDeviceState | APIDeviceState[] | undefined) || []].flat(2),
      cxlSwitchId: [query.cxlSwitchId || []].flat(2),
      allocatedCxl: [query.allocatedCxl || []].flat(2),
      nodeId: [query.nodeId || []].flat(2),
      allocatednode: [query.allocatednode || []].flat(2),
      resourceAvailable: [(query.resourceAvailable as APIDeviceAvailable) || []].flat(2),
    }),
    [query]
  );
};

/**
 * Splits a string or an array of strings with ',', filters empty string and flattens the result.
 *
 * @param q - The string or array of strings to split and flatten.
 * @returns An array of strings after splitting and flattening the input.
 */
const splitAndFlatQueryString = (q: string | string[]): string[] => {
  if (Array.isArray(q)) return q.map(splitString).flat();

  return splitString(q);
};

const splitString = (s: string): string[] => {
  // regex to split by comma and remove empty strings in longest match
  const separator = /,\s*/;
  return s.split(separator).filter((item) => item !== '');
};

const filterNodeIds = (nodeIds: string[], allocatedNodesQuery: string[], debouncedNodeIDsQuery: string): boolean => {
  return (
    (debouncedNodeIDsQuery.trim() === '' ||
      nodeIds.some((recordID) => isAllStringIncluded(recordID, debouncedNodeIDsQuery))) &&
    isSelected(nodeIds.length > 0 ? 'Allocated' : 'Unallocated', allocatedNodesQuery)
  );
};

const filterCxlSwitchIds = (
  cxlSwitchIds: string,
  allocatedCxlQuery: string[],
  debouncedCxlSwitchIdQuery: string
): boolean => {
  return (
    isAllStringIncluded(cxlSwitchIds, debouncedCxlSwitchIdQuery) &&
    isSelected(cxlSwitchIds.length > 0 ? 'Allocated' : 'Unallocated', allocatedCxlQuery)
  );
};
