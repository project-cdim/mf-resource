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

// Mock the PageLink module
jest.mock('@/shared-modules/components/PageLink', () => ({
  PageLink: jest.fn(({ children, path, query }: { children: React.ReactNode; path?: string; query?: object }) => (
    <div data-testid='page-link' data-path={path} data-query={JSON.stringify(query)}>
      {children}
    </div>
  )),
}));

describe('AllocatedViewAll', () => {
  test('That the title and the number of resources are displayed', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test All',
      device: {
        type: 'all',
        allocated: 30,
        all: 120,
      },
      loading: false,
    };

    render(<AllocatedViewAll {...testProps} />);

    expect(screen.getByText('Test All')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('/ 120')).toBeInTheDocument();
  });

  test('If there is volume information, it is displayed', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test All with Volume',
      device: {
        type: 'all',
        allocated: 30,
        all: 120,
      },
      volume: {
        allocated: '190',
        all: '520',
        unit: 'cores',
      },
      loading: false,
    };

    render(<AllocatedViewAll {...testProps} />);

    expect(screen.getByText('Test All with Volume')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('/ 120')).toBeInTheDocument();
    expect(screen.getByText('(190 / 520 cores)')).toBeInTheDocument();
  });

  test('That the value of Progress is set to the specified value', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test Progress Node',
      device: {
        type: 'all',
        allocated: 50,
        all: 200,
      },
      loading: false,
    };

    render(<AllocatedViewAll {...testProps} />);
    // @ts-ignore
    const progressBarPercentage = (testProps.device.allocated / testProps.device.all) * 100;
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', progressBarPercentage.toString());
  });

  test('should pass correct props(all, none query) to PageLink', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test title',
      device: {
        type: 'all',
        allocated: 25,
        all: 100,
      },
      loading: false,
    };

    render(<AllocatedViewAll {...testProps} />);

    const pageLink = screen.getByTestId('page-link');
    expect(pageLink).toBeInTheDocument();
    expect(pageLink).toHaveAttribute('data-path', '/cdim/res-resource-list');
    expect(pageLink).toHaveAttribute('data-query', JSON.stringify({ allocatednode: ['Allocated'] }));
  });

  test('should pass correct props(device, with query) to PageLink', () => {
    const testProps: AllocatedViewAllProps = {
      title: 'Test title',
      device: {
        type: 'CPU',
        allocated: 25,
        all: 100,
      },
      loading: false,
    };

    render(<AllocatedViewAll {...testProps} />);

    const pageLink = screen.getByTestId('page-link');
    expect(pageLink).toBeInTheDocument();
    expect(pageLink).toHaveAttribute('data-path', '/cdim/res-resource-list');
    expect(pageLink).toHaveAttribute('data-query', JSON.stringify({ allocatednode: ['Allocated'], type: ['CPU'] }));
  });
});
