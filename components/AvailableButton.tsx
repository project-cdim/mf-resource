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
import axios from 'axios';
import { useTranslations } from 'next-intl';

import { ConfirmModal } from '@/shared-modules/components';
import { MANAGE_RESOURCE } from '@/shared-modules/constant';
import { useConfirmModal, usePermission } from '@/shared-modules/utils/hooks';

/**
 * Button for including or excluding a resource from design
 *
 * @param props - The component props.
 * @returns The AvailableButton component.
 */
export const AvailableButton = (props: {
  isAvailable: boolean | undefined;
  deviceId: string | undefined;
  doOnSuccess: CallableFunction;
}) => {
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const t = useTranslations();
  const { isAvailable, doOnSuccess } = props;
  const { openModal, closeModal, setError, isModalOpen, error } = useConfirmModal();
  const title = isAvailable ? t('Exclude') : t('Include');

  const submitChangeEnabled = (props: { isAvailable: boolean | undefined; deviceId: string | undefined }) => {
    const reqData = { available: !isAvailable };
    axios
      .put(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources/${props.deviceId}/annotation`, reqData)
      .then((res) => {
        closeModal();
        // Show API request success message
        doOnSuccess(res);
        return;
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <>
      <ConfirmModal
        title={title}
        subTitle={`${t('Device ID')} : ${props.deviceId}`}
        message={isAvailable ? t('Do you want to exclude?') : t('Do you want to include?')}
        submit={() => submitChangeEnabled({ isAvailable: isAvailable, deviceId: props.deviceId })}
        errorTitle={t('Failed to configure {operation}', { operation: title.toLowerCase() })}
        closeModal={closeModal}
        error={error}
        isModalOpen={isModalOpen}
      />
      <Button size='xs' variant='outline' color='dark' onClick={openModal} disabled={!hasPermission}>
        <Text size='14'>{isAvailable ? t('Exclude') : t('Include')}</Text>
      </Button>
    </>
  );
};
