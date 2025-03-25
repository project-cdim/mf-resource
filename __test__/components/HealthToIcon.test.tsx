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

import { HealthToIcon, HealthToIconForNodeCritical, HealthToIconForNodeWarning } from '@/components';
import { JSX } from 'react';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  IconWithInfo: jest.fn(),
}));

describe('HealthToIcon', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('When health is OK, the label is in English as "Resource is working properly"', () => {
    const health = 'OK';
    const HealthIconWithInfo = HealthToIcon(health);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Resource is working properly');
  });

  test('When health is Warning, the label is in English as "A condition requires attention"', () => {
    const health = 'Warning';
    const HealthIconWithInfo = HealthToIcon(health);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('A condition requires attention');
  });

  test('When health is Critical, the label is in English as "A critical condition exists that requires immediate attention"', () => {
    const health = 'Critical';
    const HealthIconWithInfo = HealthToIcon(health);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('A critical condition exists that requires immediate attention');
  });

  test('When the status is undefined, there is no icon', () => {
    const health = 'hogehoge';
    const HealthIconWithInfo = HealthToIcon(health);
    render(HealthIconWithInfo as JSX.Element);

    expect(HealthIconWithInfo).toBeNull();
  });

  test('When the state is undefined, there is no icon', () => {
    const state = undefined;
    const HealthIconWithInfo = HealthToIcon(state);
    expect(HealthIconWithInfo).toBeNull();
  });
});

describe('HealthToIconForNodeWarning', () => {
  test('When the number of resources in a state requiring attention is 0, the label is in English as "All resources are working properly"', () => {
    const warning_number = 0;
    const HealthIconWithInfo = HealthToIconForNodeWarning(warning_number);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('All resources are working properly');
  });

  test('When the number of resources in a state requiring attention is 1 or more, the label is in English as "A resource exists that requires attention"', () => {
    const warning_number = 1;
    const HealthIconWithInfo = HealthToIconForNodeWarning(warning_number);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('A resource exists that requires attention');
  });
});

describe('HealthToIconForNodeCritical', () => {
  test('When the number of resources in a critical state is 0, the label is in English as "All resources are working properly"', () => {
    const critical_number = 0;
    const HealthIconWithInfo = HealthToIconForNodeCritical(critical_number);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('All resources are working properly');
  });

  test('When the number of resources in a critical state is 1 or more, the label is in English as "A resource exists in a critical condition that requires immediate attention"', () => {
    const critical_number = 1;
    const HealthIconWithInfo = HealthToIconForNodeCritical(critical_number);
    render(HealthIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('A resource exists in a critical condition that requires immediate attention');
  });
});
