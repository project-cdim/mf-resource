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

import { AllocatedViewAll, AllocatedViewAllProps } from '@/components';

describe('AllocatedViewAll', () => {
  test('That the title and the number of resources are displayed', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test All',
      device: {
        allocated: 30,
        all: 120,
      },
    };

    render(<AllocatedViewAll {...testProps} />);

    expect(screen.getByText('Test All')).toBeInTheDocument();
    expect(screen.getByText('30 / 120')).toBeInTheDocument();
  });

  test('If there is volume information, it is displayed', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test All with Volume',
      device: {
        allocated: 30,
        all: 120,
      },
      volume: {
        allocated: '190',
        all: '520',
        unit: 'cores',
      },
    };

    render(<AllocatedViewAll {...testProps} />);

    expect(screen.getByText('Test All with Volume')).toBeInTheDocument();
    expect(screen.getByText('30 / 120')).toBeInTheDocument();
    expect(screen.getByText('(190 / 520 cores)')).toBeInTheDocument();
  });

  test('That the value of Progress is set to the specified value', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test Progress Node',
      device: {
        allocated: 50,
        all: 200,
      },
    };

    render(<AllocatedViewAll {...testProps} />);
    // @ts-ignore
    const progressBarPercentage = (testProps.device.allocated / testProps.device.all) * 100;
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', progressBarPercentage.toString());
  });
});
