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
import { PageLink } from '@/shared-modules/components';
import { ResourceListQuery } from '@/shared-modules/types';

import { NumberView } from '../../components';

jest.mock('@/shared-modules/components/PageLink');

const props = {
  title: 'Title',
  number: 1234567890,
  link: 'http://www.xxx/',
  loading: false,
};

const query: ResourceListQuery = {
  cxlSwitchId: ['id1', 'id2', 'id3'],
  type: ['Accelerator', 'CPU', 'memory'],
  allocatednode: ['allocatednode1', 'allocatednode2', 'allocatednode3'],
  state: ['Enabled', 'Disabled', 'InTest'],
  health: ['OK', 'Warning', 'Critical'],
  resourceAvailable: ['Available', 'Unavailable'],
};

describe('NumberView', () => {
  test('The title is displayed', () => {
    render(<NumberView {...props} />);

    // Render the children of PageLink
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    const title = screen.getByRole('heading');
    expect(title).toHaveTextContent(props.title);
  });
  test('The number is displayed', () => {
    render(<NumberView {...props} />);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);

    const message = screen.getByText('1234567890', { exact: false });
    expect(message).toBeInTheDocument();
  });
  test('It is displayed as blank when the number is undefined', () => {
    render(<NumberView {...props} number={undefined} />);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);

    const message = screen.getByRole('heading').nextElementSibling;
    expect(message).toHaveTextContent('');
  });
  test('The link is set', () => {
    render(<NumberView {...props} />);
    // @ts-ignore
    expect(PageLink.mock.lastCall[0].path).toBe(props.link);
  });
  test('It is possible to pass a query', () => {
    render(<NumberView {...props} query={query} />);
    // @ts-ignore
    expect(PageLink.mock.lastCall[0].query).toBe(query);
  });
});
