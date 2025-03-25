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

import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { PeriodChange } from '../../components';

describe('PeriodChange', () => {
  test('The modal is displayed when the button is pressed', async () => {
    const user = UserEvent.setup({ delay: null });
    render(<PeriodChange chartDataChange={() => void {}} />);
    const button = screen.getByTestId('button_open');
    await user.click(button);
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());
  });

  test('The modal can be closed', async () => {
    const user = UserEvent.setup({ delay: null });
    render(<PeriodChange chartDataChange={() => void {}} />);

    // Open modal
    await waitFor(() => user.click(screen.getByTestId('button_open')));
    // Wait for open modal
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());

    // Assign the modal dialog
    const dialog = await screen.findByRole('dialog');

    // Click the close button
    await waitFor(async () => user.click(await screen.findByRole('button', { name: '' })));
    await waitForElementToBeRemoved(dialog).then(() => {
      // The dialog disappears after 200ms
      // });
    });
    expect(dialog).not.toBeInTheDocument();
  });

  test('It is possible to execute the callback function chartDateChange', async () => {
    const user = UserEvent.setup({ delay: null });
    const mockFunc = jest.fn();
    render(<PeriodChange chartDataChange={mockFunc} />);
    await user.click(screen.getByTestId('button_open')); // Open modal
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByTestId('button_decide')); // Execute the period change
    expect(mockFunc).toHaveBeenCalled();
  });

  test('The date selection is selected by default', async () => {
    const user = UserEvent.setup({ delay: null });
    render(<PeriodChange chartDataChange={() => void {}} />);
    await user.click(screen.getByTestId('button_open')); // Open modal
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());
    expect(screen.getByLabelText('Date selection')).toBeChecked();
    expect(screen.getByTestId('DatePicker')).toBeInTheDocument(); // It might be possible to get it by label
  });

  test('It is possible to select the date selection', async () => {
    const user = UserEvent.setup({ delay: null });
    render(<PeriodChange chartDataChange={() => void {}} />);
    await user.click(screen.getByTestId('button_open')); // Open modal
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());
    const radioChoseDate = screen.getByLabelText('Date selection');
    const radioChoseMonth = screen.getByLabelText('Month selection');
    await user.click(radioChoseDate); // Click the date selection
    expect(screen.getByTestId('DatePicker')).toBeInTheDocument(); // It might be possible to get it by label
    expect(radioChoseDate).toBeChecked();
    expect(radioChoseMonth).not.toBeChecked();
  });

  test('It is possible to select the month selection', async () => {
    const user = UserEvent.setup({ delay: null });
    render(<PeriodChange chartDataChange={() => void {}} />);
    await user.click(screen.getByTestId('button_open')); // Open modal
    await waitFor(async () => expect(await screen.findByRole('dialog')).toBeInTheDocument());
    const radioChoseDate = screen.getByLabelText('Date selection');
    const radioChoseMonth = screen.getByLabelText('Month selection');
    await user.click(radioChoseMonth); // Click the month selection
    expect(screen.getByTestId('MonthPicker')).toBeInTheDocument(); // It might be possible to get it by label
    expect(radioChoseDate).not.toBeChecked();
    expect(radioChoseMonth).toBeChecked();
  });
});
