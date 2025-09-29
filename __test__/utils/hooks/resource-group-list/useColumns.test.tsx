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

import { cleanup, renderHook, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { DateRangePicker, PageLink } from '@/shared-modules/components';
import { render } from '@/shared-modules/__test__/test-utils';

import { useColumns } from '@/utils/hooks/resource-group-list/useColumns';
import { ResourceGroupListFilter } from '@/utils/hooks/useResourceGroupListFilter';
import { dummyAPPResourceGroups } from '@/utils/dummy-data/resource-group-list/dummyAPPResourceGroups';
import { usePermission } from '@/shared-modules/utils/hooks';

jest.mock('@/shared-modules/components', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/components'),
  PageLink: jest.fn(),
  DateRangePicker: jest.fn(),
}));

jest.mock('@/shared-modules/styles/styles', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/styles/styles'),
  useColorStyles: jest.fn(() => ({
    red: { color: 'red', backgroundColor: 'red' },
    blue: { color: 'blue', backgroundColor: 'blue' },
  })),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
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

const openModal = jest.fn();

describe('useColumns', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
    openModal.mockReset();
    (usePermission as jest.Mock).mockReset().mockReturnValue(true);
  });
  test('It returns column information of type DataTableColumn (all visible)', () => {
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));

    expect(columns).toHaveLength(6);
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
    // Action column
    expect(columns[5].accessor).toBe('actions');
    expect(columns[5].title).toBe('');
    expect(columns[5].sortable).toBeFalsy();
    expect(columns[5].hidden).toBeFalsy();
    expect(columns[5].filtering).toBeFalsy();
  });

  test('It returns column information of type DataTableColumn (all hidden)', () => {
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, [], openModal));

    expect(columns).toHaveLength(6);
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
    // Action column
    expect(columns[5].accessor).toBe('actions');
    expect(columns[5].title).toBe('');
    expect(columns[5].sortable).toBeFalsy();
    expect(columns[5].hidden).toBeFalsy();
    expect(columns[5].filtering).toBeFalsy();
  });

  test('That the name is rendered', async () => {
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
    const column = columns.find((column) => column.accessor === 'name');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);

    expect(PageLink).toHaveBeenCalledTimes(1);
  });

  test('The query is updated when the name is entered', async () => {
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
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
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
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
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
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
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
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
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
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
      const {
        result: { current: columns },
      } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
      const column = columns.find((column) => column.accessor === accessor) as {
        filter: (params: { close: () => void }) => React.ReactNode;
      };
      const closeFunc = () => undefined;
      render(column?.filter({ close: closeFunc }) as ReactElement);

      expect(DateRangePicker).toHaveBeenCalledTimes(1);
    }
  );

  test('That the actions column is rendered (with manage-permission)', async () => {
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
    const column = columns.find((column) => column.accessor === 'actions');
    if (!column || !column.render) {
      throw new Error('undefined');
    }

    // Render a default group row
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);
    let editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeDisabled();
    await UserEvent.click(editButton);
    expect(openModal).not.toHaveBeenCalled();

    let deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();
    await UserEvent.click(deleteButton);
    expect(openModal).not.toHaveBeenCalled();

    cleanup();

    // Render a not default group row
    render(column.render(dummyAPPResourceGroups[1], 0) as ReactElement);
    editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeEnabled();
    await UserEvent.click(editButton);
    expect(openModal).toHaveBeenCalledWith({ operation: 'edit', rg: dummyAPPResourceGroups[1] });

    deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeEnabled();
    await UserEvent.click(deleteButton);
    expect(openModal).toHaveBeenCalledWith({ operation: 'delete', rg: dummyAPPResourceGroups[1] });
  });

  test('That the actions column is rendered (without manage-permission)', async () => {
    (usePermission as jest.Mock).mockReturnValue(false);
    const {
      result: { current: columns },
    } = renderHook(() => useColumns(dummyResourceGroupFilter, selectedAccessors, openModal));
    const column = columns.find((column) => column.accessor === 'actions');
    if (!column || !column.render) {
      throw new Error('undefined');
    }

    // Render a default group row
    render(column.render(dummyAPPResourceGroups[0], 0) as ReactElement);
    let editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeDisabled();
    await UserEvent.click(editButton);
    expect(openModal).not.toHaveBeenCalled();

    let deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();
    await UserEvent.click(deleteButton);
    expect(openModal).not.toHaveBeenCalled();

    cleanup();

    // Render a not default group row
    render(column.render(dummyAPPResourceGroups[1], 0) as ReactElement);
    editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeDisabled();
    await UserEvent.click(editButton);
    expect(openModal).not.toHaveBeenCalled();

    deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();
    await UserEvent.click(deleteButton);
    expect(openModal).not.toHaveBeenCalled();
  });
});
