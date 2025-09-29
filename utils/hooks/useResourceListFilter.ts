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
  APIDeviceDetection,
  APIDeviceHealth,
  APIDeviceState,
  APIDeviceType,
} from '@/shared-modules/types';
import { isAllStringIncluded, isSelected, sortByDeviceType } from '@/shared-modules/utils';
import { useQueryArrayObject } from '@/shared-modules/utils/hooks';
import { APPResource } from '@/types';

type APPResourceQuery = {
  id: string;
  types: APIDeviceType[];
  healths: APIDeviceHealth[];
  states: APIDeviceState[];
  detection: APIDeviceDetection[];
  resourceGroups: string;
  cxlSwitchId: string;
  allocatedCxl: string[];
  nodeIDs: string;
  allocatedNodes: string[];
  available: APIDeviceAvailable[];
};
type APPResourceSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  types: Dispatch<SetStateAction<APIDeviceType[]>>;
  healths: Dispatch<SetStateAction<APIDeviceHealth[]>>;
  states: Dispatch<SetStateAction<APIDeviceState[]>>;
  detection: Dispatch<SetStateAction<APIDeviceDetection[]>>;
  resourceGroups: Dispatch<SetStateAction<string>>;
  cxlSwitchId: Dispatch<SetStateAction<string>>;
  allocatedCxl: Dispatch<SetStateAction<string[]>>;
  nodeIDs: Dispatch<SetStateAction<string>>;
  allocatedNodes: Dispatch<SetStateAction<string[]>>;
  available: Dispatch<SetStateAction<APIDeviceAvailable[]>>;
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
    type: { value: string; label: string }[];
    health: APIDeviceHealth[];
    state: APIDeviceState[];
    detection: { value: APIDeviceDetection; label: string }[];
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
  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [typeQuery, setTypeQuery] = useState<APIDeviceType[]>([]);
  const [healthQuery, setHealthQuery] = useState<APIDeviceHealth[]>([]);
  const [stateQuery, setStateQuery] = useState<APIDeviceState[]>([]);
  const [detectionQuery, setDetectionQuery] = useState<APIDeviceDetection[]>([]);
  const [resourceGroupsQuery, setResourceGroupsQuery] = useState('');
  const [debouncedResourceGroupsQuery] = useDebouncedValue(resourceGroupsQuery, 200);
  const [availableQuery, setAvailableQuery] = useState<APIDeviceAvailable[]>([]);
  const [allocatedNodesQuery, setAllocatedNodesQuery] = useState<string[]>([]);
  const [nodeIDsQuery, setNodeIDsQuery] = useState('');
  const [debouncedNodeIDsQuery] = useDebouncedValue(nodeIDsQuery, 200);
  const [allocatedCxlQuery, setAllocatedCxlquery] = useState<string[]>([]);
  const [cxlSwitchIdQuery, setCxlSwitchIdQuery] = useState('');
  const [debouncedCxlSwitchIdQuery] = useDebouncedValue(cxlSwitchIdQuery, 200);

  const queryObject = useQueryArrayObject();

  useEffect(() => {
    setTypeQuery(queryObject.type as APIDeviceType[]);
    setHealthQuery(queryObject.health as APIDeviceHealth[]);
    setStateQuery(queryObject.state as APIDeviceState[]);
    setDetectionQuery(queryObject.detection as APIDeviceDetection[]);
    setResourceGroupsQuery(queryObject.resourceGroup.join(' ') || '');
    setNodeIDsQuery(queryObject.nodeId.join(' ') || '');
    setAllocatedNodesQuery(queryObject.allocatednode);
    setCxlSwitchIdQuery(queryObject.cxlSwitchId.join(' ') || '');
    setAllocatedCxlquery(queryObject.allocatedCxl);
    setAvailableQuery(queryObject.resourceAvailable as APIDeviceAvailable[]);
  }, [queryObject]);

  const typeOptions = sortByDeviceType(records.map((record) => record.type)).map((type) => ({
    value: type,
    label: _.upperFirst(type),
  }));

  const stateOptions = [...stateOrder];
  const healthOptions = [...healthOrder];
  const availableOptions = availableOrder.map((item) => {
    return { value: item, label: item === 'Available' ? t('Included') : t('Excluded') };
  });
  const allocateOptions: { value: string; label: string }[] = [
    { value: 'Unallocated', label: t('Unallocated') },
    { value: 'Allocated', label: t('Allocated') },
  ];
  const detectionOptions: { value: APIDeviceDetection; label: string }[] = [
    { value: 'Detected', label: t('Detected') },
    { value: 'Not Detected', label: t('Not Detected') },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isSelected(record.type, typeQuery) &&
        isSelected(record.health, healthQuery) &&
        isSelected(record.state, stateQuery) &&
        isSelected(record.detected ? 'Detected' : 'Not Detected', detectionQuery) &&
        // Records of a resource group column are filtered by display value. For example if a record displays IDs, a record is filtered by IDs.
        filterResourceGroups(record.resourceGroups, debouncedResourceGroupsQuery) &&
        filterCxlSwitchIds(record.cxlSwitchId, allocatedCxlQuery, debouncedCxlSwitchIdQuery) &&
        filterNodeIds(record.nodeIDs, allocatedNodesQuery, debouncedNodeIDsQuery) &&
        isSelected(record.resourceAvailable, availableQuery)
    );
  }, [
    records,
    debouncedIdQuery,
    typeQuery,
    healthQuery,
    stateQuery,
    detectionQuery,
    debouncedResourceGroupsQuery,
    debouncedCxlSwitchIdQuery,
    allocatedCxlQuery,
    debouncedNodeIDsQuery,
    allocatedNodesQuery,
    availableQuery,
  ]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      types: typeQuery,
      healths: healthQuery,
      states: stateQuery,
      detection: detectionQuery,
      resourceGroups: resourceGroupsQuery,
      nodeIDs: nodeIDsQuery,
      cxlSwitchId: cxlSwitchIdQuery,
      allocatedNodes: allocatedNodesQuery,
      allocatedCxl: allocatedCxlQuery,
      available: availableQuery,
    },
    setQuery: {
      id: setIdQuery,
      types: setTypeQuery,
      healths: setHealthQuery,
      states: setStateQuery,
      detection: setDetectionQuery,
      resourceGroups: setResourceGroupsQuery,
      nodeIDs: setNodeIDsQuery,
      cxlSwitchId: setCxlSwitchIdQuery,
      allocatedNodes: setAllocatedNodesQuery,
      allocatedCxl: setAllocatedCxlquery,
      available: setAvailableQuery,
    },
    selectOptions: {
      type: typeOptions,
      health: healthOptions,
      state: stateOptions,
      detection: detectionOptions,
      allocate: allocateOptions,
      available: availableOptions,
    },
  };
};

const filterResourceGroups = (resourceGroups: { name: string; id: string }[], debouncedResourceGroupsQuery: string) => {
  return (
    debouncedResourceGroupsQuery.trim() === '' ||
    resourceGroups.some(({ name, id }) => isAllStringIncluded(name !== '' ? name : id, debouncedResourceGroupsQuery))
  );
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
