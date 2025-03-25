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

import { useTranslations } from 'next-intl';

import { IconWithInfo } from '@/shared-modules/components';

/**
 * Returns an icon based on the availability of a resource.
 * @param resourceAvailable - The availability of the resource.
 * @returns The icon component based on the availability.
 */
export const AvailableToIcon = (resourceAvailable: string) => {
  const t = useTranslations();
  return resourceAvailable === 'Available' ? (
    <IconWithInfo type='check' label={t('Resource will be the subject of the subsequent design')} />
  ) : (
    <IconWithInfo type='ban' label={t('Resource will be excluded from subsequent designs')} />
  );
};

/**
 * Returns an icon component based on the number of unavailable resources.
 *
 * @param unavailable_number - The number of unavailable resources.
 * @returns The icon component.
 */
export const AvailableToIconForNode = (unavailable_number: number) => {
  const t = useTranslations();

  return unavailable_number > 0 ? (
    <IconWithInfo type='ban' label={t('Some resources will be excluded from subsequent designs')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are subject to subsequent designs')} />
  );
};
