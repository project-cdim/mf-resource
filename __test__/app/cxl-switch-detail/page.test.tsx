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

import { render } from '@/shared-modules/__test__/test-utils';
import { PageHeader } from '@/shared-modules/components';

import CxlSwitchDetail from '@/app/[lng]/cxl-switch-detail/page';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn().mockReturnValue({ id: 'cxl01' }),
  useMSW: jest.fn(),
  useLoading: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));

describe('CXL Switch Detail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });

  test('The PageHeader is correctly receiving the title and breadcrumb list', () => {
    render(<CxlSwitchDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    givenProps.mutate();
    expect(givenProps.pageTitle).toBe('CXL Switch Details');
    expect(givenProps.items).toEqual([
      { title: 'Resource Management' },
      { title: 'CXL Switches', href: '/cdim/res-cxl-switch-list' },
      { title: `CXL Switch Details <cxl01>` },
    ]);
  });
});
