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

import { ReactElement } from 'react';

import { MultiSelect } from '@mantine/core';
import { screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink } from '@/shared-modules/components';

import { dummyAPPNode } from '@/utils/dummy-data/node-list/dummyAPPNode';
import { useColumns } from '@/utils/hooks/node-list/useColumns';
import { NodeListFilter } from '@/utils/hooks/useNodeListFilter';

jest.mock('@/shared-modules/components/PageLink');
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  MultiSelect: jest.fn(),
}));

const dummyNodeFilter: NodeListFilter = {
  // Filtered records
  filteredRecords: dummyAPPNode,
  // Filter value
  query: {
    id: '111',
    connected: ['notExist'],
    disabled: ['notExist'],
    warning: ['notExist'],
    critical: ['notExist'],
    unavailable: ['notExist'],
  },
  // Set function
  setQuery: {
    id: jest.fn(),
    connected: jest.fn(),
    disabled: jest.fn(),
    warning: jest.fn(),
    critical: jest.fn(),
    unavailable: jest.fn(),
  },
  // Select options
  selectOptions: {
    number: [
      { value: 'notExist', label: 'equal 0' },
      { value: 'exist', label: '1 or more' },
    ],
  },
};
const selectedAccessors = [
  'id',
  'device.connected',
  'device.disabled',
  'device.warning',
  'device.critical',
  'device.resourceUnavailable',
];

describe('useColumns', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });
  test('It returns column information of type DataTableColumn (all visible)', () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);

    expect(columns).toHaveLength(6);
    // ID column
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].title).toBe('ID');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].hidden).toBeFalsy();
    expect(columns[0].filtering).toBeTruthy();
    // connected column
    expect(columns[1].accessor).toBe('device.connected');
    expect(columns[1].title).toBe('Resources.number');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].hidden).toBeFalsy();
    expect(columns[1].filtering).toBeTruthy();
    // disabled column
    expect(columns[2].accessor).toBe('device.disabled');
    expect(columns[2].title).toBe('Disabled Resources');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeFalsy();
    expect(columns[2].filtering).toBeTruthy();
    // warning column
    expect(columns[3].accessor).toBe('device.warning');
    expect(columns[3].title).toBe('Warning Resources');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeFalsy();
    expect(columns[3].filtering).toBeTruthy();
    // critical column
    expect(columns[4].accessor).toBe('device.critical');
    expect(columns[4].title).toBe('Critical Resources');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeFalsy();
    expect(columns[4].filtering).toBeTruthy();
    // resourceUnavailable column
    expect(columns[5].accessor).toBe('device.resourceUnavailable');
    expect(columns[5].title).toBe('Excluded Resources');
    expect(columns[5].sortable).toBeTruthy();
    expect(columns[5].hidden).toBeFalsy();
    expect(columns[5].filtering).toBeTruthy();
  });
  test('It returns column information of type DataTableColumn (all hidden)', () => {
    const columns = useColumns(dummyNodeFilter, []);

    expect(columns).toHaveLength(6);
    // ID column
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].title).toBe('ID');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].hidden).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();
    // connected column
    expect(columns[1].accessor).toBe('device.connected');
    expect(columns[1].title).toBe('Resources.number');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].hidden).toBeTruthy();
    expect(columns[1].filtering).toBeTruthy();
    // disabled column
    expect(columns[2].accessor).toBe('device.disabled');
    expect(columns[2].title).toBe('Disabled Resources');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeTruthy();
    expect(columns[2].filtering).toBeTruthy();
    // warning column
    expect(columns[3].accessor).toBe('device.warning');
    expect(columns[3].title).toBe('Warning Resources');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeTruthy();
    expect(columns[3].filtering).toBeTruthy();
    // critical column
    expect(columns[4].accessor).toBe('device.critical');
    expect(columns[4].title).toBe('Critical Resources');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeTruthy();
    expect(columns[4].filtering).toBeTruthy();
    // resourceUnavailable column
    expect(columns[5].accessor).toBe('device.resourceUnavailable');
    expect(columns[5].title).toBe('Excluded Resources');
    expect(columns[5].sortable).toBeTruthy();
    expect(columns[5].hidden).toBeTruthy();
    expect(columns[5].filtering).toBeTruthy();
  });

  test('That the ID is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);

    expect(PageLink).toHaveBeenCalledTimes(1);
  });

  test('The query is updated when the ID is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const textInput = screen.getByLabelText('ID');
    await UserEvent.clear(textInput);
    await UserEvent.type(textInput, 'A');
    expect(dummyNodeFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getAllByRole('button')[0];
    await UserEvent.click(xButton);
    expect(dummyNodeFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test('The number of resources is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.connected');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('40')).toBeInTheDocument();

    render(column.render(dummyAPPNode[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of resources is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.connected');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyNodeFilter.setQuery.connected).toHaveBeenCalledTimes(1);
  });

  test('That the number of disabled resources is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.disabled');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('4')).toBeInTheDocument();

    render(column.render(dummyAPPNode[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of disabled resources is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.disabled');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyNodeFilter.setQuery.disabled).toHaveBeenCalledTimes(1);
  });

  test('That the number of warning resources is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.warning');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('3')).toBeInTheDocument();

    render(column.render(dummyAPPNode[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of warning resources is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.warning');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyNodeFilter.setQuery.warning).toHaveBeenCalledTimes(1);
  });

  test('That the number of abnormal resources is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.critical');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('2')).toBeInTheDocument();

    render(column.render(dummyAPPNode[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of abnormal resources is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.critical');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyNodeFilter.setQuery.critical).toHaveBeenCalledTimes(1);
  });

  test('That the number of resources excluded from design considerations is rendered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.resourceUnavailable');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPNode[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('1')).toBeInTheDocument();

    render(column.render(dummyAPPNode[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of resources excluded from design considerations is entered', async () => {
    const columns = useColumns(dummyNodeFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.resourceUnavailable');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyNodeFilter.setQuery.unavailable).toHaveBeenCalledTimes(1);
  });
});
