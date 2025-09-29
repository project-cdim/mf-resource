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

import { StateToIcon, StateToIconForNode } from '@/components';
import { JSX } from 'react';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  IconWithInfo: jest.fn(),
}));

describe('StateToIcon', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('When the state is Enabled, the label is in English as "Resource is enabled"', () => {
    const state = 'Enabled';
    const StateIconWithInfo = StateToIcon(state);
    render(StateIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Resource is enabled');
  });

  test('When the state is Disabled, the label is in English as "Resource is disabled"', () => {
    const state = 'Disabled';
    const StateIconWithInfo = StateToIcon(state);
    render(StateIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Resource is disabled');
  });

  test('That the label is in appropriate English for each state', () => {
    const states = {
      StandbyOffline: 'Resource is enabled but awaits an external action to activate it',
      StandbySpare:
        'Resource is part of a redundancy set and awaits a failover or other external action to activate it',
      InTest: 'Resource is undergoing testing, or is in the process of capturing information for debugging',
      Starting: 'Resource is starting',
      Absent: 'Resource is either not present or detected',
      UnavailableOffline: 'Resource is present but cannot be used',
      Deferring: 'Resource does not process any commands but queues new requests',
      Quiesced: 'Resource is enabled but only processes a restricted set of commands',
      Updating: 'Resource is updating and might be unavailable or degraded',
      Qualified: 'Resource quality is within the acceptable range of operation',
    };

    for (const [state, label] of Object.entries(states)) {
      const StateIconWithInfo = StateToIcon(state);
      render(StateIconWithInfo as JSX.Element);

      // @ts-ignore
      const givenProps = IconWithInfo.mock.lastCall[0];
      expect(givenProps.label).toEqual(label);
    }
  });

  test('When the state is unknown, there is no icon', () => {
    const state = 'hogehoge';
    const StateIconWithInfo = StateToIcon(state);
    expect(StateIconWithInfo).toBeNull();
  });

  test('When the state is undefined, there is no icon', () => {
    const state = undefined;
    const StateIconWithInfo = StateToIcon(state);
    expect(StateIconWithInfo).toBeNull();
  });

  test('When the state is null, there is no icon', () => {
    const state = null;
    const StateIconWithInfo = StateToIcon(state as unknown as undefined);
    expect(StateIconWithInfo).toBeNull();
  });
});

describe('StateToIconForNode', () => {
  test('When the number of disabled resources is 0, the label is in English as "All resources are enabled"', () => {
    const disabled_resources = 0;
    const StateIconWithInfo = StateToIconForNode(disabled_resources);
    render(StateIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('All resources are enabled');
  });

  test('When the number of disabled resources is 1 or more, the label is in English as "Some resources are disabled"', () => {
    const disabled_resources = 1;
    const StateIconWithInfo = StateToIconForNode(disabled_resources);
    render(StateIconWithInfo as JSX.Element);

    // @ts-ignore
    const givenProps = IconWithInfo.mock.lastCall[0];
    expect(givenProps.label).toBe('Some resources are disabled');
  });
});
