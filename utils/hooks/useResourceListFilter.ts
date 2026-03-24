/*
 * Copyright 2025-2026 NEC Corporation.
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

import { availableOrder, healthOrder, overallStatusOrder, stateOrder } from '@/shared-modules/constant';
import {
  APIDeviceAvailable,
  APIDeviceDetection,
  APIDeviceHealth,
  APPDeviceOverallStatus,
  APIDevicePowerState,
  APIDeviceState,
  APIDeviceType,
  APIresource,
} from '@/shared-modules/types';
import { isAllStringIncluded, isSelected, arrangeDeviceType, arrangePowerStates } from '@/shared-modules/utils';
import { useQueryArrayObject } from '@/shared-modules/utils/hooks';
import { APPResource } from '@/types';
import { parsePlacement } from '@/utils/parse';

type APPResourceQuery = {
  id: string;
  types: APIDeviceType[];
  statuses: APPDeviceOverallStatus[];
  powerStates: APIDevicePowerState[];
  healths: APIDeviceHealth[];
  states: APIDeviceState[];
  detection: APIDeviceDetection[];
  resourceGroups: string;
  placement: string;
  cxlSwitch: string;
  allocatedCxl: string[];
  nodeIDs: string;
  allocatedNodes: string[];
  composite: string[];
  available: APIDeviceAvailable[];
};
type APPResourceSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  types: Dispatch<SetStateAction<APIDeviceType[]>>;
  statuses: Dispatch<SetStateAction<APPDeviceOverallStatus[]>>;
  powerStates: Dispatch<SetStateAction<APIDevicePowerState[]>>;
  healths: Dispatch<SetStateAction<APIDeviceHealth[]>>;
  states: Dispatch<SetStateAction<APIDeviceState[]>>;
  detection: Dispatch<SetStateAction<APIDeviceDetection[]>>;
  resourceGroups: Dispatch<SetStateAction<string>>;
  placement: Dispatch<SetStateAction<string>>;
  cxlSwitch: Dispatch<SetStateAction<string>>;
  allocatedCxl: Dispatch<SetStateAction<string[]>>;
  nodeIDs: Dispatch<SetStateAction<string>>;
  allocatedNodes: Dispatch<SetStateAction<string[]>>;
  composite: Dispatch<SetStateAction<string[]>>;
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
    status: { value: APPDeviceOverallStatus; label: string }[];
    powerState: { value: string; label: string }[];
    health: APIDeviceHealth[];
    state: APIDeviceState[];
    detection: { value: APIDeviceDetection; label: string }[];
    available: { value: APIDeviceAvailable; label: string }[];
    allocate: { value: string; label: string }[];
    composite: { value: string; label: string }[];
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
  const [statusQuery, setStatusQuery] = useState<APPDeviceOverallStatus[]>([]);
  const [powerStateQuery, setPowerStateQuery] = useState<APIDevicePowerState[]>([]);
  const [healthQuery, setHealthQuery] = useState<APIDeviceHealth[]>([]);
  const [stateQuery, setStateQuery] = useState<APIDeviceState[]>([]);
  const [detectionQuery, setDetectionQuery] = useState<APIDeviceDetection[]>([]);
  const [resourceGroupsQuery, setResourceGroupsQuery] = useState('');
  const [debouncedResourceGroupsQuery] = useDebouncedValue(resourceGroupsQuery, 200);
  const [placementQuery, setPlacementQuery] = useState('');
  const [debouncedPlacementQuery] = useDebouncedValue(placementQuery, 200);
  const [availableQuery, setAvailableQuery] = useState<APIDeviceAvailable[]>([]);
  const [allocatedNodesQuery, setAllocatedNodesQuery] = useState<string[]>([]);
  const [nodeIDsQuery, setNodeIDsQuery] = useState('');
  const [debouncedNodeIDsQuery] = useDebouncedValue(nodeIDsQuery, 200);
  const [allocatedCxlQuery, setAllocatedCxlquery] = useState<string[]>([]);
  const [cxlSwitchQuery, setCxlSwitchQuery] = useState('');
  const [debouncedCxlSwitchQuery] = useDebouncedValue(cxlSwitchQuery, 200);
  const [compositeQuery, setCompositeQuery] = useState<string[]>([]);

  const queryObject = useQueryArrayObject();

  useEffect(() => {
    setTypeQuery(queryObject.type as APIDeviceType[]);
    setStatusQuery(queryObject.status as APPDeviceOverallStatus[]);
    setPowerStateQuery(queryObject.power as APIDevicePowerState[]);
    setHealthQuery(queryObject.health as APIDeviceHealth[]);
    setStateQuery(queryObject.state as APIDeviceState[]);
    setDetectionQuery(queryObject.detection as APIDeviceDetection[]);
    setResourceGroupsQuery(queryObject.resourceGroup.join(' ') || '');
    setPlacementQuery(queryObject.placement.join(' ') || '');
    setNodeIDsQuery(queryObject.nodeId.join(' ') || '');
    setAllocatedNodesQuery(queryObject.allocatednode);
    setCxlSwitchQuery(queryObject.cxlSwitch.join(' ') || '');
    setAllocatedCxlquery(queryObject.allocatedCxl);
    setCompositeQuery(queryObject.composite);
    setAvailableQuery(queryObject.resourceAvailable as APIDeviceAvailable[]);
  }, [queryObject]);

  const typeOptions = arrangeDeviceType(records.map((record) => record.type)).map((type) => ({
    value: type,
    label: _.upperFirst(type),
  }));
  const statusOptions = overallStatusOrder.map((status) => ({
    value: status,
    label: t(status),
  }));
  const powerStateOptions = arrangePowerStates(records.map((record) => record.powerState)).map((powerState) => ({
    value: powerState,
    label: t.has(powerState) ? t(powerState) : powerState,
  }));
  const stateOptions = [...stateOrder];
  const healthOptions = [...healthOrder];
  const availableOptions = availableOrder.map((item) => {
    return { value: item, label: item === 'Available' ? `(${t('none')})` : t('Under Maintenance') };
  });
  const allocateOptions: { value: string; label: string }[] = [
    { value: 'Unallocated', label: t('Unallocated') },
    { value: 'Allocated', label: t('Allocated') },
  ];
  const detectionOptions: { value: APIDeviceDetection; label: string }[] = [
    { value: 'Detected', label: t('Detected') },
    { value: 'Not Detected', label: t('Not Detected') },
  ];
  const compositeOptions: { value: string; label: string }[] = [
    { value: 'Composite', label: t('Composite') },
    { value: 'none', label: `(${t('none')})` },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      // eslint-disable-next-line complexity
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isSelected(record.type, typeQuery) &&
        isSelected(record.status, statusQuery) &&
        isSelected(record.powerState, powerStateQuery) &&
        isSelected(record.health, healthQuery) &&
        isSelected(record.state, stateQuery) &&
        isSelected(record.detected ? 'Detected' : 'Not Detected', detectionQuery) &&
        // Records of a resource group column are filtered by display value. For example if a record displays IDs, a record is filtered by IDs.
        filterResourceGroups(record.resourceGroups, debouncedResourceGroupsQuery) &&
        filterPlacement(record.placement, debouncedPlacementQuery) &&
        filterCxlSwitches(record.cxlSwitch, allocatedCxlQuery, debouncedCxlSwitchQuery) &&
        filterNodeIds(record.nodeIDs, allocatedNodesQuery, debouncedNodeIDsQuery) &&
        isSelected(record.composite !== '' ? 'Composite' : 'none', compositeQuery) &&
        isSelected(record.resourceAvailable, availableQuery)
    );
  }, [
    records,
    debouncedIdQuery,
    typeQuery,
    statusQuery,
    powerStateQuery,
    healthQuery,
    stateQuery,
    detectionQuery,
    debouncedResourceGroupsQuery,
    debouncedPlacementQuery,
    debouncedCxlSwitchQuery,
    allocatedCxlQuery,
    debouncedNodeIDsQuery,
    allocatedNodesQuery,
    compositeQuery,
    availableQuery,
  ]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      types: typeQuery,
      statuses: statusQuery,
      powerStates: powerStateQuery,
      healths: healthQuery,
      states: stateQuery,
      detection: detectionQuery,
      resourceGroups: resourceGroupsQuery,
      placement: placementQuery,
      nodeIDs: nodeIDsQuery,
      cxlSwitch: cxlSwitchQuery,
      allocatedNodes: allocatedNodesQuery,
      allocatedCxl: allocatedCxlQuery,
      composite: compositeQuery,
      available: availableQuery,
    },
    setQuery: {
      id: setIdQuery,
      types: setTypeQuery,
      statuses: setStatusQuery,
      powerStates: setPowerStateQuery,
      healths: setHealthQuery,
      states: setStateQuery,
      detection: setDetectionQuery,
      resourceGroups: setResourceGroupsQuery,
      placement: setPlacementQuery,
      nodeIDs: setNodeIDsQuery,
      cxlSwitch: setCxlSwitchQuery,
      allocatedNodes: setAllocatedNodesQuery,
      allocatedCxl: setAllocatedCxlquery,
      composite: setCompositeQuery,
      available: setAvailableQuery,
    },
    selectOptions: {
      type: typeOptions,
      status: statusOptions,
      powerState: powerStateOptions,
      health: healthOptions,
      state: stateOptions,
      detection: detectionOptions,
      allocate: allocateOptions,
      available: availableOptions,
      composite: compositeOptions,
    },
  };
};

const filterResourceGroups = (resourceGroups: { name: string; id: string }[], debouncedResourceGroupsQuery: string) => {
  return (
    debouncedResourceGroupsQuery.trim() === '' ||
    resourceGroups.some(({ name, id }) => isAllStringIncluded(name !== '' ? name : id, debouncedResourceGroupsQuery))
  );
};

const filterPlacement = (placement: APIresource['physicalLocation'] | undefined, debouncedPlacementQuery: string) => {
  if (debouncedPlacementQuery.trim() === '') {
    return true;
  }

  const showPlacement = parsePlacement(placement);
  if (!showPlacement) {
    return false;
  }

  return isAllStringIncluded(showPlacement, debouncedPlacementQuery);
};

const filterNodeIds = (nodeIds: string[], allocatedNodesQuery: string[], debouncedNodeIDsQuery: string): boolean => {
  return (
    (debouncedNodeIDsQuery.trim() === '' ||
      nodeIds.some((recordID) => isAllStringIncluded(recordID, debouncedNodeIDsQuery))) &&
    isSelected(nodeIds.length > 0 ? 'Allocated' : 'Unallocated', allocatedNodesQuery)
  );
};

const filterCxlSwitches = (
  cxlSwitches: string[],
  allocatedCxlQuery: string[],
  debouncedCxlSwitchQuery: string
): boolean => {
  const idsString = cxlSwitches.join(' ');
  return (
    isAllStringIncluded(idsString, debouncedCxlSwitchQuery) &&
    isSelected(cxlSwitches.length > 0 ? 'Allocated' : 'Unallocated', allocatedCxlQuery)
  );
};
