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
 * Converts a health status string to an icon component.
 *
 * @param health - The health status string.
 * @returns The corresponding icon component based on the health status.
 */
export const HealthToIcon = (health: string | undefined) => {
  const t = useTranslations();
  if (!health) return null;
  switch (health) {
    case 'OK':
      return <IconWithInfo type='check' label={t('Resource is working properly')} />;
    case 'Warning':
      return <IconWithInfo type='warning' label={t('A condition requires attention')} />;
    case 'Critical':
      return (
        <IconWithInfo type='critical' label={t('A critical condition exists that requires immediate attention')} />
      );
    default:
      return null;
  }
};

/**
 * Converts a warning number to an icon with corresponding label.
 * @param warning_number - The number of warnings.
 * @returns An IconWithInfo component with the appropriate icon and label.
 */
export const HealthToIconForNodeWarning = (warning_number: number) => {
  const t = useTranslations();

  return warning_number > 0 ? (
    <IconWithInfo type='warning' label={t('A resource exists that requires attention')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are working properly')} />
  );
};

/**
 * Converts a critical health number to an icon with corresponding label.
 * @param critical_number - The critical health number.
 * @returns The JSX element representing the icon with label.
 */
export const HealthToIconForNodeCritical = (critical_number: number) => {
  const t = useTranslations();

  return critical_number > 0 ? (
    <IconWithInfo
      type='critical'
      label={t('A resource exists in a critical condition that requires immediate attention')}
    />
  ) : (
    <IconWithInfo type='check' label={t('All resources are working properly')} />
  );
};
