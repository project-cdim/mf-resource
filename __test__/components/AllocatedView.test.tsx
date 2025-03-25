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

import { AllocatedView, AllocatedViewProps } from '@/components';

describe('AllocatedView', () => {
  test('should display title and resource count', () => {
    const testProps: AllocatedViewProps = {
      title: 'Test title',
      item: {
        device: {
          allocated: 25,
          all: 100,
        },
      },
    };

    render(<AllocatedView {...testProps} />);

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('25 / 100 Devices')).toBeInTheDocument();
  });

  test('should display volume information if available', () => {
    const testProps: AllocatedViewProps = {
      title: 'Test with Volume',
      item: {
        device: {
          allocated: 25,
          all: 100,
        },
        volume: {
          allocated: '180',
          all: '500',
          unit: 'cores',
        },
      },
    };

    render(<AllocatedView {...testProps} />);

    expect(screen.getByText('Test with Volume')).toBeInTheDocument();
    expect(screen.getByText('25 / 100 Devices')).toBeInTheDocument();
    expect(screen.getByText('(180 / 500 cores)')).toBeInTheDocument();
  });

  test('should not display volume information if not available', () => {
    const testProps: AllocatedViewProps = {
      title: 'Test with Volume',
      item: undefined,
    };

    render(<AllocatedView {...testProps} />);

    expect(screen.getByText('Test with Volume')).toBeInTheDocument();
    // The following will not be displayed
    expect(screen.queryByText('25 / 100 Devices')).not.toBeInTheDocument();
    expect(screen.queryByText('(180 / 500 cores)')).not.toBeInTheDocument();
  });
});
