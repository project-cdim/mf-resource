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
  unitId: string | undefined;
  secondaryMessage?: string;
  doOnSuccess: CallableFunction;
}) => {
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const t = useTranslations();
  const { isAvailable, secondaryMessage, doOnSuccess } = props;
  const { openModal, closeModal, setError, isModalOpen, error } = useConfirmModal();
  const title = isAvailable ? t('Start Maintenance') : t('End');

  const submitChangeEnabled = (props: { isAvailable: boolean | undefined; unitId: string | undefined }) => {
    const reqData = { available: !isAvailable };
    axios
      .put(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/device-units/${props.unitId}/annotation/system-items`,
        reqData
      )
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

  const primaryMessage = isAvailable ? t('Do you want to start maintenance?') : t('Do you want to end maintenance?');

  return (
    <>
      <ConfirmModal
        title={title}
        subTitle={''}
        message={`${primaryMessage}\n${secondaryMessage}`}
        submit={() => submitChangeEnabled({ isAvailable: isAvailable, unitId: props.unitId })}
        errorTitle={t('Failed to configure {operation} maintenance', {
          // operation: title.toLowerCase()
          operation: (isAvailable ? t('Start') : t('End')).toLowerCase(),
        })}
        closeModal={closeModal}
        error={error}
        isModalOpen={isModalOpen}
        target={t('Maintenance')}
      />
      <Button size='xs' variant='outline' color='dark' onClick={openModal} disabled={!hasPermission}>
        <Text size='14'>{isAvailable ? t('Start Maintenance') : t('End')}</Text>
      </Button>
    </>
  );
};
