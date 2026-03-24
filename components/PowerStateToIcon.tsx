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
import { APIDevicePowerState } from '@/shared-modules/types';

/**
 * Props for PowerStateToIcon component.
 */
export type PowerStateToIconProps = {
  powerState: APIDevicePowerState | undefined;
  target?: string;
};

/**
 * Converts a power state string to an icon component with corresponding label.
 * @param props - Component props.
 * @param props.powerState - The power state string to convert.
 * @param props.target - The target resource type (e.g., "Resource", "Node"). Defaults to "Resource".
 * @returns The icon component with the corresponding label.
 */
export const PowerStateToIcon = ({ powerState, target = 'Resource' }: PowerStateToIconProps) => {
  const t = useTranslations();
  const currentTarget = t(target);
  const powerStateLabel = {
    On: t('{target} is powered on', { target: currentTarget }),
    Off: t('{target} is powered off', { target: currentTarget }),
    PoweringOn: t('{target} is powering on', { target: currentTarget }),
    PoweringOff: t('{target} is powering off', { target: currentTarget }),
    Paused: t('{target} power state is paused', { target: currentTarget }),
    Unknown: t('{target} power state is unknown', { target: currentTarget }),
  };
  if (!powerState) return null;
  switch (powerState) {
    case 'On':
      return <IconWithInfo type='check' label={powerStateLabel[powerState]} />;
    case 'Off':
      return <IconWithInfo type='disabled' label={powerStateLabel[powerState]} />;
    case 'PoweringOn':
      return <IconWithInfo type='in_progress' label={powerStateLabel[powerState]} />;
    case 'PoweringOff':
      return <IconWithInfo type='canceling' label={powerStateLabel[powerState]} />;
    case 'Paused':
      return <IconWithInfo type='suspended' label={powerStateLabel[powerState]} />;
    case 'Unknown':
    default:
      return <IconWithInfo type='info' label={powerStateLabel.Unknown} />;
  }
};

/**
 * Props for PowerOffToIconForNode component.
 */
export type PowerOffToIconForNodeProps = {
  poweroffNumber: number;
};

/**
 * Converts the number of powered-off resources to an icon component.
 * @param props - Component props.
 * @param props.poweroffNumber - The number of powered-off resources.
 * @returns The icon component based on the number of powered-off resources.
 */
export const PowerOffToIconForNode = ({ poweroffNumber }: PowerOffToIconForNodeProps) => {
  const t = useTranslations();

  return poweroffNumber > 0 ? (
    <IconWithInfo type='disabled' label={t('Some resources are powered off')} />
  ) : (
    <IconWithInfo type='check' label={t('All resources are powered on')} />
  );
};
