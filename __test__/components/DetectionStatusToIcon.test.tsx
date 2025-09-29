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
import { IconWithInfo } from '@/shared-modules/components';

import { DetectionStatusToIcon } from '@/components';

// Mock necessary components
jest.mock('@/shared-modules/components', () => ({
  IconWithInfo: jest.fn(),
}));

describe('DetectionStatusToIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Returns IconWithInfo with "check" type and "Resource is responding" label when detected is true', () => {
    render(DetectionStatusToIcon(true));

    expect(IconWithInfo).toHaveBeenCalledTimes(1);
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('check');
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].label).toBe('Resource is responding');
  });

  test('Returns IconWithInfo with "critical" type and "Resource is not responding" label when detected is false', () => {
    render(DetectionStatusToIcon(false));

    expect(IconWithInfo).toHaveBeenCalledTimes(1);
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('critical');
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].label).toBe('Resource is not responding');
  });

  test('Returns null when detected is undefined', () => {
    render(DetectionStatusToIcon(undefined));

    expect(IconWithInfo).not.toHaveBeenCalled();
  });

  test('Boundary test: Returns correct icon types for true and false', () => {
    // boolean true
    render(DetectionStatusToIcon(true));
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('check');

    jest.clearAllMocks();

    // true as 1 (truthy)
    render(DetectionStatusToIcon(true as boolean));
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('check');

    jest.clearAllMocks();

    // boolean false
    render(DetectionStatusToIcon(false));
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('critical');

    jest.clearAllMocks();

    // false as 0 (falsy)
    render(DetectionStatusToIcon(false as boolean));
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('critical');
  });
});
