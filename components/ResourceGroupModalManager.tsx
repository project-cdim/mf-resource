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

'use client';
import axios, { AxiosError } from 'axios';
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ModalsProvider, modals } from '@mantine/modals';
import { Button, Group, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslations } from 'next-intl';
import { MessageBox } from '@/shared-modules/components';
import { useColorStyles } from '@/shared-modules/styles/styles';

// Define the modalError type
type AppError =
  | AxiosError<{
      code: string;
      message: string;
      details: string;
    }>
  | undefined;

// Create context with initial values
type ModalErrorContextType = {
  modalError: AppError;
  setModalError: React.Dispatch<React.SetStateAction<AppError>>;
};

// istanbul ignore next
const ModalErrorContext = createContext<ModalErrorContextType>({
  modalError: undefined,
  setModalError: () => void {},
});

const useModalError = () => useContext(ModalErrorContext);

/**
 * Provides modalError handling context and modal management to its children.
 *
 * This component wraps its children with an `ModalErrorContext.Provider` that supplies
 * the current modalError state, a setter for the modalError, and a function to clear the modalError.
 * It also wraps children with a `ModalsProvider` to manage modal dialogs, passing
 * default modal properties.
 *
 * @param children - The React node(s) to be rendered within the provider.
 * @returns The children wrapped with modalError and modal context providers.
 */
export const ModalWithErrorProvider = ({ children }: { children: ReactNode }) => {
  const MODAL_SIZE = 550;
  const [modalError, setModalError] = useState<AppError>(undefined);

  return (
    <ModalErrorContext.Provider value={{ modalError, setModalError }}>
      <ModalsProvider modalProps={{ size: MODAL_SIZE }}>{children}</ModalsProvider>
    </ModalErrorContext.Provider>
  );
};

type OperationType = 'add' | 'edit' | 'delete';

const useOperationTitle = (operation: OperationType) => {
  const t = useTranslations();

  switch (operation) {
    case 'add':
      return t('Add');
    case 'edit':
      return t('Edit');
    case 'delete':
      return t('Delete');
  }
};

const ModalTitle = (props: { operation: OperationType; id?: string }) => {
  const t = useTranslations();
  const title = useOperationTitle(props.operation);

  return (
    <>
      <Text size='xs'>{t('Resource Group')}</Text>
      <Group>
        <Title order={3} fz='lg' fw={700}>
          {title}
        </Title>
        {props.id && (
          <Group gap={5} fz='sm' c='gray.7'>
            <Text>{t('ID')}</Text>
            <Text>:</Text>
            <Text>{props.id}</Text>
          </Group>
        )}
      </Group>
    </>
  );
};

type resourceGroupFormValues = {
  name: string;
  description: string;
};

const AddEditModalBody = (props: {
  submit: (values: resourceGroupFormValues) => void;
  operation: Exclude<OperationType, 'delete'>;
  name?: string;
  description?: string;
}) => {
  const t = useTranslations();

  const MIN_NAME_LENGTH = 1;
  const MAX_NAME_LENGTH = 64;
  const MAX_DESCRIPTION_LENGTH = 256;

  const form = useForm<resourceGroupFormValues>({
    initialValues: {
      name: props.name !== undefined ? props.name : '',
      description: props.description !== undefined ? props.description : '',
    },
    validateInputOnChange: true,
    validate: {
      name: (value) =>
        value.length < MIN_NAME_LENGTH || value.length > MAX_NAME_LENGTH
          ? t('Enter between {min} and {max} characters', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
          : null,
      description: (value) =>
        value.length > MAX_DESCRIPTION_LENGTH
          ? t('Enter up to {max} characters', { max: MAX_DESCRIPTION_LENGTH })
          : null,
    },
  });

  return (
    <Stack gap={20}>
      <ModalErrorMessage operation={props.operation} />
      <form
        onSubmit={form.onSubmit((values) => {
          props.submit(values);
        })}
      >
        <Stack gap={20}>
          <TextInput
            label={`${t('Name')} (${t('Up to {max} characters', { max: MAX_NAME_LENGTH })})`}
            placeholder={t('Name')}
            withAsterisk
            {...form.getInputProps('name')}
          />
          <Textarea
            label={`${t('Description')} (${t('Up to {max} characters', { max: MAX_DESCRIPTION_LENGTH })})`}
            placeholder={t('Description')}
            resize='vertical'
            {...form.getInputProps('description')}
          />
          <Group gap={10} justify='end'>
            <Button variant='outline' color='dark' onClick={modals.closeAll}>
              {t('Cancel')}
            </Button>
            <Button type='submit'>{t('Save')}</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

const DeleteModalBody = (props: { submit: () => void; name: string }) => {
  const t = useTranslations();
  const { red } = useColorStyles();

  return (
    <Stack gap={20}>
      <ModalErrorMessage operation='delete' />
      <Text py={5}>{t('Do you want to delete "{target}"?', { target: props.name })}</Text>
      <Group gap={10} justify='end'>
        <Button variant='outline' color='dark' onClick={modals.closeAll}>
          {t('No')}
        </Button>
        <Button type='submit' color={red.color} onClick={props.submit}>
          {t('Yes')}
        </Button>
      </Group>
    </Stack>
  );
};

const ModalErrorMessage = ({ operation }: { operation: OperationType }) => {
  const t = useTranslations();
  const { modalError: error } = useModalError();
  const title = useOperationTitle(operation);

  if (!error) return null;

  return (
    <MessageBox
      type='error'
      title={t('Failed to {operation} resource group', { operation: title.toLowerCase() })}
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
  );
};

type successMessageType =
  | {
      id: string;
      name: string;
      operation: string;
    }
  | undefined;

/**
 * Custom React hook for managing resource group modals (add, edit, delete) and their side effects.
 * Note that this hook must be wrapped in the `ModalWithErrorProvider` to function correctly.
 *
 * This hook provides modal openers for resource group operations, handles API requests,
 * manages success messages, and modalError handling for modal forms.
 *
 * @param mutate - A callback function to refresh or re-fetch resource group data after a successful operation.
 * @returns An object containing:
 *   - `successMessage`: The current success message state for resource group operations.
 *   - `setSuccessMessage`: Setter for the success message state.
 *   - `openModal`: A function to open the appropriate modal for add, edit, or delete operations.
 *
 * @example
 * const { successMessage, setSuccessMessage, openModal } = useResourceGroupModal(refetchGroups);
 *
 * // To open the add modal:
 * openModal({ operation: 'add' });
 *
 * // To open the edit modal:
 * openModal({ operation: 'edit', rg: resourceGroup });
 *
 * // To open the delete modal:
 * openModal({ operation: 'delete', rg: resourceGroup });
 */
export const useResourceGroupModal = (mutate: () => void) => {
  const t = useTranslations();
  // Success message info of resource group operation
  const [successMessage, setSuccessMessage] = useState<successMessageType>(undefined);
  const { setModalError } = useModalError();

  const submitCommon = (res: Promise<void | null>, setModalError: React.Dispatch<React.SetStateAction<AppError>>) => {
    res
      .then(() => {
        modals.closeAll();
        // Fetch again
        mutate();
        return;
      })
      .catch((error) => {
        setModalError(error);
      });
  };

  const submitAdd = (
    values: resourceGroupFormValues,
    setSuccessMessage: React.Dispatch<React.SetStateAction<successMessageType>>,
    setModalError: React.Dispatch<React.SetStateAction<AppError>>
  ) => {
    submitCommon(
      axios
        .post(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups`, {
          name: values.name,
          description: values.description,
        })
        .then((res) => {
          setSuccessMessage({ id: res.data.id, name: res.data.name, operation: t('Add') });
        }),
      setModalError
    );
  };

  const submitEdit = (
    values: resourceGroupFormValues,
    id: string,
    setSuccessMessage: React.Dispatch<React.SetStateAction<successMessageType>>,
    setModalError: React.Dispatch<React.SetStateAction<AppError>>
  ) => {
    submitCommon(
      axios
        .put(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`, {
          name: values.name,
          description: values.description,
        })
        .then((res) => {
          setSuccessMessage({ id: res.data.id, name: res.data.name, operation: t('Edit') });
        }),
      setModalError
    );
  };

  const submitDelete = (
    id: string,
    name: string,
    setSuccessMessage: React.Dispatch<React.SetStateAction<successMessageType>>,
    setModalError: React.Dispatch<React.SetStateAction<AppError>>
  ) => {
    submitCommon(
      axios
        .delete(`${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`)
        .then(() => setSuccessMessage({ id, name, operation: t('Delete') })),
      setModalError
    );
  };

  type ResourceGroup = {
    id: string;
    name: string;
    description: string;
  };

  const openModal = (params: { operation: 'add' } | { operation: 'edit' | 'delete'; rg: ResourceGroup }) => {
    const { operation } = params;
    const commonProps = {
      onExitTransitionEnd: () => setModalError(undefined),
      lockScroll: false,
      styles: {
        header: { alignItems: 'start' },
      },
    };

    switch (operation) {
      case 'add':
        modals.open({
          title: <ModalTitle operation={operation} />,
          children: (
            <AddEditModalBody
              operation={operation}
              submit={(values) => submitAdd(values, setSuccessMessage, setModalError)}
            />
          ),
          ...commonProps,
        });
        break;
      case 'edit':
        modals.open({
          title: <ModalTitle operation={operation} id={params.rg.id} />,
          children: (
            <AddEditModalBody
              operation={operation}
              name={params.rg.name}
              description={params.rg.description}
              submit={(values) => submitEdit(values, params.rg.id, setSuccessMessage, setModalError)}
            />
          ),
          ...commonProps,
        });
        break;
      case 'delete':
        modals.open({
          title: <ModalTitle operation={operation} id={params.rg.id} />,
          children: (
            <DeleteModalBody
              name={params.rg.name}
              submit={() => submitDelete(params.rg.id, params.rg.name, setSuccessMessage, setModalError)}
            />
          ),
          ...commonProps,
        });
        break;
    }
  };

  return {
    successMessage,
    setSuccessMessage,
    openModal,
  };
};

/**
 * Displays a modal success message when a resource group operation completes successfully.
 *
 * @param props.successMessage - The success message object containing details about the operation, or `undefined` if no message should be shown.
 * @param props.setSuccessMessage - Callback to update or clear the success message.
 *
 * @returns A `MessageBox` component displaying the success details, or `null` if no message is present.
 */
export const ModalSuccessMessage = (props: {
  successMessage: successMessageType;
  setSuccessMessage: React.Dispatch<React.SetStateAction<successMessageType>>;
}) => {
  const t = useTranslations();

  if (!props.successMessage) return null;
  const { successMessage, setSuccessMessage } = props;
  return (
    <MessageBox
      type='success'
      title={t('The resource group has been successfully {operation}', {
        operation: successMessage.operation.toLowerCase(),
      })}
      message={
        <>
          <Text>
            {t('ID')} : {successMessage.id}
          </Text>
          <Text>
            {t('Name')} : {successMessage.name}
          </Text>
        </>
      }
      close={() => setSuccessMessage(undefined)}
    />
  );
};
