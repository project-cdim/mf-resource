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
 * Converts a state string to an icon component with corresponding label.
 * @param state - The state string to convert.
 * @returns The icon component with the corresponding label.
 */
export const StateToIcon = (state: string | undefined) => {
  const t = useTranslations();
  const stateLabel = {
    Enabled: t('Resource is enabled'),
    Disabled: t('Resource is disabled'),
    StandbyOffline: t('Resource is enabled but awaits an external action to activate it'),
    StandbySpare: t(
      'Resource is part of a redundancy set and awaits a failover or other external action to activate it'
    ),
    InTest: t('Resource is undergoing testing, or is in the process of capturing information for debugging'),
    Starting: t('Resource is starting'),
    Absent: t('Resource is either not present or detected'),
    UnavailableOffline: t('Resource is present but cannot be used'),
    Deferring: t('Resource does not process any commands but queues new requests'),
    Quiesced: t('Resource is enabled but only processes a restricted set of commands'),
    Updating: t('Resource is updating and might be unavailable or degraded'),
    Qualified: t('Resource quality is within the acceptable range of operation'),
  };
  if (!state) return null;
  switch (state) {
    case 'Enabled':
      return <IconWithInfo type='check' label={stateLabel[state]} />;
    case 'Disabled':
      return <IconWithInfo type='disabled' label={stateLabel[state]} />;
    case 'StandbyOffline':
    case 'StandbySpare':
    case 'InTest':
    case 'Starting':
    case 'Absent':
    case 'UnavailableOffline':
    case 'Deferring':
    case 'Quiesced':
    case 'Updating':
    case 'Qualified':
      return <IconWithInfo type='info' label={stateLabel[state]} />;
    default:
      return null;
  }
};

/**
 * Converts the number of disabled resources to an icon component.
 * @param disabled_resources The number of disabled resources.
 * @returns The icon component based on the number of disabled resources.
 */
export const StateToIconForNode = (disabled_resources: number) => {
  const t = useTranslations();

  return disabled_resources > 0 ? (
    <IconWithInfo type='disabled' label={t('Some resources are disabled')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are enabled')} />
  );
};
