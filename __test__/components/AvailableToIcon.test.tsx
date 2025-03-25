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
import { render } from '@testing-library/react';

import { IconWithInfo } from '@/shared-modules/components';

import { AvailableToIcon, AvailableToIconForNode } from '@/components';
import { JSX } from 'react';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  IconWithInfo: jest.fn(),
}));

describe('AvailableToIcon', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('When available is "Available", the label is in English as "Resource will be the subject of the subsequent design"', () => {
    const available = 'Available';
    const AvailableIconWithInfo = AvailableToIcon(available);
    render(AvailableIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Resource will be the subject of the subsequent design');
  });

  test('When available is not "Available", the label is in English as "Resource will be excluded from subsequent designs"', () => {
    const available = 'hogehoge';
    const AvailableIconWithInfo = AvailableToIcon(available);
    render(AvailableIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Resource will be excluded from subsequent designs');
  });
});

describe('AvailableToIconForNode', () => {
  test('When the number of available resources is 0, the label is in English as "All resources are subject to subsequent designs"', () => {
    const unavailable_number = 0;
    const AvailableIconWithInfo = AvailableToIconForNode(unavailable_number);
    render(AvailableIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('All resources are subject to subsequent designs');
  });

  test('When the number of available resources is 1 or more, the label is in English as "Some resources will be excluded from subsequent designs"', () => {
    const unavailable_number = 1;
    const AvailableIconWithInfo = AvailableToIconForNode(unavailable_number);
    render(AvailableIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Some resources will be excluded from subsequent designs');
  });
});
