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
import { StatusToIcon } from '@/components/StatusToIcon';

const mockIconWithInfo = jest.fn();

jest.mock('@/shared-modules/components', () => ({
  IconWithInfo: (props: any) => mockIconWithInfo(props),
}));

describe('StatusToIcon', () => {
  beforeEach(() => {
    mockIconWithInfo.mockClear();
    mockIconWithInfo.mockReturnValue(<div data-testid={`icon-mock`}>mock</div>);
  });

  describe('when status is OK', () => {
    test('renders check icon with proper label', () => {
      render(<StatusToIcon status='OK' />);
      expect(mockIconWithInfo).toHaveBeenCalledWith({ type: 'check', label: 'This resource is working properly' });
    });
  });

  describe('when status is Warning', () => {
    test('renders warning icon with proper label', () => {
      render(<StatusToIcon status='Warning' />);
      expect(mockIconWithInfo).toHaveBeenCalledWith({ type: 'warning', label: 'A condition requires attention' });
    });
  });

  describe('when status is Critical', () => {
    test('renders critical icon with proper label', () => {
      render(<StatusToIcon status='Critical' />);
      expect(mockIconWithInfo).toHaveBeenCalledWith({
        type: 'critical',
        label: 'A critical condition exists that requires immediate attention',
      });
    });
  });

  describe('when status is undefined', () => {
    test('returns null', () => {
      const { container } = render(<StatusToIcon status={undefined} />);
      expect(mockIconWithInfo).not.toHaveBeenCalled();
      expect(container.querySelector('[data-testid="icon-mock"]')).not.toBeInTheDocument();
    });
  });

  describe('when status is invalid', () => {
    test('returns null for default case', () => {
      const { container } = render(<StatusToIcon status={'Invalid' as any} />);
      expect(mockIconWithInfo).not.toHaveBeenCalled();
      expect(container.querySelector('[data-testid="icon-mock"]')).not.toBeInTheDocument();
    });
  });
});
