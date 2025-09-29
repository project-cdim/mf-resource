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

import { useEffect, useState } from 'react';
import { Button, Group, Modal, MultiSelect, LoadingOverlay, Text, Title, Stack } from '@mantine/core';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { APIResourceGroup } from '@/types';

import { MessageBox } from '@/shared-modules/components';
import { MANAGE_RESOURCE } from '@/shared-modules/constant';
import { usePermission } from '@/shared-modules/utils/hooks';

/**
 * Resource Group Selection Modal Component
 * Receives resource group list from parent component and allows selection via MultiSelect
 *
 * @param props - Component properties
 * @returns Resource Group Selection Modal
 */
export const ResourceGroupSelectModal = (props: {
  deviceId: string;
  currentResourceGroupIds: string[];
  allResourceGroups: APIResourceGroup[]; // Resource group list passed from parent component
  opened: boolean;
  onClose: () => void;
  doOnSuccess: CallableFunction;
  loading?: boolean;
  error?: AxiosError<{ code: string; message: string; details?: string }>;
  dataFetchError?: AxiosError<{ code: string; message: string; details?: string }>;
  submitResourceGroups?: (deviceId: string, selectedIds: string[], onSuccess: CallableFunction) => void;
}) => {
  const t = useTranslations();
  const hasPermission = usePermission(MANAGE_RESOURCE);
  const [selectedResourceGroupIds, setSelectedResourceGroupIds] = useState<string[]>(props.currentResourceGroupIds);
  const loading = props.loading || false;
  const error = props.error;
  const dataFetchError = props.dataFetchError;

  // Initialize selection state when modal is opened
  useEffect(() => {
    if (props.opened) {
      setSelectedResourceGroupIds(props.currentResourceGroupIds);
    }
  }, [props.opened, props.currentResourceGroupIds]);

  // Save resource group changes
  const handleSubmit = () => {
    if (props.submitResourceGroups) {
      props.submitResourceGroups(props.deviceId, selectedResourceGroupIds, props.doOnSuccess);
    }
  };

  // Convert to data format for MultiSelect
  const selectItems = props.allResourceGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <>
      <Modal
        opened={props.opened}
        onClose={props.onClose}
        lockScroll={false}
        title={
          <Stack gap={0}>
            <Text size='xs'>{t('Resource Group')}</Text>
            <Group gap={5}>
              <Title order={3} fz='lg' fw={700}>
                {t('Edit')}
              </Title>
              <Group gap={5} fz='sm' c='gray.7'>
                {t('Device ID')} : {props.deviceId}
              </Group>
            </Group>
          </Stack>
        }
        styles={{
          header: { alignItems: 'start' },
        }}
        size={550}
        // centered
      >
        <div style={{ position: 'relative', minHeight: '100px' }}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          {dataFetchError && (
            <>
              <MessageBox type='error' title={dataFetchError.message} message={''} />
            </>
          )}
          {error && !dataFetchError && (
            <>
              <MessageBox
                type='error'
                title={t('Failed to {operation} resource group', { operation: t('Edit').toLowerCase() })}
                message={
                  <>
                    <Text>{error.message}</Text>
                    {error.response && (
                      <>
                        <Text>
                          {error.response.data.message} ({error.response.data.code})
                        </Text>
                        <Text>{error.response.data.details}</Text>
                      </>
                    )}
                  </>
                }
              />
            </>
          )}
          <MultiSelect
            data={selectItems}
            value={selectedResourceGroupIds}
            onChange={setSelectedResourceGroupIds}
            label={t('Resource Group')}
            placeholder={t('Resource Group')}
            searchable
            disabled={loading || !hasPermission}
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' color='dark' onClick={props.onClose}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !hasPermission}>
              {t('Save')}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};
