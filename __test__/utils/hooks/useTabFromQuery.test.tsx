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
import { useTabFromQuery } from '@/utils/hooks/useTabFromQuery';
import * as useQueryModule from '@/shared-modules/utils/hooks/useQuery';

// Mock useQuery
jest.mock('@/shared-modules/utils/hooks/useQuery');

describe('useTabFromQuery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the tab string if tab is a string', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: 'overview' });
    let result: string | undefined;
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBe('overview');
  });

  test('should return the first element if tab is an array', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: ['details', 'other'] });
    let result: string | undefined;
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBe('details');
  });

  test('should return undefined if tab is undefined', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({});
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBeUndefined();
  });

  test('should return undefined if tab is null', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: null });
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBeUndefined();
  });

  test('should return undefined if tab is false', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: false });
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBeUndefined();
  });

  test('should return undefined if tab is 0', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: 0 });
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBeUndefined();
  });

  test('should return empty string if tab is empty string', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: '' });
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBe('');
  });

  test('should return undefined if tab is an empty array', () => {
    (useQueryModule.useQuery as jest.Mock).mockReturnValue({ tab: [] });
    let result: string | undefined = 'not-undefined';
    function TestComponent() {
      result = useTabFromQuery();
      return null;
    }
    render(<TestComponent />);
    expect(result).toBeUndefined();
  });
});
