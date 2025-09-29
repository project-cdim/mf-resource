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

import React from 'react';
import { render } from '@/shared-modules/__test__/test-utils';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';

import {
  useResourceGroupModal,
  ModalWithErrorProvider,
  ModalSuccessMessage,
} from '@/components/ResourceGroupModalManager';
import axios from 'axios';
import UserEvent from '@testing-library/user-event';

jest.mock('axios', () => ({
  __esModule: true,
  ...jest.requireActual('axios'),
  default: {
    ...jest.requireActual('axios').default,
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ModalSuccessMessage', () => {
  const msg = { id: '1', name: 'Test Group', operation: 'add' };
  const setMsg = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render success message', async () => {
    render(<ModalSuccessMessage successMessage={msg} setSuccessMessage={setMsg} />);

    expect(screen.getByText('The resource group has been successfully {operation}')).toBeInTheDocument();
    expect(screen.getByText('ID : 1')).toBeInTheDocument();
    expect(screen.getByText('Name : Test Group')).toBeInTheDocument();

    expect(setMsg).not.toHaveBeenCalled();
    const closeButton = screen.getByRole('button');
    await UserEvent.click(closeButton);
    expect(setMsg).toHaveBeenCalledWith(undefined);
  });

  test('should render success message', () => {
    render(<ModalSuccessMessage successMessage={undefined} setSuccessMessage={setMsg} />);
    expect(screen.queryByText(/resource group has been successfully/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ID :/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Name :/i)).not.toBeInTheDocument();
  });
});

describe('useResourceGroupModal', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AddModal', () => {
    const Component = () => {
      const { openModal, successMessage, setSuccessMessage } = useResourceGroupModal(mutateMock);
      return (
        <>
          <>
            {successMessage?.id}:{successMessage?.name}:{successMessage?.operation}
          </>
          <button onClick={() => openModal({ operation: 'add' })}>Open Modal</button>
          <button onClick={() => setSuccessMessage(undefined)}>Clear Success Message</button>
        </>
      );
    };

    test('should open add modal', async () => {
      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      // Check Success Message is empty
      expect(await screen.findByText('::')).toBeInTheDocument();

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // header
      const targetText = await screen.findByText('Resource Group');
      expect(targetText).toBeInTheDocument();
      const operationTitle = await screen.findByRole('heading', { name: 'Add', level: 3 });
      expect(operationTitle).toBeInTheDocument();
      const buttons = await screen.findAllByRole('button');
      expect(buttons).toHaveLength(5); // 3 buttons for modal, 1 for open modal, 1 for clear success message

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveProperty('placeholder', 'Name');
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveProperty('placeholder', 'Description');

      // button
      const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeInTheDocument();
      const saveButton = await screen.findByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();
    });

    test('inputs validation', async () => {
      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(65));
      expect(nameInput).not.toBeValid();
      expect(screen.getByText('Enter between {min} and {max} characters')).toBeInTheDocument();

      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(64));
      expect(nameInput).toBeValid();
      expect(screen.queryByText('Enter between {min} and {max} characters')).toBeNull();

      await UserEvent.clear(nameInput);
      expect(nameInput).not.toBeValid();
      expect(screen.getByText('Enter between {min} and {max} characters')).toBeInTheDocument();

      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(257));
      expect(descriptionInput).not.toBeValid();
      expect(screen.getByText('Enter up to {max} characters')).toBeInTheDocument();

      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(256));
      expect(descriptionInput).toBeValid();
      expect(screen.queryByText('Enter up to {max} characters')).toBeNull();

      // button
      const saveButton = await screen.findByRole('button', { name: 'Save' });

      // check if input validation error occurs, does not execute api request
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(65));
      await UserEvent.click(saveButton);
      expect(axios.post).not.toHaveBeenCalled();

      await UserEvent.clear(nameInput);
      await UserEvent.click(saveButton);
      expect(axios.post).not.toHaveBeenCalled();

      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(257));
      await UserEvent.click(saveButton);
      expect(axios.post).not.toHaveBeenCalled();
    }, 10000);

    test('submit add (API success)', async () => {
      const res = { id: 'res-id', name: 'res-group', description: 'res-description' };
      (axios.post as jest.Mock).mockResolvedValue({
        data: res,
      });

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'Test Group');
      expect(nameInput).toHaveValue('Test Group');
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'Test Description');
      expect(descriptionInput).toHaveValue('Test Description');

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups`,
        {
          name: 'Test Group',
          description: 'Test Description',
        }
      );
      expect(mutateMock).toHaveBeenCalledTimes(1);

      // check modal is closed
      await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: 'Add' }));

      // success message
      expect(await screen.findByText(`${res.id}:${res.name}:Add`)).toBeInTheDocument();

      // clear success message
      await UserEvent.click(screen.getByRole('button', { name: 'Clear Success Message' }));
      expect(await screen.findByText('::')).toBeInTheDocument();
    });

    test('submit add (API fail)', async () => {
      const res = {
        message: 'Add failed',
        response: { data: { message: 'fail-msg', code: 500, details: 'fail-details' } },
      };
      (axios.post as jest.Mock).mockRejectedValue(res);

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'Test Group');
      expect(nameInput).toHaveValue('Test Group');
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'Test Description');
      expect(descriptionInput).toHaveValue('Test Description');

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups`,
        {
          name: 'Test Group',
          description: 'Test Description',
        }
      );
      expect(mutateMock).not.toHaveBeenCalled();

      // error message
      const errorTitle = await screen.findByText(res.message);
      expect(errorTitle).toBeInTheDocument();
      const errorMessage = await screen.findByText(`${res.response.data.message} (${res.response.data.code})`);
      expect(errorMessage).toBeInTheDocument();
      const errorDetails = await screen.findByText(res.response.data.details);
      expect(errorDetails).toBeInTheDocument();
    });
  });

  describe('EditModal', () => {
    const id = 'test-0001';
    const name = 'Test Group';
    const description = 'Test Description';

    const Component = () => {
      const { openModal, successMessage, setSuccessMessage } = useResourceGroupModal(mutateMock);
      return (
        <>
          <>
            {successMessage?.id}:{successMessage?.name}:{successMessage?.operation}
          </>
          <button
            onClick={() =>
              openModal({
                operation: 'edit',
                rg: { id, name, description },
              })
            }
          >
            Open Modal
          </button>
          <button onClick={() => setSuccessMessage(undefined)}>Clear Success Message</button>
        </>
      );
    };

    test('should open edit modal', async () => {
      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      // Check Success Message is empty
      expect(await screen.findByText('::')).toBeInTheDocument();

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // header
      const targetText = await screen.findByText('Resource Group');
      expect(targetText).toBeInTheDocument();
      const operationTitle = await screen.findByRole('heading', { name: 'Edit', level: 3 });
      expect(operationTitle).toBeInTheDocument();
      const idText = await screen.findByText(id);
      expect(idText).toBeInTheDocument();
      const buttons = await screen.findAllByRole('button');
      expect(buttons).toHaveLength(5); // 3 buttons for modal, 1 for open modal, 1 for clear success message

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveProperty('placeholder', 'Name');
      expect(nameInput).toHaveValue(name);
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveProperty('placeholder', 'Description');
      expect(descriptionInput).toHaveValue(description);

      // button
      const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeInTheDocument();
      const saveButton = await screen.findByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();
    });

    test('inputs validation', async () => {
      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(65));
      expect(nameInput).not.toBeValid();
      expect(screen.getByText('Enter between {min} and {max} characters')).toBeInTheDocument();

      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(64));
      expect(nameInput).toBeValid();
      expect(screen.queryByText('Enter between {min} and {max} characters')).toBeNull();

      await UserEvent.clear(nameInput);
      expect(nameInput).not.toBeValid();
      expect(screen.getByText('Enter between {min} and {max} characters')).toBeInTheDocument();

      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(257));
      expect(descriptionInput).not.toBeValid();
      expect(screen.getByText('Enter up to {max} characters')).toBeInTheDocument();

      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(256));
      expect(descriptionInput).toBeValid();
      expect(screen.queryByText('Enter up to {max} characters')).toBeNull();

      // button
      const saveButton = await screen.findByRole('button', { name: 'Save' });

      // check if input validation error occurs, does not execute api request
      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a'.repeat(65));
      await UserEvent.click(saveButton);
      expect(axios.put).not.toHaveBeenCalled();

      await UserEvent.clear(nameInput);
      await UserEvent.click(saveButton);
      expect(axios.put).not.toHaveBeenCalled();

      await UserEvent.clear(nameInput);
      await UserEvent.type(nameInput, 'a');
      await UserEvent.clear(descriptionInput);
      await UserEvent.type(descriptionInput, 'a'.repeat(257));
      await UserEvent.click(saveButton);
      expect(axios.put).not.toHaveBeenCalled();
    }, 10000);

    test('submit edit (API success)', async () => {
      const res = { id: 'res-id', name: 'res-group', description: 'res-description' };
      (axios.put as jest.Mock).mockResolvedValue({
        data: res,
      });

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.type(nameInput, ' Edit');
      expect(nameInput).toHaveValue('Test Group Edit');
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.type(descriptionInput, ' Edit');
      expect(descriptionInput).toHaveValue('Test Description Edit');

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.put).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`,
        {
          name: 'Test Group Edit',
          description: 'Test Description Edit',
        }
      );
      expect(mutateMock).toHaveBeenCalledTimes(1);

      // check modal is closed
      await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: 'Edit' }));

      // success message
      expect(await screen.findByText(`${res.id}:${res.name}:Edit`)).toBeInTheDocument();

      // clear success message
      await UserEvent.click(screen.getByRole('button', { name: 'Clear Success Message' }));
      expect(await screen.findByText('::')).toBeInTheDocument();
    });

    test('submit edit (API fail)', async () => {
      const res = {
        message: 'Edit failed',
        response: { data: { message: 'fail-msg', code: 500, details: 'fail-details' } },
      };
      (axios.put as jest.Mock).mockRejectedValue(res);

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // input
      const nameInput = await screen.findByLabelText('Name (Up to {max} characters) *');
      await UserEvent.type(nameInput, ' Edit');
      expect(nameInput).toHaveValue('Test Group Edit');
      const descriptionInput = await screen.findByLabelText('Description (Up to {max} characters)');
      await UserEvent.type(descriptionInput, ' Edit');
      expect(descriptionInput).toHaveValue('Test Description Edit');

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.put).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`,
        {
          name: 'Test Group Edit',
          description: 'Test Description Edit',
        }
      );
      expect(mutateMock).not.toHaveBeenCalled();

      // error message
      const errorTitle = await screen.findByText(res.message);
      expect(errorTitle).toBeInTheDocument();
      const errorMessage = await screen.findByText(`${res.response.data.message} (${res.response.data.code})`);
      expect(errorMessage).toBeInTheDocument();
      const errorDetails = await screen.findByText(res.response.data.details);
      expect(errorDetails).toBeInTheDocument();
    });
  });

  describe('DeleteModal', () => {
    const id = 'test-0001';
    const name = 'Test Group';
    const description = 'Test Description';

    const Component = () => {
      const { openModal, successMessage, setSuccessMessage } = useResourceGroupModal(mutateMock);
      return (
        <>
          <>
            {successMessage?.id}:{successMessage?.name}:{successMessage?.operation}
          </>
          <button
            onClick={() =>
              openModal({
                operation: 'delete',
                rg: { id, name, description },
              })
            }
          >
            Open Modal
          </button>
          <button onClick={() => setSuccessMessage(undefined)}>Clear Success Message</button>
        </>
      );
    };

    test('should open delete modal', async () => {
      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      // Check Success Message is empty
      expect(await screen.findByText('::')).toBeInTheDocument();

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      // header
      const targetText = await screen.findByText('Resource Group');
      expect(targetText).toBeInTheDocument();
      const operationTitle = await screen.findByRole('heading', { name: 'Delete', level: 3 });
      expect(operationTitle).toBeInTheDocument();
      const idText = await screen.findByText(id);
      expect(idText).toBeInTheDocument();
      const buttons = await screen.findAllByRole('button');
      expect(buttons).toHaveLength(5); // 3 buttons for modal, 1 for open modal, 1 for clear success message

      // text
      const confirmText = await screen.findByText('Do you want to delete "{target}"?');
      expect(confirmText).toBeInTheDocument();

      // button
      const noButton = await screen.findByRole('button', { name: 'No' });
      expect(noButton).toBeInTheDocument();
      const yesButton = await screen.findByRole('button', { name: 'Yes' });
      expect(yesButton).toBeInTheDocument();
    });

    test('submit delete (API success)', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      const saveButton = await screen.findByRole('button', { name: 'Yes' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.delete).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`
      );
      expect(mutateMock).toHaveBeenCalledTimes(1);

      // check modal is closed
      await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: 'Delete' }));

      // success message
      expect(await screen.findByText(`${id}:${name}:Delete`)).toBeInTheDocument();

      // clear success message
      await UserEvent.click(screen.getByRole('button', { name: 'Clear Success Message' }));
      expect(await screen.findByText('::')).toBeInTheDocument();
    });

    test('submit delete (API fail)', async () => {
      const res = {
        message: 'Edit failed',
        response: { data: { message: 'fail-msg', code: 500, details: 'fail-details' } },
      };
      (axios.delete as jest.Mock).mockRejectedValue(res);

      render(
        <ModalWithErrorProvider>
          <Component />
        </ModalWithErrorProvider>
      );

      await UserEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

      const saveButton = await screen.findByRole('button', { name: 'Yes' });
      await UserEvent.click(saveButton);

      // api call
      expect(axios.delete).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resource-groups/${id}`
      );
      expect(mutateMock).not.toHaveBeenCalled();

      // error message
      const errorTitle = await screen.findByText(res.message);
      expect(errorTitle).toBeInTheDocument();
      const errorMessage = await screen.findByText(`${res.response.data.message} (${res.response.data.code})`);
      expect(errorMessage).toBeInTheDocument();
      const errorDetails = await screen.findByText(res.response.data.details);
      expect(errorDetails).toBeInTheDocument();
    });
  });
});
