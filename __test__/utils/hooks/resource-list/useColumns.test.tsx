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

import { dummyAPPResource } from '@/utils/dummy-data/resource-list/dummyAPPResource';
import { useColumns } from '@/utils/hooks/resource-list/useColumns';
import { ResourceListFilter } from '@/utils/hooks/useResourceListFilter';

// Mock necessary components
jest.mock('@/shared-modules/components/PageLink');
jest.mock('@/components/DetectionStatusToIcon', () => ({
  DetectionStatusToIcon: jest.fn(() => <span data-testid='mock-detection-icon' />),
}));

// Mocking mantine components
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  MultiSelect: jest.fn(),
  Checkbox: jest.fn(),
  Group: jest.fn(({ children }) => <div>{children}</div>),
}));

const resourceFilter: ResourceListFilter = {
  // Filtered records
  filteredRecords: dummyAPPResource,
  // Filter values
  query: {
    id: '001',
    types: ['CPU', 'memory'],
    states: ['Enabled', 'Disabled'],
    healths: ['OK', 'Warning'],
    detection: ['Detected', 'Not Detected'],
    available: ['Available', 'Unavailable'],
    nodeIDs: 'node001',
    cxlSwitchId: 'cxl001',
    allocatedNodes: [],
    allocatedCxl: [],
  },
  // Set function
  setQuery: {
    id: jest.fn(),
    types: jest.fn(),
    states: jest.fn(),
    healths: jest.fn(),
    detection: jest.fn(),
    available: jest.fn(),
    nodeIDs: jest.fn(),
    cxlSwitchId: jest.fn(),
    allocatedNodes: jest.fn(),
    allocatedCxl: jest.fn(),
  },
  // Select options
  selectOptions: {
    type: [
      { value: 'CPU', label: 'CPU' },
      { value: 'memory', label: 'Memory' },
    ],
    state: ['Enabled', 'Disabled'],
    health: ['OK', 'Warning'],
    detection: [
      { value: 'Detected', label: 'Detected' },
      { value: 'Not Detected', label: 'Not Detected' },
    ],
    available: [
      { value: 'Available', label: 'Included' },
      { value: 'Unavailable', label: 'Excluded' },
    ],
    allocate: [
      { value: 'Allocated', label: 'Allocated' },
      { value: 'Unallocated', label: 'Unallocated' },
    ],
  },
};

const selectedAccessors = [
  'id',
  'type',
  'health',
  'state',
  'detected',
  'resourceGroups',
  'cxlSwitchId',
  'nodeIDs',
  'resourceAvailable',
];

describe('useColumns', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('That it returns column information of type DataTableColumn', () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    expect(columns).toHaveLength(9);
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].hidden).toBe(false);
    expect(columns[1].accessor).toBe('type');
    expect(columns[1].hidden).toBe(false);
    expect(columns[2].accessor).toBe('health');
    expect(columns[2].hidden).toBe(false);
    expect(columns[3].accessor).toBe('state');
    expect(columns[3].hidden).toBe(false);
    expect(columns[4].accessor).toBe('detected');
    expect(columns[4].hidden).toBe(false);
    expect(columns[5].accessor).toBe('resourceGroups');
    expect(columns[5].hidden).toBe(false);
    expect(columns[6].accessor).toBe('cxlSwitchId');
    expect(columns[6].hidden).toBe(false);
    expect(columns[7].accessor).toBe('nodeIDs');
    expect(columns[7].hidden).toBe(false);
    expect(columns[8].accessor).toBe('resourceAvailable');
    expect(columns[8].hidden).toBe(false);
  });

  test('Columns not in selectedAccessors become hidden', () => {
    const selectedAccessors: string[] = [];
    const columns = useColumns(resourceFilter, selectedAccessors);
    expect(columns).toHaveLength(9);
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].hidden).toBe(true);
    expect(columns[1].accessor).toBe('type');
    expect(columns[1].hidden).toBe(true);
    expect(columns[2].accessor).toBe('health');
    expect(columns[2].hidden).toBe(true);
    expect(columns[3].accessor).toBe('state');
    expect(columns[3].hidden).toBe(true);
    expect(columns[4].accessor).toBe('detected');
    expect(columns[4].hidden).toBe(true);
    expect(columns[5].accessor).toBe('resourceGroups');
    expect(columns[5].hidden).toBe(true);
    expect(columns[6].accessor).toBe('cxlSwitchId');
    expect(columns[6].hidden).toBe(true);
    expect(columns[7].accessor).toBe('nodeIDs');
    expect(columns[7].hidden).toBe(true);
    expect(columns[8].accessor).toBe('resourceAvailable');
    expect(columns[8].hidden).toBe(true);
  });

  test('That the ID is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);

    expect(PageLink).toHaveBeenCalledTimes(1);
  });

  test('The query is updated when the ID is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('ID');
    await UserEvent.clear(idInput);
    await UserEvent.type(idInput, 'A');
    expect(resourceFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test('That the type is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'type');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);
    expect(screen.getByText('CPU')).toBeInTheDocument();
    render(column.render(dummyAPPResource[1], 0) as ReactElement);
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the type is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'type');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('Memory');
    expect(resourceFilter.setQuery.types).toHaveBeenCalledTimes(1);
  });

  test('That the health is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'health');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);

    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for health is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'health');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('Critical');
    expect(resourceFilter.setQuery.healths).toHaveBeenCalledTimes(1);
  });

  test('That the resource status is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'state');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for resource status is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'state');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('Disabled');
    expect(resourceFilter.setQuery.states).toHaveBeenCalledTimes(1);
  });

  test('The query is updated when the CXL switch input is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'cxlSwitchId');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('CXL Switch');
    await UserEvent.clear(idInput);
    await UserEvent.type(idInput, 'A');
    expect(resourceFilter.setQuery.cxlSwitchId).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.cxlSwitchId).toHaveBeenCalledTimes(3);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['Allocated']);
    expect(resourceFilter.setQuery.allocatedCxl).toHaveBeenCalledTimes(1);
  });

  test('That the node is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'nodeIDs');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);
    expect(PageLink).toHaveBeenCalledTimes(2);

    render(column.render(dummyAPPResource[1], 0) as ReactElement);
    expect(PageLink).toHaveBeenCalledTimes(2);
  });

  test('The query is updated when the node input is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'nodeIDs');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('Node');
    await UserEvent.clear(idInput);
    await UserEvent.type(idInput, 'A');
    expect(resourceFilter.setQuery.nodeIDs).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.nodeIDs).toHaveBeenCalledTimes(3);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['Allocated']);
    expect(resourceFilter.setQuery.allocatedNodes).toHaveBeenCalledTimes(1);
  });

  test('That the design target specification is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'resourceAvailable');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);
    expect(screen.getByText('Included')).toBeInTheDocument();

    render(column.render(dummyAPPResource[1], 0) as ReactElement);
    expect(screen.getByText('Excluded')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for design target specification is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'resourceAvailable');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('unavailable');
    expect(resourceFilter.setQuery.available).toHaveBeenCalledTimes(1);
  });

  test('That the detection status is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'detected');
    if (!column || !column.render) {
      throw new Error('undefined');
    }

    // Test for detected=true
    render(column.render({ ...dummyAPPResource[0], detected: true }, 0) as ReactElement);
    expect(screen.getByText('Detected')).toBeInTheDocument();

    // Test for detected=false
    render(column.render({ ...dummyAPPResource[0], detected: false }, 0) as ReactElement);
    expect(screen.getByText('Not Detected')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for detection status is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'detected');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['Detected']);
    expect(resourceFilter.setQuery.detection).toHaveBeenCalledTimes(1);
    expect(resourceFilter.setQuery.detection).toHaveBeenCalledWith(['Detected']);
  });

  test('That the resourceGroups is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'resourceGroups');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);
    expect(PageLink).toHaveBeenCalledTimes(1);

    render(column.render(dummyAPPResource[1], 0) as ReactElement);
    expect(PageLink).toHaveBeenCalledTimes(2);
  });
});
