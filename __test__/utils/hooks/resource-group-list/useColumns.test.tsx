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

import { cleanup, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { DateRangePicker, PageLink } from '@/shared-modules/components';
import { render } from '@/shared-modules/__test__/test-utils';

import { useColumns } from '@/utils/hooks/resource-group-list/useColumns';
import { ResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';
import { dummyAPPResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPPResourceGroups';

jest.mock('@/shared-modules/components', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/components'),
  PageLink: jest.fn(),
  DateRangePicker: jest.fn(),
}));

const dummyResourceGroupFilter: ResourceGroupListFilter = {
  // Filtered records
  filteredRecords: dummyAPPResourceGroups,
  // Filter value
  query: {
    id: '111',
    name: 'Resource Group 111',
    description: 'Description of Resource Group 111',
    createdAt: [new Date('2021-01-01'), new Date('2021-12-31')],
    updatedAt: [new Date('2021-01-01'), new Date('2021-12-31')],
  },
  // Set function
  setQuery: {
    id: jest.fn(),
    name: jest.fn(),
    description: jest.fn(),
    createdAt: jest.fn(),
    updatedAt: jest.fn(),
  },
};
const selectedAccessors = ['name', 'description', 'id', 'createdAt', 'updatedAt'];

describe('useColumns', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });
  test('It returns column information of type DataTableColumn (all visible)', () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);

    expect(columns).toHaveLength(5);
    // Name column
    expect(columns[0].accessor).toBe('name');
    expect(columns[0].title).toBe('Name');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].hidden).toBeFalsy();
    expect(columns[0].filtering).toBeTruthy();
    // Description column
    expect(columns[1].accessor).toBe('description');
    expect(columns[1].title).toBe('Description');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].hidden).toBeFalsy();
    expect(columns[1].filtering).toBeTruthy();
    // ID column
    expect(columns[2].accessor).toBe('id');
    expect(columns[2].title).toBe('ID');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeFalsy();
    expect(columns[2].filtering).toBeTruthy();
    // CreatedAt column
    expect(columns[3].accessor).toBe('createdAt');
    expect(columns[3].title).toBe('Created');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeFalsy();
    expect(columns[3].filtering).toBeTruthy();
    // UpdatedAt column
    expect(columns[4].accessor).toBe('updatedAt');
    expect(columns[4].title).toBe('Updated');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeFalsy();
    expect(columns[4].filtering).toBeTruthy();
  });

  test('It returns column information of type DataTableColumn (all hidden)', () => {
    const columns = useColumns(dummyResourceGroupFilter, []);

    expect(columns).toHaveLength(5);
    // Name column
    expect(columns[0].accessor).toBe('name');
    expect(columns[0].title).toBe('Name');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].hidden).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();
    // Description column
    expect(columns[1].accessor).toBe('description');
    expect(columns[1].title).toBe('Description');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].hidden).toBeTruthy();
    expect(columns[1].filtering).toBeTruthy();
    // ID column
    expect(columns[2].accessor).toBe('id');
    expect(columns[2].title).toBe('ID');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].hidden).toBeTruthy();
    expect(columns[2].filtering).toBeTruthy();
    // CreatedAt column
    expect(columns[3].accessor).toBe('createdAt');
    expect(columns[3].title).toBe('Created');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].hidden).toBeTruthy();
    expect(columns[3].filtering).toBeTruthy();
    // UpdatedAt column
    expect(columns[4].accessor).toBe('updatedAt');
    expect(columns[4].title).toBe('Updated');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].hidden).toBeTruthy();
    expect(columns[4].filtering).toBeTruthy();
  });

  test('That the name is rendered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'name');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);

    expect(PageLink).toHaveBeenCalledTimes(1);
  });

  test('The query is updated when the name is entered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'name');
    render(column?.filter as ReactElement);

    const textInput = screen.getByLabelText('Name');
    await UserEvent.clear(textInput);
    await UserEvent.type(textInput, 'A');
    expect(dummyResourceGroupFilter.setQuery.name).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getAllByRole('button')[0];
    await UserEvent.click(xButton);
    expect(dummyResourceGroupFilter.setQuery.name).toHaveBeenCalledTimes(3);
  });

  test('The query is updated when the description is entered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'description');
    render(column?.filter as ReactElement);

    const textInput = screen.getByLabelText('Description');
    await UserEvent.clear(textInput);
    await UserEvent.type(textInput, 'A');
    expect(dummyResourceGroupFilter.setQuery.description).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getAllByRole('button')[0];
    await UserEvent.click(xButton);
    expect(dummyResourceGroupFilter.setQuery.description).toHaveBeenCalledTimes(3);
  });

  test('The query is updated when the ID is entered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const textInput = screen.getByLabelText('ID');
    await UserEvent.clear(textInput);
    await UserEvent.type(textInput, 'A');
    expect(dummyResourceGroupFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getAllByRole('button')[0];
    await UserEvent.click(xButton);
    expect(dummyResourceGroupFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test('That the createdAt is rendered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'createdAt');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);
    expect(screen.getByText(dummyAPPResourceGroups[0].createdAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPResourceGroups[1], 0) as ReactElement);
    expect(screen.getByText(dummyAPPResourceGroups[1].createdAt.toLocaleString())).toBeInTheDocument();
  });

  test('That the updatedAt is rendered', async () => {
    const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'updatedAt');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);
    expect(screen.getByText(dummyAPPResourceGroups[0].updatedAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPResourceGroups[1], 0) as ReactElement);
    expect(screen.getByText(dummyAPPResourceGroups[1].updatedAt.toLocaleString())).toBeInTheDocument();
  });

  test.each(['createdAt', 'updatedAt'])(
    'That the date range filter component receives the expected arguments (%s)',
    async (accessor: string) => {
      const columns = useColumns(dummyResourceGroupFilter, selectedAccessors);
      const column = columns.find((column) => column.accessor === accessor) as {
        filter: (params: { close: () => void }) => React.ReactNode;
      };
      const closeFunc = () => undefined;
      render(column?.filter({ close: closeFunc }) as ReactElement);

      expect(DateRangePicker).toHaveBeenCalledTimes(1);
    }
  );
});
