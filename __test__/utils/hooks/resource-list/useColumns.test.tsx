/*
 * Copyright 2025-2026 NEC Corporation.
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
    statuses: ['OK', 'Warning'],
    powerStates: ['On', 'Off'],
    states: ['Enabled', 'Disabled'],
    healths: ['OK', 'Warning'],
    detection: ['Detected', 'Not Detected'],
    available: ['Available', 'Unavailable'],
    nodeIDs: 'node001',
    cxlSwitch: 'cxl001',
    allocatedNodes: [],
    allocatedCxl: [],
    placement: 'rack001',
    resourceGroups: 'group001',
    composite: ['composite001'],
  },
  // Set function
  setQuery: {
    id: jest.fn(),
    types: jest.fn(),
    statuses: jest.fn(),
    powerStates: jest.fn(),
    states: jest.fn(),
    healths: jest.fn(),
    detection: jest.fn(),
    available: jest.fn(),
    nodeIDs: jest.fn(),
    cxlSwitch: jest.fn(),
    allocatedNodes: jest.fn(),
    allocatedCxl: jest.fn(),
    placement: jest.fn(),
    resourceGroups: jest.fn(),
    composite: jest.fn(),
  },
  // Select options
  selectOptions: {
    type: [
      { value: 'CPU', label: 'CPU' },
      { value: 'memory', label: 'Memory' },
    ],
    status: [
      { value: 'OK', label: 'OK' },
      { value: 'Warning', label: 'Warning' },
    ],
    powerState: [
      { value: 'On', label: 'On' },
      { value: 'Off', label: 'Off' },
    ],
    state: ['Enabled', 'Disabled'],
    health: ['OK', 'Warning'],
    detection: [
      { value: 'Detected', label: 'Detected' },
      { value: 'Not Detected', label: 'Not Detected' },
    ],
    available: [
      { value: 'Available', label: 'End' },
      { value: 'Unavailable', label: 'Start' },
    ],
    allocate: [
      { value: 'Allocated', label: 'Allocated' },
      { value: 'Unallocated', label: 'Unallocated' },
    ],
    composite: [
      { value: 'Composite', label: 'Composite' },
      { value: 'Single', label: 'Single' },
    ],
  },
};

const selectedAccessors = [
  'id',
  'type',
  'status',
  'powerState',
  'health',
  'state',
  'detected',
  'resourceGroups',
  'placement',
  'cxlSwitch',
  'nodeIDs',
  'composite',
  'resourceAvailable',
];

describe('useColumns', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('That it returns column information of type DataTableColumn', () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    expect(columns).toHaveLength(13);
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].hidden).toBe(false);
    expect(columns[1].accessor).toBe('type');
    expect(columns[1].hidden).toBe(false);
    expect(columns[2].accessor).toBe('status');
    expect(columns[2].hidden).toBe(false);
    expect(columns[3].accessor).toBe('powerState');
    expect(columns[3].hidden).toBe(false);
    expect(columns[4].accessor).toBe('health');
    expect(columns[4].hidden).toBe(false);
    expect(columns[5].accessor).toBe('state');
    expect(columns[5].hidden).toBe(false);
    expect(columns[6].accessor).toBe('detected');
    expect(columns[6].hidden).toBe(false);
    expect(columns[7].accessor).toBe('resourceAvailable');
    expect(columns[7].hidden).toBe(false);
    expect(columns[8].accessor).toBe('resourceGroups');
    expect(columns[8].hidden).toBe(false);
    expect(columns[9].accessor).toBe('placement');
    expect(columns[9].hidden).toBe(false);
    expect(columns[10].accessor).toBe('cxlSwitch');
    expect(columns[10].hidden).toBe(false);
    expect(columns[11].accessor).toBe('nodeIDs');
    expect(columns[11].hidden).toBe(false);
    expect(columns[12].accessor).toBe('composite');
    expect(columns[12].hidden).toBe(false);
  });

  test('Columns not in selectedAccessors become hidden', () => {
    const selectedAccessors: string[] = [];
    const columns = useColumns(resourceFilter, selectedAccessors);
    expect(columns).toHaveLength(13);
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].hidden).toBe(true);
    expect(columns[1].accessor).toBe('type');
    expect(columns[1].hidden).toBe(true);
    expect(columns[2].accessor).toBe('status');
    expect(columns[2].hidden).toBe(true);
    expect(columns[3].accessor).toBe('powerState');
    expect(columns[3].hidden).toBe(true);
    expect(columns[4].accessor).toBe('health');
    expect(columns[4].hidden).toBe(true);
    expect(columns[5].accessor).toBe('state');
    expect(columns[5].hidden).toBe(true);
    expect(columns[6].accessor).toBe('detected');
    expect(columns[6].hidden).toBe(true);
    expect(columns[7].accessor).toBe('resourceAvailable');
    expect(columns[7].hidden).toBe(true);
    expect(columns[8].accessor).toBe('resourceGroups');
    expect(columns[8].hidden).toBe(true);
    expect(columns[9].accessor).toBe('placement');
    expect(columns[9].hidden).toBe(true);
    expect(columns[10].accessor).toBe('cxlSwitch');
    expect(columns[10].hidden).toBe(true);
    expect(columns[11].accessor).toBe('nodeIDs');
    expect(columns[11].hidden).toBe(true);
    expect(columns[12].accessor).toBe('composite');
    expect(columns[12].hidden).toBe(true);
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

  test('That the status is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'status');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);

    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('Status is rendered as empty string when it is undefined', () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'status');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithoutStatus = {
      ...dummyAPPResource[0],
      status: undefined as any,
    };
    render(column.render(resourceWithoutStatus, 0) as ReactElement);
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning')).not.toBeInTheDocument();
    expect(screen.queryByText('Critical')).not.toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the status is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'status');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('Critical');
    expect(resourceFilter.setQuery.statuses).toHaveBeenCalledTimes(1);
  });

  test('That the powerState is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'powerState');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPResource[0], 0) as ReactElement);

    expect(screen.getByText('On')).toBeInTheDocument();
  });

  test('Power state is rendered as empty string when it is undefined', () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'powerState');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithoutPowerState = {
      ...dummyAPPResource[0],
      powerState: undefined as any,
    };
    render(column.render(resourceWithoutPowerState, 0) as ReactElement);
    expect(screen.queryByText('On')).not.toBeInTheDocument();
    expect(screen.queryByText('Off')).not.toBeInTheDocument();
  });

  test('Power state is rendered as given string when it is not expected', () => {
    // Mock useTranslations to return t.has as false for certain values
    const mockT = jest.fn((str: string) => str) as any;
    mockT.has = jest.fn((key: any) => key !== 'UnexpectedValue');
    jest.spyOn(require('next-intl'), 'useTranslations').mockReturnValue(mockT);

    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'powerState');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithoutPowerState = {
      ...dummyAPPResource[0],
      powerState: 'UnexpectedValue' as any,
    };
    render(column.render(resourceWithoutPowerState, 0) as ReactElement);
    // screen.debug();
    expect(screen.queryByText('UnexpectedValue')).toBeInTheDocument();
  });

  test('The query is updated when the MultiSelect input for the powerState is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'powerState');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange('Off');
    expect(resourceFilter.setQuery.powerStates).toHaveBeenCalledTimes(1);
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
    const column = columns.find((column) => column.accessor === 'cxlSwitch');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('CXL Switch');
    await UserEvent.clear(idInput);
    await UserEvent.type(idInput, 'A');
    expect(resourceFilter.setQuery.cxlSwitch).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.cxlSwitch).toHaveBeenCalledTimes(3);
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

    // When "Available": nothing is displayed (the text "Under Maintenance" does not exist)
    const { container: availableContainer } = render(column.render(dummyAPPResource[0], 0) as ReactElement);
    expect(screen.queryByText('Under Maintenance')).not.toBeInTheDocument();

    // Check that the container is empty or only contains icons
    const textContent = availableContainer.textContent;
    expect(textContent).not.toContain('Under Maintenance');

    render(column.render(dummyAPPResource[1], 0) as ReactElement);
    expect(screen.getByText('Under Maintenance')).toBeInTheDocument();
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

  test('That the resourceGroups with empty name displays ID', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'resourceGroups');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithEmptyName = {
      ...dummyAPPResource[0],
      resourceGroups: [{ id: 'group123', name: '' }],
    };
    render(column.render(resourceWithEmptyName, 0) as ReactElement);
    expect(PageLink).toHaveBeenCalled();
  });

  test('The query is updated when the resourceGroups input is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'resourceGroups');
    render(column?.filter as ReactElement);

    const input = screen.getByLabelText('Resource Group');
    await UserEvent.clear(input);
    await UserEvent.type(input, 'A');
    expect(resourceFilter.setQuery.resourceGroups).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.resourceGroups).toHaveBeenCalledTimes(3);
  });

  test('That the placement is rendered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'placement');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithPlacement = {
      ...dummyAPPResource[0],
      placement: {
        rack: {
          id: 'rack001',
          name: 'Rack 1',
          chassis: {
            id: 'chassis001',
            name: 'Chassis 1',
          },
        },
      },
    };
    const result = column.render(resourceWithPlacement, 0);
    expect(result).toBeDefined();
    // Render to trigger the component
    render(result as ReactElement);
    expect(PageLink).toHaveBeenCalled();
  });

  test('That the placement with undefined returns undefined', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'placement');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithoutPlacement = {
      ...dummyAPPResource[0],
      placement: undefined,
    };
    const result = column.render(resourceWithoutPlacement, 0);
    expect(result).toBeUndefined();
  });

  test('That the placement with empty object returns undefined', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'placement');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithEmptyPlacement = {
      ...dummyAPPResource[0],
      placement: {},
    };
    const result = column.render(resourceWithEmptyPlacement, 0);
    expect(result).toBeUndefined();
  });

  test('The query is updated when the placement input is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'placement');
    render(column?.filter as ReactElement);

    const input = screen.getByLabelText('Placement');
    await UserEvent.clear(input);
    await UserEvent.type(input, 'A');
    expect(resourceFilter.setQuery.placement).toHaveBeenCalledTimes(2);

    // Click the × button
    const xButton = screen.getByRole('button');
    await UserEvent.click(xButton);
    expect(resourceFilter.setQuery.placement).toHaveBeenCalledTimes(3);
  });

  test('That the composite is rendered when composite exists', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'composite');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithComposite = {
      ...dummyAPPResource[0],
      composite: 'composite123',
    };
    const result = column.render(resourceWithComposite, 0);
    expect(result).toBeDefined();
    // Render to trigger the component
    render(result as ReactElement);
    expect(PageLink).toHaveBeenCalled();
  });

  test('That the composite renders empty string when composite is undefined', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'composite');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    const resourceWithoutComposite = {
      ...dummyAPPResource[0],
      composite: undefined,
    };
    const result = column.render(resourceWithoutComposite, 0);
    expect(result).toBe('');
  });

  test('The query is updated when the MultiSelect input for composite is entered', async () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'composite');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column.filter as ReactElement);

    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['Composite']);
    expect(resourceFilter.setQuery.composite).toHaveBeenCalledTimes(1);
    expect(resourceFilter.setQuery.composite).toHaveBeenCalledWith(['Composite']);
  });

  test('renders cxlSwitch column with LongSentences component for multiple switch IDs', () => {
    const columns = useColumns(resourceFilter, selectedAccessors);
    const column = columns.find((column) => column.accessor === 'cxlSwitch');

    if (!column || !column.render) {
      throw new Error('cxlSwitch column or render function is undefined');
    }

    const testData = {
      ...dummyAPPResource[0],
      cxlSwitch: ['switch-1', 'switch-2', 'switch-3'],
    };
    const rendered = render(column.render(testData, 0) as ReactElement);

    expect(rendered.container.textContent).toContain('switch-1');
    expect(rendered.container.textContent).toContain('switch-2');
    expect(rendered.container.textContent).toContain('switch-3');
  });
});
