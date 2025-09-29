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

import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/shared-modules/__test__/test-utils';

import { ResourceGroupSelectButton } from '@/components';
import { usePermission } from '@/shared-modules/utils/hooks';
import { useResourceGroupSelectModal } from '@/utils/hooks/useResourceGroupSelectModal';

// Mock the dependencies
jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
}));

jest.mock('@/utils/hooks/useResourceGroupSelectModal', () => ({
  useResourceGroupSelectModal: jest.fn(),
}));

// Mock implementations
const mockUsePermission = usePermission as jest.Mock;
const mockUseResourceGroupSelectModal = useResourceGroupSelectModal as jest.Mock;

describe('ResourceGroupSelectButton', () => {
  // Setup common test props
  const mockProps = {
    deviceId: 'device123',
    currentResourceGroupIds: ['group1', 'group2'],
    doOnSuccess: jest.fn(),
  };

  // Setup common modal hook values
  const mockModalHookValues = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isModalOpen: false,
    error: undefined,
    loading: false,
    allResourceGroups: [
      { id: 'group1', name: 'Group 1', description: 'Description 1', resourceIDs: [] },
      { id: 'group2', name: 'Group 2', description: 'Description 2', resourceIDs: [] },
      { id: 'group3', name: 'Group 3', description: 'Description 3', resourceIDs: [] },
    ],
    submitResourceGroups: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mocks
    mockUsePermission.mockReturnValue(true);
    mockUseResourceGroupSelectModal.mockReturnValue(mockModalHookValues);
  });

  test('renders edit button', () => {
    render(<ResourceGroupSelectButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('button is disabled when deviceId is undefined', () => {
    render(<ResourceGroupSelectButton {...mockProps} deviceId={undefined} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toBeDisabled();
  });

  test('button is disabled when explicitly set to disabled', () => {
    render(<ResourceGroupSelectButton {...mockProps} disabled={true} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toBeDisabled();
  });

  test('button is disabled when user does not have permission', () => {
    mockUsePermission.mockReturnValue(false);
    render(<ResourceGroupSelectButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toBeDisabled();
  });

  test('opens modal when button is clicked', () => {
    render(<ResourceGroupSelectButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(button);

    expect(mockModalHookValues.openModal).toHaveBeenCalled();
  });
  test('renders ResourceGroupSelectModal with correct props', () => {
    // Update modal state to open
    mockUseResourceGroupSelectModal.mockReturnValue({
      ...mockModalHookValues,
      isModalOpen: true,
    });

    render(<ResourceGroupSelectButton {...mockProps} />);

    // Check that modal is open with expected content
    const modalElement = document.querySelector('.mantine-Modal-root');
    expect(modalElement).toBeInTheDocument();

    // Verify modal header and content exists
    const modalHeader = document.querySelector('.mantine-Modal-header');
    expect(modalHeader).toBeInTheDocument();

    // Check that device ID is correctly displayed
    const modalText = document.body.textContent;
    expect(modalText).toContain('Resource Group');
    expect(modalText).toContain('Device ID');
    expect(modalText).toContain('device123');
  });

  test('handles submit resource groups functionality', async () => {
    // Mock modal state to open and add resources
    const mockSubmitResourceGroups = jest.fn().mockImplementation((deviceId, selectedIds, callback) => {
      callback({ operation: 'UpdateResourceGroup' });
      return Promise.resolve();
    });

    mockUseResourceGroupSelectModal.mockReturnValue({
      ...mockModalHookValues,
      isModalOpen: true,
      submitResourceGroups: mockSubmitResourceGroups,
    });

    render(<ResourceGroupSelectButton {...mockProps} />);

    // Find the modal
    const modalElement = document.querySelector('.mantine-Modal-root');
    expect(modalElement).toBeInTheDocument();

    // Find the Save button inside the modal
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();

    // Click the Save button to trigger submit
    fireEvent.click(saveButton);

    // Check if the submit function was called correctly with the right parameters
    await waitFor(() => {
      expect(mockSubmitResourceGroups).toHaveBeenCalledWith(
        mockProps.deviceId,
        expect.any(Array),
        expect.any(Function)
      );
    });

    // Check if onSuccess callback was triggered
    await waitFor(() => {
      expect(mockProps.doOnSuccess).toHaveBeenCalledWith({ operation: 'UpdateResourceGroup' });
    });
  });
  test('handles loading state in modal', () => {
    // Set loading state to true
    mockUseResourceGroupSelectModal.mockReturnValue({
      ...mockModalHookValues,
      isModalOpen: true,
      loading: true,
    });

    render(<ResourceGroupSelectButton {...mockProps} />);

    // Check if loading overlay is visible in the modal
    // Since the loading overlay may not have an accessible label, we'll use querySelector
    const loadingOverlay = document.querySelector('.mantine-LoadingOverlay-root');
    expect(loadingOverlay).toBeInTheDocument();
  });
  test('handles error state in modal', () => {
    // Mock error state
    const mockError = {
      message: 'Network Error',
      response: {
        data: {
          message: 'Failed to update resource groups',
          code: 'ERR_RESOURCE_GROUP',
          details: 'Additional error details',
        },
      },
    };

    mockUseResourceGroupSelectModal.mockReturnValue({
      ...mockModalHookValues,
      isModalOpen: true,
      error: mockError,
    });

    render(<ResourceGroupSelectButton {...mockProps} />);

    // Verify that error related content is shown
    // Check for error message content
    const errorElements = document.querySelectorAll('.mantine-Alert-root, .mantine-Notification-root');
    expect(errorElements.length).toBeGreaterThan(0);

    // Check for error details in the DOM (without using specific queries)
    const errorDetails = document.body.textContent;
    expect(errorDetails).toContain('Network Error');
    expect(errorDetails).toContain('Failed to update resource groups');
  });
});
