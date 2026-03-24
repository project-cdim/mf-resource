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
 * Props for HealthToIcon component.
 */
export type HealthToIconProps = {
  health: string | undefined;
};

/**
 * Converts a health status string to an icon component.
 * @param props - Component props.
 * @param props.health - The health status string.
 * @returns The corresponding icon component based on the health status.
 */
export const HealthToIcon = ({ health }: HealthToIconProps) => {
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
 * Props for HealthToIconForNodeWarning component.
 */
export type HealthToIconForNodeWarningProps = {
  warningNumber: number;
};

/**
 * Converts a warning number to an icon with corresponding label.
 * @param props - Component props.
 * @param props.warningNumber - The number of warnings.
 * @returns An IconWithInfo component with the appropriate icon and label.
 */
export const HealthToIconForNodeWarning = ({ warningNumber }: HealthToIconForNodeWarningProps) => {
  const t = useTranslations();

  return warningNumber > 0 ? (
    <IconWithInfo type='warning' label={t('A resource exists that requires attention')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are working properly')} />
  );
};

/**
 * Props for HealthToIconForNodeCritical component.
 */
export type HealthToIconForNodeCriticalProps = {
  criticalNumber: number;
};

/**
 * Converts a critical health number to an icon with corresponding label.
 * @param props - Component props.
 * @param props.criticalNumber - The critical health number.
 * @returns The JSX element representing the icon with label.
 */
export const HealthToIconForNodeCritical = ({ criticalNumber }: HealthToIconForNodeCriticalProps) => {
  const t = useTranslations();

  return criticalNumber > 0 ? (
    <IconWithInfo
      type='critical'
      label={t('A resource exists in a critical condition that requires immediate attention')}
    />
  ) : (
    <IconWithInfo type='check' label={t('All resources are working properly')} />
  );
};
