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
import axios from 'axios';

import { AvailableButton } from '@/components';
import { usePermission, useConfirmModal } from '@/shared-modules/utils/hooks';

// Mock axios and hooks
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: object) => {
    // Mock translations
    const translations: { [key: string]: string } = {
      Include: 'Include',
      Exclude: 'Exclude',
      'Device ID': 'Device ID',
      'Do you want to include?': 'Do you want to include?',
      'Do you want to exclude?': 'Do you want to exclude?',
      'Failed to configure {operation}': `Failed to configure ${(values as { operation?: string })?.operation || ''}`,
      Yes: 'Yes',
      No: 'No',
      Error: 'Error',
    };
    return translations[key] || key;
  },
}));

// Mock implementations
const mockUsePermission = usePermission as jest.Mock;
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockSetError = jest.fn();

// Mock the useConfirmModal hook
jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
  useConfirmModal: jest.fn(),
}));

const mockUseConfirmModal = useConfirmModal as jest.Mock;

describe('AvailableButton', () => {
  // Common test props
  const mockProps = {
    isAvailable: true,
    deviceId: 'device123',
    doOnSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    mockUsePermission.mockReturnValue(true);
    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: false,
      error: undefined,
    });

    // Mock axios responses
    mockAxios.put.mockResolvedValue({ data: { success: true } });
  });

  test('renders Exclude button when isAvailable is true', () => {
    render(<AvailableButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Exclude' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('renders Include button when isAvailable is false', () => {
    render(<AvailableButton {...mockProps} isAvailable={false} />);

    const button = screen.getByRole('button', { name: 'Include' });
    expect(button).toBeInTheDocument();
  });

  test('disables button when user does not have permission', () => {
    mockUsePermission.mockReturnValue(false);
    render(<AvailableButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Exclude' });
    expect(button).toBeDisabled();
  });

  test('opens modal when button is clicked', () => {
    render(<AvailableButton {...mockProps} />);

    const button = screen.getByRole('button', { name: 'Exclude' });
    fireEvent.click(button);

    expect(mockOpenModal).toHaveBeenCalled();
  });

  test('displays confirmation modal with appropriate message for Exclude', () => {
    // Set modal to open state
    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: true,
      error: undefined,
    });

    render(<AvailableButton {...mockProps} />);

    // Check that modal components exist with correct text
    const modalContent = document.body.textContent || '';
    expect(modalContent).toContain('Exclude');
    expect(modalContent).toContain('Device ID : device123');
    expect(modalContent).toContain('Do you want to exclude?');
  });

  test('displays confirmation modal with appropriate message for Include', () => {
    // Set modal to open state
    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: true,
      error: undefined,
    });

    render(<AvailableButton {...mockProps} isAvailable={false} />);

    // Check that modal components exist with correct text
    const modalContent = document.body.textContent || '';
    expect(modalContent).toContain('Include');
    expect(modalContent).toContain('Device ID : device123');
    expect(modalContent).toContain('Do you want to include?');
  });

  test('submits API request when modal is confirmed', async () => {
    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: true,
      error: undefined,
    });

    render(<AvailableButton {...mockProps} />);

    // Find and click the confirm button in the modal
    const confirmButton = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(confirmButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/resources/device123/annotation'),
        { available: false } // toggling from true to false
      );
      expect(mockCloseModal).toHaveBeenCalled();
      expect(mockProps.doOnSuccess).toHaveBeenCalled();
    });
  });

  test('handles API error', async () => {
    const mockError = new Error('API Error');
    mockAxios.put.mockRejectedValueOnce(mockError);

    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: true,
      error: undefined,
    });

    render(<AvailableButton {...mockProps} />);

    // Find and click the confirm button in the modal
    const confirmButton = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(confirmButton);

    // Wait for the API call to fail
    await waitFor(() => {
      expect(mockAxios.put).toHaveBeenCalled();
      expect(mockSetError).toHaveBeenCalledWith(mockError);
      expect(mockCloseModal).not.toHaveBeenCalled();
    });
  });

  test('shows error in modal when API fails', async () => {
    const mockError = {
      message: 'Network Error',
      response: {
        data: {
          message: 'Failed operation',
          code: 'ERR_OPERATION',
        },
      },
    };

    mockUseConfirmModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      setError: mockSetError,
      isModalOpen: true,
      error: mockError,
    });

    render(<AvailableButton {...mockProps} />);

    // Check that error alert is visible
    const errorElements = document.querySelectorAll('.mantine-Alert-root, .mantine-Notification-root');
    expect(errorElements.length).toBeGreaterThan(0);

    // Check that error message is in the document
    const errorContent = document.body.textContent || '';
    expect(errorContent).toContain('Failed to configure exclude');
  });
});
