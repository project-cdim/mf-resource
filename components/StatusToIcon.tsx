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

import { useTranslations } from 'next-intl';

import { IconWithInfo } from '@/shared-modules/components';
import { APPDeviceOverallStatus } from '@/shared-modules/types';

/**
 * Props for StatusToIcon component.
 */
export type StatusToIconProps = {
  status: APPDeviceOverallStatus | undefined;
};

/**
 * Converts an overall status string to an icon component.
 * @param props - Component props.
 * @param props.status - The overall status.
 * @returns The corresponding icon component based on the overall status.
 */
export const StatusToIcon = ({ status }: StatusToIconProps) => {
  const t = useTranslations();
  if (!status) return null;
  switch (status) {
    case 'OK':
      return <IconWithInfo type='check' label={t('This resource is working properly')} />;
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
