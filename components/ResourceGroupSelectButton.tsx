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

import { Button, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { ResourceGroupSelectModal } from './ResourceGroupSelectModal';
import { usePermission } from '@/shared-modules/utils/hooks';
import { MANAGE_RESOURCE } from '@/shared-modules/constant';
import { useResourceGroupSelectModal } from '@/utils/hooks/useResourceGroupSelectModal';

/**
 * Resource Group Edit Button Component
 *
 * @param props - Component properties
 * @returns Resource Group Edit Button
 */
export const ResourceGroupSelectButton = (props: {
  deviceId?: string;
  currentResourceGroupIds: string[];
  disabled?: boolean;
  doOnSuccess: CallableFunction;
}) => {
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const t = useTranslations();

  // Using dedicated hook
  const {
    openModal,
    closeModal,
    isModalOpen,
    error,
    dataFetchError,
    loading,
    allResourceGroups,
    submitResourceGroups,
  } = useResourceGroupSelectModal();

  // Disable if deviceId is undefined
  const isDisabled = props.disabled || !hasPermission || !props.deviceId;

  return (
    <>
      <Button size='xs' variant='outline' color='dark' onClick={openModal} disabled={isDisabled}>
        <Text size='14'>{t('Edit')}</Text>
      </Button>

      <ResourceGroupSelectModal
        deviceId={props.deviceId || ''}
        currentResourceGroupIds={props.currentResourceGroupIds}
        allResourceGroups={allResourceGroups}
        opened={isModalOpen}
        onClose={closeModal}
        doOnSuccess={props.doOnSuccess}
        loading={loading}
        error={error}
        dataFetchError={dataFetchError}
        submitResourceGroups={(deviceId, selectedIds, onSuccess) =>
          submitResourceGroups(deviceId, selectedIds, (res) => onSuccess(res))
        }
      />
    </>
  );
};
