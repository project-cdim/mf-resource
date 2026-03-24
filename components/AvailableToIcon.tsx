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

import { useTranslations } from 'next-intl';

import { IconWithInfo } from '@/shared-modules/components';

/**
 * Props for AvailableToIcon component.
 */
export type AvailableToIconProps = {
  resourceAvailable: string;
};

/**
 * Returns an icon based on the availability of a resource.
 * @param props - Component props.
 * @param props.resourceAvailable - The availability of the resource.
 * @returns The icon component based on the availability.
 */
export const AvailableToIcon = ({ resourceAvailable }: AvailableToIconProps) => {
  const t = useTranslations();
  return resourceAvailable === 'Available' ? (
    <></>
  ) : (
    <IconWithInfo type='ban' label={t('This resource is under maintenance')} />
  );
};

/**
 * Props for AvailableToIconForNode component.
 */
export type AvailableToIconForNodeProps = {
  unavailableNumber: number;
};

/**
 * Returns an icon component based on the number of unavailable resources.
 * @param props - Component props.
 * @param props.unavailableNumber - The number of unavailable resources.
 * @returns The icon component.
 */
export const AvailableToIconForNode = ({ unavailableNumber }: AvailableToIconForNodeProps) => {
  const t = useTranslations();

  return unavailableNumber > 0 ? (
    <IconWithInfo type='ban' label={t('Some resources are under maintenance')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are available')} />
  );
};
