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

import { dummyAPPCxlSwitch } from '@/utils/dummy-data/cxl-switch-list/dummyAPPCxlSwitch';
import { useColumns } from '@/utils/hooks/cxl-switch-list/useColumns';
import { CxlSwitchListFilter } from '@/utils/hooks/useCxlSwitchListFilter';

jest.mock('@/shared-modules/components/PageLink');
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  MultiSelect: jest.fn(),
}));

const dummyCxlFilter: CxlSwitchListFilter = {
  /** Filtered records */
  filteredRecords: dummyAPPCxlSwitch,
  /** Value of the filter */
  query: {
    id: '111',
    connected: ['notExist'],
    unallocated: ['notExist'],
    disabled: ['notExist'],
    warning: ['notExist'],
    critical: ['notExist'],
    unavailable: ['notExist'],
  },
  /** Set function */
  setQuery: {
    id: jest.fn(),
    connected: jest.fn(),
    unallocated: jest.fn(),
    disabled: jest.fn(),
    warning: jest.fn(),
    critical: jest.fn(),
    unavailable: jest.fn(),
  },
  /** Options for MultiSelect */
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
  'device.unallocated',
  'device.disabled',
  'device.warning',
  'device.critical',
  'device.resourceUnavailable',
];

describe('useColumns', () => {
  test('DataTableColumn type column information is returned (all displayed)', () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);

    expect(columns).toHaveLength(7);
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
    // unallocated column
    expect(columns[2].accessor).toBe('device.unallocated');
    expect(columns[2].title).toBe('Unallocated Resources');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeFalsy();
    expect(columns[2].filtering).toBeTruthy();
    // disabled column
    expect(columns[3].accessor).toBe('device.disabled');
    expect(columns[3].title).toBe('Disabled Resources');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeFalsy();
    expect(columns[3].filtering).toBeTruthy();
    // warning column
    expect(columns[4].accessor).toBe('device.warning');
    expect(columns[4].title).toBe('Warning Resources');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeFalsy();
    expect(columns[4].filtering).toBeTruthy();
    // critical column
    expect(columns[5].accessor).toBe('device.critical');
    expect(columns[5].title).toBe('Critical Resources');
    expect(columns[5].sortable).toBeTruthy();
    expect(columns[5].hidden).toBeFalsy();
    expect(columns[5].filtering).toBeTruthy();
    // resourceUnavailable column
    expect(columns[6].accessor).toBe('device.resourceUnavailable');
    expect(columns[6].title).toBe('Excluded Resources');
    expect(columns[6].sortable).toBeTruthy();
    expect(columns[6].hidden).toBeFalsy();
    expect(columns[6].filtering).toBeTruthy();
  });
  test('It returns column information of type DataTableColumn (all hidden)', () => {
    const columns = useColumns(dummyCxlFilter, []);

    expect(columns).toHaveLength(7);
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
    // connected column
    expect(columns[2].accessor).toBe('device.unallocated');
    expect(columns[2].title).toBe('Unallocated Resources');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeTruthy();
    expect(columns[2].filtering).toBeTruthy();
    // connected column
    expect(columns[3].accessor).toBe('device.disabled');
    expect(columns[3].title).toBe('Disabled Resources');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeTruthy();
    expect(columns[3].filtering).toBeTruthy();
    // connected column
    expect(columns[4].accessor).toBe('device.warning');
    expect(columns[4].title).toBe('Warning Resources');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeTruthy();
    expect(columns[4].filtering).toBeTruthy();
    // connected column
    expect(columns[5].accessor).toBe('device.critical');
    expect(columns[5].title).toBe('Critical Resources');
    expect(columns[5].sortable).toBeTruthy();
    expect(columns[5].hidden).toBeTruthy();
    expect(columns[5].filtering).toBeTruthy();
    // connected column
    expect(columns[6].accessor).toBe('device.resourceUnavailable');
    expect(columns[6].title).toBe('Excluded Resources');
    expect(columns[6].sortable).toBeTruthy();
    expect(columns[6].hidden).toBeTruthy();
    expect(columns[6].filtering).toBeTruthy();
  });

  test('The query is updated when the ID is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const textInput = screen.getByLabelText('ID');
    await UserEvent.clear(textInput);
    await UserEvent.type(textInput, 'A');
    expect(dummyCxlFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Pressing the close button
    const xButton = screen.getAllByRole('button')[0];
    await UserEvent.click(xButton);
    expect(dummyCxlFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test('The number of resources is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.connected');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('40')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.connected');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.connected).toHaveBeenCalledTimes(1);
  });

  test('Unused resource count is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.unallocated');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('20')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of unused resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.unallocated');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.unallocated).toHaveBeenCalledTimes(1);
  });

  test('Disabled resource count is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.disabled');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('4')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of disabled resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.disabled');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.disabled).toHaveBeenCalledTimes(1);
  });

  test('Warning resource count is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.warning');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('3')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of warning resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.warning');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.warning).toHaveBeenCalledTimes(1);
  });

  test('Critical resource count is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.critical');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('2')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of critical resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.critical');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.critical).toHaveBeenCalledTimes(1);
  });

  test('Excluded resource count is rendered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.resourceUnavailable');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPCxlSwitch[0], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('1')).toBeInTheDocument();

    render(column.render(dummyAPPCxlSwitch[1], 0) as ReactElement);
    // @ts-ignore
    render(PageLink.mock.lastCall[0].children);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the number of excluded resources is entered', async () => {
    const columns = useColumns(dummyCxlFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'device.resourceUnavailable');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('33');
    expect(dummyCxlFilter.setQuery.unavailable).toHaveBeenCalledTimes(1);
  });
});
