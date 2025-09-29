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
import { JSX } from 'react';

/**
 * Returns an icon based on the detection status.
 * @param detected - The detection status boolean
 * @returns JSX.Element containing the appropriate icon for the detection status
 */
export const DetectionStatusToIcon = (detected: boolean | undefined): JSX.Element | null => {
  const t = useTranslations();

  if (detected === undefined) return null;

  return detected ? (
    <IconWithInfo type='check' label={t('Resource is responding')} />
  ) : (
    <IconWithInfo type='critical' label={t('Resource is not responding')} />
  );
};
