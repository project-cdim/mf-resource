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

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { IconWithInfo } from '@/shared-modules/components';

import { AvailableToIcon, AvailableToIconForNode } from '@/components';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  IconWithInfo: jest.fn(),
}));

describe('AvailableToIcon', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('When available is "Available", the label is empty', () => {
    const available = 'Available';
    render(<AvailableToIcon resourceAvailable={available} />);

    expect(IconWithInfo as jest.Mock).not.toHaveBeenCalled();
  });

  test('When available is not "Available", the label is in English as "This resource is under maintenance"', () => {
    const available = 'hogehoge';
    render(<AvailableToIcon resourceAvailable={available} />);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('This resource is under maintenance');
  });
});

describe('AvailableToIconForNode', () => {
  test('When the number of available resources is 0, the label is in English as "All resources are available"', () => {
    const unavailable_number = 0;
    render(<AvailableToIconForNode unavailableNumber={unavailable_number} />);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('All resources are available');
  });

  test('When the number of available resources is 1 or more, the label is in English as "Some resources are under maintenance"', () => {
    const unavailable_number = 1;
    render(<AvailableToIconForNode unavailableNumber={unavailable_number} />);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Some resources are under maintenance');
  });
});
