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

import { render } from '@/shared-modules/__test__/test-utils';
import { screen } from '@testing-library/react';
import { PowerStateToIcon, PowerOffToIconForNode } from '@/components/PowerStateToIcon';
import { APIDevicePowerState } from '@/shared-modules/types';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: any) => {
    const target = values?.target || 'Resource';
    const templates: Record<string, string> = {
      Resource: 'Resource',
      Node: 'Node',
      Chassis: 'Chassis',
      'Some resources are powered off': 'Some resources are powered off',
      'All resources are powered on': 'All resources are powered on',
    };

    if (templates[key]) return templates[key];
    if (key === '{target} is powered on') return `${target} is powered on`;
    if (key === '{target} is powered off') return `${target} is powered off`;
    if (key === '{target} is powering on') return `${target} is powering on`;
    if (key === '{target} is powering off') return `${target} is powering off`;
    if (key === '{target} power state is paused') return `${target} power state is paused`;
    if (key === '{target} power state is unknown') return `${target} power state is unknown`;
    return key;
  },
}));

// Mock IconWithInfo component
jest.mock('@/shared-modules/components', () => ({
  IconWithInfo: jest.fn(({ type, label }: { type: string; label: string }) => (
    <div data-testid='icon-with-info' data-type={type} data-label={label}>
      {label}
    </div>
  )),
}));

describe('PowerStateToIcon Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    test('returns null when powerState is undefined', () => {
      const { container } = render(<PowerStateToIcon powerState={undefined} />);
      const icon = container.querySelector('[data-testid="icon-with-info"]');
      expect(icon).not.toBeInTheDocument();
    });

    test('returns null when powerState is empty string', () => {
      const { container } = render(<PowerStateToIcon powerState={'' as any} />);
      const icon = container.querySelector('[data-testid="icon-with-info"]');
      expect(icon).not.toBeInTheDocument();
    });

    test('returns null when powerState is null', () => {
      const { container } = render(<PowerStateToIcon powerState={null as any} />);
      const icon = container.querySelector('[data-testid="icon-with-info"]');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Power state variations', () => {
    test('renders correct icon and label for "On" state', () => {
      render(<PowerStateToIcon powerState='On' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'check');
      expect(icon).toHaveAttribute('data-label', 'Resource is powered on');
    });

    test('renders correct icon and label for "Off" state', () => {
      render(<PowerStateToIcon powerState='Off' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'disabled');
      expect(icon).toHaveAttribute('data-label', 'Resource is powered off');
    });

    test('renders correct icon and label for "PoweringOn" state', () => {
      render(<PowerStateToIcon powerState='PoweringOn' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'in_progress');
      expect(icon).toHaveAttribute('data-label', 'Resource is powering on');
    });

    test('renders correct icon and label for "PoweringOff" state', () => {
      render(<PowerStateToIcon powerState='PoweringOff' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'canceling');
      expect(icon).toHaveAttribute('data-label', 'Resource is powering off');
    });

    test('renders correct icon and label for "Paused" state', () => {
      render(<PowerStateToIcon powerState='Paused' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'suspended');
      expect(icon).toHaveAttribute('data-label', 'Resource power state is paused');
    });

    test('renders correct icon and label for "Unknown" state', () => {
      render(<PowerStateToIcon powerState='Unknown' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'info');
      expect(icon).toHaveAttribute('data-label', 'Resource power state is unknown');
    });

    test('renders Unknown icon and label for unrecognized state (default case)', () => {
      render(<PowerStateToIcon powerState={'InvalidState' as any} />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'info');
      expect(icon).toHaveAttribute('data-label', 'Resource power state is unknown');
    });
  });

  describe('Target parameter variations', () => {
    test('uses default "Resource" target when not specified', () => {
      render(<PowerStateToIcon powerState='On' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-label', 'Resource is powered on');
    });

    test('uses "Node" target when specified', () => {
      render(<PowerStateToIcon powerState='On' target='Node' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-label', 'Node is powered on');
    });

    test('uses "Chassis" target when specified', () => {
      render(<PowerStateToIcon powerState='Off' target='Chassis' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-label', 'Chassis is powered off');
    });

    test('uses custom target for all power states', () => {
      const customTarget = 'CustomDevice';

      // Test with different power states to ensure target is used consistently
      render(<PowerStateToIcon powerState='PoweringOn' target={customTarget} />);
      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-label', 'CustomDevice is powering on');
    });
  });

  describe('All power states with different targets', () => {
    test('renders all power states correctly with Node target', () => {
      const powerStates = ['On', 'Off', 'PoweringOn', 'PoweringOff', 'Paused', 'Unknown'] as APIDevicePowerState[];
      const expectedTypes = ['check', 'disabled', 'in_progress', 'canceling', 'suspended', 'info'];

      powerStates.forEach((state, index) => {
        const { unmount } = render(<PowerStateToIcon powerState={state} target='Node' />);

        const icon = screen.getByTestId('icon-with-info');
        expect(icon).toHaveAttribute('data-type', expectedTypes[index]);
        expect(icon.getAttribute('data-label')).toContain('Node');

        unmount();
      });
    });
  });

  describe('Edge cases and boundary conditions', () => {
    test('handles empty string as target', () => {
      render(<PowerStateToIcon powerState='On' target='' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      // Empty string as target falls back to default 'Resource'
      expect(icon).toHaveAttribute('data-label', 'Resource is powered on');
    });

    test('handles special characters in target', () => {
      render(<PowerStateToIcon powerState='On' target='Special-Device_123' />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-label', 'Special-Device_123 is powered on');
    });

    test('handles case sensitivity in power state', () => {
      // Test lowercase (should hit default case)
      render(<PowerStateToIcon powerState={'on' as any} />);

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-type', 'info');
      expect(icon).toHaveAttribute('data-label', 'Resource power state is unknown');
    });
  });
});

describe('PowerOffToIconForNode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    test('renders disabled icon when poweroff_number is greater than 0', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={1} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'disabled');
      expect(icon).toHaveAttribute('data-label', 'Some resources are powered off');
    });

    test('renders check icon when poweroff_number is 0', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={0} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'check');
      expect(icon).toHaveAttribute('data-label', 'All resources are powered on');
    });

    test('renders disabled icon when poweroff_number is negative (boundary case)', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={-1} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'check');
      expect(icon).toHaveAttribute('data-label', 'All resources are powered on');
    });
  });

  describe('Boundary values', () => {
    test('handles large positive numbers', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={999} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-type', 'disabled');
      expect(icon).toHaveAttribute('data-label', 'Some resources are powered off');
    });

    test('handles decimal numbers (should still work with > 0 logic)', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={0.1} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-type', 'disabled');
      expect(icon).toHaveAttribute('data-label', 'Some resources are powered off');
    });

    test('handles exactly 1', () => {
      render(
        <div>
          <PowerOffToIconForNode poweroffNumber={1} />
        </div>
      );

      const icon = screen.getByTestId('icon-with-info');
      expect(icon).toHaveAttribute('data-type', 'disabled');
      expect(icon).toHaveAttribute('data-label', 'Some resources are powered off');
    });
  });

  describe('Component integration', () => {
    test('both functions can be used together', () => {
      render(
        <div>
          <div data-testid='power-state'>
            <PowerStateToIcon powerState='On' target='Node' />
          </div>
          <div data-testid='power-off'>
            <PowerOffToIconForNode poweroffNumber={2} />
          </div>
        </div>
      );

      const powerStateIcon = screen.getByTestId('power-state').querySelector('[data-testid="icon-with-info"]');
      const powerOffIcon = screen.getByTestId('power-off').querySelector('[data-testid="icon-with-info"]');

      expect(powerStateIcon).toHaveAttribute('data-type', 'check');
      expect(powerStateIcon).toHaveAttribute('data-label', 'Node is powered on');

      expect(powerOffIcon).toHaveAttribute('data-type', 'disabled');
      expect(powerOffIcon).toHaveAttribute('data-label', 'Some resources are powered off');
    });
  });
});
