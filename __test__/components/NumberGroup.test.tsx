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

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';

import { NumberGroup, NumberGroupProps } from '../../components';

jest.mock('@luigi-project/client', () => ({
  addInitListener: jest.fn(),
}));

const props: NumberGroupProps = {
  title: 'Group Title',
  items: [
    {
      title: 'Title',
      number: 1234567890,
      link: 'Link destination',
      query: {
        cxlSwitchId: ['test'],
        type: ['CPU'],
        allocatednode: ['test'],
        state: ['Enabled'],
        health: ['OK'],
        resourceAvailable: ['Available'],
      } /** Link destination parameters */,
    },
    {
      title: 'Title2',
      number: 1234567890,
      link: 'Link destination',
      query: {
        cxlSwitchId: ['test'],
        type: ['memory'],
        allocatednode: ['test'],
        state: ['Enabled'],
        health: ['OK'],
        resourceAvailable: ['Unavailable'],
      } /** Link destination parameters */,
    },
  ],
};

describe('NumberGroup', () => {
  test('The title is displayed', () => {
    render(<NumberGroup {...props} />);
    const title = screen.getByText(props.title);
    expect(title).toHaveTextContent(props.title);
  });

  test('NumberView is displayed correctly', () => {
    render(<NumberGroup {...props} />);
    props.items.forEach((item) => {
      const numberTitleElement = screen.getByText(item.title);
      expect(numberTitleElement).toHaveTextContent(item.title);
    });
  });
});
