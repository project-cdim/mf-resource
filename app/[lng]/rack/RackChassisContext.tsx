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

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

import { APIresource } from '@/shared-modules/types';

import { APIChassis, APIrack } from '@/types';

/** Context for managing selected chassis state */
interface RackChassisContextType {
  /** Selected chassis ID */
  selectedChassisId: string | undefined;
  /** Set selected chassis ID */
  setSelectedChassisId: (chassisId: string | undefined) => void;
  /** Selected chassis object */
  selectedChassis: APIChassis | undefined;
  /** Resources for selected chassis */
  selectedChassisResources: APIresource[];
}

const RackChassisContext = createContext<RackChassisContextType | undefined>(undefined);

/** Props for RackChassisProvider */
interface RackChassisProviderProps {
  children: ReactNode;
  rackData: APIrack | undefined;
}

/**
 * Provider component for managing selected chassis state and resources.
 * Converts chassis resources to APIresource format only for the selected chassis.
 *
 * @param props - Provider props containing children and rack data
 * @returns Provider component
 */
export const RackChassisProvider = ({ children, rackData }: RackChassisProviderProps) => {
  const [selectedChassisId, setSelectedChassisId] = useState<string | undefined>(undefined);

  // Find selected chassis object
  const selectedChassis = useMemo(() => {
    if (!rackData || !selectedChassisId) {
      return undefined;
    }
    return rackData.chassis.find((chassis) => chassis.id === selectedChassisId);
  }, [rackData, selectedChassisId]);

  // Convert resources only for selected chassis
  const selectedChassisResources = useMemo(() => {
    if (!rackData || !selectedChassis) {
      return [];
    }

    const resources: APIresource[] = selectedChassis.deviceUnits.flatMap((deviceUnit) =>
      deviceUnit.resources.map((resource) => ({
        ...resource,
        // Add physicalLocation information
        physicalLocation: {
          rack: {
            id: rackData.id,
            name: rackData.name,
            chassis: {
              id: selectedChassis.id,
              name: selectedChassis.name,
            },
          },
        },
        // Add deviceUnit information
        deviceUnit: {
          id: deviceUnit.id,
          annotation: deviceUnit.annotation,
        },
      }))
    );

    return resources;
  }, [rackData, selectedChassis]);

  const value = useMemo(
    () => ({
      selectedChassisId,
      setSelectedChassisId,
      selectedChassis,
      selectedChassisResources,
    }),
    [selectedChassisId, selectedChassis, selectedChassisResources]
  );

  return <RackChassisContext.Provider value={value}>{children}</RackChassisContext.Provider>;
};

/**
 * Custom hook to access RackChassisContext.
 * Must be used within RackChassisProvider.
 *
 * @returns RackChassisContext value
 * @throws Error if used outside of RackChassisProvider
 */
export const useRackChassisContext = () => {
  const context = useContext(RackChassisContext);
  if (context === undefined) {
    throw new Error('useRackChassisContext must be used within RackChassisProvider');
  }
  return context;
};
