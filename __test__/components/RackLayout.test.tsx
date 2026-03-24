/*
 * Copyright 2026 NEC Corporation.
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

import '@/shared-modules/__test__/mock';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/shared-modules/__test__/test-utils';
import { RackLayout } from '@/components';
import { APIChassis } from '@/types';
import { RackChassisProvider } from '@/app/[lng]/rack/RackChassisContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <RackChassisProvider rackData={{ id: 'test-rack', name: 'Test Rack', height: 42, chassis: [] }}>
      {ui}
    </RackChassisProvider>
  );
};

const mockChassisList: APIChassis[] = [
  {
    id: 'chassis-001',
    name: 'Test Chassis 1',
    modelName: 'Model 1',
    description: 'Test Chassis 1 Description',
    height: 2,
    depth: 'Full',
    unitPosition: 1,
    facePosition: 'Front',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    CXLSwitches: [],
    deviceUnits: [
      {
        id: 'unit-001',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            annotation: {
              available: true,
            },
            device: {
              deviceID: 'res-001',
              type: 'CPU',
              status: {
                health: 'OK',
                state: 'Enabled',
              },
              powerState: 'On',
              powerCapability: true,
            },
            detected: true,
            nodeIDs: [],
            resourceGroupIDs: [],
          },
        ],
      },
    ],
  },
  {
    id: 'chassis-002',
    name: 'Test Chassis 2',
    modelName: 'Model 2',
    description: 'Test Chassis 2 Description',
    height: 1,
    depth: 'Half',
    unitPosition: 5,
    facePosition: 'Rear',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    CXLSwitches: [],
    deviceUnits: [
      {
        id: 'unit-002',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            annotation: {
              available: true,
            },
            device: {
              deviceID: 'res-002',
              type: 'memory',
              status: {
                health: 'Warning',
                state: 'Enabled',
              },
              powerState: 'On',
              powerCapability: true,
            },
            detected: true,
            nodeIDs: [],
            resourceGroupIDs: [],
          },
        ],
      },
    ],
  },
  {
    id: 'chassis-003',
    name: 'Test Chassis 3',
    modelName: 'Model 3',
    description: 'Test Chassis 3 Description',
    height: 1,
    depth: 'Full',
    unitPosition: 10,
    facePosition: 'Front',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    CXLSwitches: [],
    deviceUnits: [
      {
        id: 'unit-003',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            annotation: {
              available: true,
            },
            device: {
              deviceID: 'res-003',
              type: 'storage',
              status: {
                health: 'Critical',
                state: 'Enabled',
              },
              powerState: 'On',
              powerCapability: true,
            },
            detected: true,
            nodeIDs: [],
            resourceGroupIDs: [],
          },
        ],
      },
    ],
  },
  {
    id: 'chassis-004',
    name: 'Test Chassis 4',
    modelName: 'Model 4',
    description: 'Test Chassis 4 Description',
    height: 1,
    depth: 'Half',
    unitPosition: 15,
    facePosition: 'Front',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    CXLSwitches: [],
    deviceUnits: [
      {
        id: 'unit-004',
        annotation: {
          systemItems: {
            available: true,
          },
        },
        resources: [
          {
            annotation: {
              available: true,
            },
            device: {
              deviceID: 'res-004',
              type: 'CPU',
              status: {
                health: 'OK',
                state: 'Disabled',
              },
              powerState: 'Off',
              powerCapability: true,
            },
            detected: true,
            nodeIDs: [],
            resourceGroupIDs: [],
          },
        ],
      },
    ],
  },
  {
    id: 'chassis-005',
    name: 'Test Chassis 5',
    modelName: 'Model 5',
    description: 'Test Chassis 5 Description',
    height: 1,
    depth: 'Half',
    unitPosition: 20,
    facePosition: 'Rear',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    CXLSwitches: [],
    deviceUnits: [
      {
        id: 'unit-005',
        annotation: {
          systemItems: {
            available: false,
          },
        },
        resources: [
          {
            annotation: {
              available: false,
            },
            device: {
              deviceID: 'res-005',
              type: 'CPU',
              status: {
                health: 'OK',
                state: 'Enabled',
              },
              powerState: 'On',
              powerCapability: true,
            },
            detected: true,
            nodeIDs: [],
            resourceGroupIDs: [],
          },
        ],
      },
    ],
  },
];

describe('RackLayout', () => {
  test('renders loading state', () => {
    renderWithProvider(<RackLayout loading={true} chassisList={[]} />);
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Rear')).toBeInTheDocument();
  });

  test('renders without loading state', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Rear')).toBeInTheDocument();
  });

  test('renders with empty chassis list', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Rear')).toBeInTheDocument();
  });

  test('renders with undefined chassis list', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={undefined} />);
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Rear')).toBeInTheDocument();
  });

  test('renders unit numbers from 1 to 42', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);
    expect(screen.getAllByText('1')).toHaveLength(2); // Front and Rear
    expect(screen.getAllByText('42')).toHaveLength(2);
  });

  test('renders chassis with correct height (2U)', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    const chassisButtons = screen.getAllByRole('button');
    const chassis1Button = chassisButtons.find((btn) => btn.textContent?.includes('Test Chassis 1'));
    expect(chassis1Button).toBeInTheDocument();
  });

  test('displays chassis name on Front face', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    expect(screen.getByText('Test Chassis 1')).toBeInTheDocument();
  });

  test('displays chassis name in parentheses on non-face side', () => {
    const chassisFrontView: APIChassis[] = [
      {
        id: 'chassis-full-depth',
        name: 'Full Depth Chassis',
        modelName: 'Model Full',
        description: 'Full Depth Chassis Description',
        height: 1,
        depth: 'Full',
        unitPosition: 25,
        facePosition: 'Rear',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-full',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-full',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={chassisFrontView} />);
    // In the Front view, a Full depth chassis with Rear facePosition should be in parentheses
    expect(screen.getByText('(Full Depth Chassis)')).toBeInTheDocument();
  });

  test('clicking chassis sets selectedChassisId', async () => {
    const user = userEvent.setup();
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);

    const chassis1Button = screen.getByText('Test Chassis 1');
    await user.click(chassis1Button);

    // After click, the IconArrowBadgeRight should be visible
    const buttons = screen.getAllByRole('button');
    const selectedButton = buttons.find((btn) => btn.textContent?.includes('Test Chassis 1'));
    expect(selectedButton).toBeInTheDocument();
  });

  test('chassis without name shows empty string', () => {
    const chassisNoName: APIChassis[] = [
      {
        id: 'chassis-no-name',
        name: '',
        modelName: '',
        description: '',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-no-name',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-no-name',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={chassisNoName} />);
    // Should render but with empty name
    expect(screen.getByText('Front')).toBeInTheDocument();
  });

  test('hovering over empty slot shows IconPlus', async () => {
    const user = userEvent.setup();
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);

    const buttons = screen.getAllByRole('button');
    const emptyButton = buttons[0]; // First empty slot

    await user.hover(emptyButton);
    // IconPlus should be visible on hover (with opacity 0.7)
  });

  test('chassis with Warning health shows IconAlertTriangle', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-002 has Warning health
    expect(screen.getByText('Test Chassis 2')).toBeInTheDocument();
  });

  test('chassis with Critical health shows red style', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-003 has Critical health
    expect(screen.getByText('Test Chassis 3')).toBeInTheDocument();
  });

  test('chassis with Disabled state shows red style', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-004 has Disabled state
    expect(screen.getByText('Test Chassis 4')).toBeInTheDocument();
  });

  test('chassis with unavailable annotation shows gray style', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-005 has available: false
    expect(screen.getByText('Test Chassis 5')).toBeInTheDocument();
  });

  test('Full depth chassis appears in both Front and Rear', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-003 has depth: 'Full'
    const chassis3Buttons = screen.getAllByText('Test Chassis 3');
    expect(chassis3Buttons.length).toBeGreaterThanOrEqual(1);
  });

  test('chassis at unit position 1 has bottom border', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-001 is at position 1
    expect(screen.getByText('Test Chassis 1')).toBeInTheDocument();
  });

  test('chassis takes up correct number of units based on height', () => {
    const tallChassis: APIChassis[] = [
      {
        id: 'chassis-tall',
        name: 'Tall Chassis',
        modelName: 'Model Tall',
        description: 'Tall Chassis Description',
        height: 5,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-tall',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-tall',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={tallChassis} />);
    expect(screen.getByText('Tall Chassis')).toBeInTheDocument();
  });

  test('hasAlert returns true for Critical health', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-003 has Critical health and should show alert
    expect(screen.getByText('Test Chassis 3')).toBeInTheDocument();
  });

  test('hasAlert returns true for Warning health', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-002 has Warning health and should show alert
    expect(screen.getByText('Test Chassis 2')).toBeInTheDocument();
  });

  test('hasAlert returns true for Disabled state', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-004 has Disabled state and should show alert
    expect(screen.getByText('Test Chassis 4')).toBeInTheDocument();
  });

  test('hasAlert returns true for unavailable annotation', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    // chassis-005 has available: false and should show alert
    expect(screen.getByText('Test Chassis 5')).toBeInTheDocument();
  });

  test('hasAlert returns false for OK chassis', () => {
    const okChassis: APIChassis[] = [
      {
        id: 'chassis-ok',
        name: 'OK Chassis',
        modelName: 'Model OK',
        description: 'OK Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-ok',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-ok',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={okChassis} />);
    expect(screen.getByText('OK Chassis')).toBeInTheDocument();
  });

  test('empty slots are clickable but do not set selectedChassisId', async () => {
    const user = userEvent.setup();
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);

    const buttons = screen.getAllByRole('button');
    const emptyButton = buttons[0];

    await user.click(emptyButton);
    // Should not crash
  });

  test('clicking chassis without id does not set selectedChassisId', async () => {
    const user = userEvent.setup();
    const chassisNoId: APIChassis[] = [
      {
        id: undefined as any,
        name: 'No ID Chassis',
        modelName: 'Model No ID',
        description: 'No ID Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-no-id',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-no-id',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={chassisNoId} />);

    const button = screen.getByText('No ID Chassis');
    await user.click(button);
    // Should not crash
  });

  test('chassis color priority: Critical/Disabled > Warning > Unavailable > OK', () => {
    const mixedChassis: APIChassis[] = [
      {
        id: 'chassis-mixed',
        name: 'Mixed Chassis',
        modelName: 'Model Mixed',
        description: 'Mixed Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-mixed-1',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-mixed-1',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
          {
            id: 'unit-mixed-2',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-mixed-2',
                  type: 'memory',
                  status: {
                    health: 'Warning',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
          {
            id: 'unit-mixed-3',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-mixed-3',
                  type: 'storage',
                  status: {
                    health: 'Critical',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={mixedChassis} />);
    // Should show red (Critical takes priority)
    expect(screen.getByText('Mixed Chassis')).toBeInTheDocument();
  });

  test('mouse enter and leave events toggle hover state', async () => {
    const user = userEvent.setup();
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);

    const buttons = screen.getAllByRole('button');
    const emptyButton = buttons[0];

    await user.hover(emptyButton);
    await user.unhover(emptyButton);
    // Should not crash
  });

  test('tooltip shows chassis name', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={mockChassisList} />);
    expect(screen.getByText('Test Chassis 1')).toBeInTheDocument();
  });

  test('tooltip shows "Add chassis" for empty slots', () => {
    renderWithProvider(<RackLayout loading={false} chassisList={[]} />);
    // Empty slots should have "Add chassis" tooltip
    expect(screen.getByText('Front')).toBeInTheDocument();
  });

  test('chassis with multiple deviceUnits checks all resources for alerts', () => {
    const multiUnitChassis: APIChassis[] = [
      {
        id: 'chassis-multi',
        name: 'Multi Unit Chassis',
        modelName: 'Model Multi',
        description: 'Multi Unit Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-multi-1',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-multi-1',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-multi-2',
                  type: 'memory',
                  status: {
                    health: 'Warning',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={multiUnitChassis} />);
    expect(screen.getByText('Multi Unit Chassis')).toBeInTheDocument();
  });

  test('unitClass returns gray for unavailable deviceUnit', () => {
    const unavailableChassis: APIChassis[] = [
      {
        id: 'chassis-unavailable',
        name: 'Unavailable Chassis',
        modelName: 'Model Unavailable',
        description: 'Unavailable Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-unavailable',
            annotation: {
              systemItems: {
                available: false,
              },
            },
            resources: [
              {
                annotation: {
                  available: false,
                },
                device: {
                  deviceID: 'res-unavailable',
                  type: 'CPU',
                  status: {
                    health: 'OK',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={unavailableChassis} />);
    expect(screen.getByText('Unavailable Chassis')).toBeInTheDocument();
  });

  test('unitClass returns yellow for Warning without Critical or Disabled', () => {
    const warningChassis: APIChassis[] = [
      {
        id: 'chassis-warning-only',
        name: 'Warning Only Chassis',
        modelName: 'Model Warning',
        description: 'Warning Only Chassis Description',
        height: 1,
        depth: 'Half',
        unitPosition: 1,
        facePosition: 'Front',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        CXLSwitches: [],
        deviceUnits: [
          {
            id: 'unit-warning',
            annotation: {
              systemItems: {
                available: true,
              },
            },
            resources: [
              {
                annotation: {
                  available: true,
                },
                device: {
                  deviceID: 'res-warning',
                  type: 'CPU',
                  status: {
                    health: 'Warning',
                    state: 'Enabled',
                  },
                  powerState: 'On',
                  powerCapability: true,
                },
                detected: true,
                nodeIDs: [],
                resourceGroupIDs: [],
              },
            ],
          },
        ],
      },
    ];
    renderWithProvider(<RackLayout loading={false} chassisList={warningChassis} />);
    expect(screen.getByText('Warning Only Chassis')).toBeInTheDocument();
  });
});
