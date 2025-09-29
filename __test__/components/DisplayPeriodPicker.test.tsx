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
import { screen } from '@testing-library/react';
import { render } from '@/shared-modules/__test__/test-utils';
import { DisplayPeriodPicker } from '@/components';
import { DateRangePickerInput } from '@/shared-modules/components';

// Mock the shared components
jest.mock('@/shared-modules/components', () => ({
  DateRangePickerInput: jest.fn(() => <div data-testid='date-range-picker' />),
  IconWithInfo: jest.fn(({ label, type }) => <div data-testid='icon-with-info' data-type={type} data-label={label} />),
}));

describe('DisplayPeriodPicker', () => {
  // Common props for testing
  const mockProps = {
    value: [new Date('2023-07-01'), new Date('2023-07-31')] as [Date, Date],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the display period text label', () => {
    render(<DisplayPeriodPicker {...mockProps} />);

    // Check that the text label for "Display period" is rendered
    const displayPeriodText = screen.getByText('Display period');
    expect(displayPeriodText).toBeInTheDocument();
  });

  test('renders the DateRangePickerInput with correct props', () => {
    render(<DisplayPeriodPicker {...mockProps} />);

    // Check that the DateRangePickerInput is rendered
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();

    // Verify it was called with the correct props
    const dateRangeCall = (DateRangePickerInput as jest.Mock).mock.calls[0][0];
    expect(dateRangeCall.value).toEqual(mockProps.value);
    expect(dateRangeCall.onChange).toBe(mockProps.onChange);
  });

  test('renders IconWithInfo with correct props', () => {
    render(<DisplayPeriodPicker {...mockProps} />);

    // Check that the IconWithInfo is rendered
    const iconWithInfo = screen.getByTestId('icon-with-info');
    expect(iconWithInfo).toBeInTheDocument();

    // Verify the correct props were passed
    expect(iconWithInfo).toHaveAttribute('data-type', 'info');
    expect(iconWithInfo).toHaveAttribute('data-label', 'Display period of performance information');
  });

  test('handles date range change', () => {
    render(<DisplayPeriodPicker {...mockProps} />);

    // Get props that were passed to DateRangePickerInput
    const dateRangePickerProps = (DateRangePickerInput as jest.Mock).mock.calls[0][0];

    // Simulate date range change by directly calling the onChange function
    const newDateRange: [Date, Date] = [new Date('2023-08-01'), new Date('2023-08-31')];
    dateRangePickerProps.onChange(newDateRange);

    // Verify that the onChange callback was called with the new date range
    expect(mockProps.onChange).toHaveBeenCalledWith(newDateRange);
  });

  test('passes empty props correctly', () => {
    const emptyProps = {
      value: [null, null] as unknown as [Date, Date],
      onChange: jest.fn(),
    };

    render(<DisplayPeriodPicker {...emptyProps} />);

    // Verify DateRangePickerInput was called with null values
    const emptyCall = (DateRangePickerInput as jest.Mock).mock.calls[0][0];
    expect(emptyCall.value).toEqual(emptyProps.value);
    expect(emptyCall.onChange).toBe(emptyProps.onChange);
  });
});
