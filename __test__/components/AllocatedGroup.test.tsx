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

import { AllocatedGroup, AllocatedGroupProps } from '@/components';

describe('AllocatedGroup Component', () => {
  test('That the title is displayed', () => {
    const testProps: AllocatedGroupProps = {
      title: 'Test Group',
      items: [],
    };

    render(<AllocatedGroup {...testProps} />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  test('That multiple items are displayed', () => {
    const testProps: AllocatedGroupProps = {
      title: 'Group with Items',
      items: [
        {
          title: 'Item 1',
          device: {
            type: 'networkInterface',
            allocated: 30,
            all: 120,
          },
          loading: false,
        },
        {
          title: 'Item 2',
          device: {
            type: 'CPU',
            allocated: 40,
            all: 140,
          },
          volume: {
            allocated: '190',
            all: '520',
            unit: 'cores',
          },
          loading: false,
        },
      ],
    };

    render(<AllocatedGroup {...testProps} />);

    expect(screen.getByText('Group with Items')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('/ 120')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('/ 140')).toBeInTheDocument();
    expect(screen.getByText('(190 / 520 cores)')).toBeInTheDocument();
  });
});
