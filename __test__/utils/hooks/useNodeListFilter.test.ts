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

import { renderHook } from '@testing-library/react';

import { useQueryArrayObject } from '@/shared-modules/utils/hooks';
import { dummyAPPNode } from '@/utils/dummy-data/node-list/dummyAPPNode';
import { useNodeListFilter } from '@/utils/hooks/useNodeListFilter';
import { mockQuery } from '@/shared-modules/__test__/test-utils';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQueryArrayObject: jest.fn(),
}));

describe('useNodeListFilter', () => {
  beforeEach(() => {
    // @ts-ignore
    useQueryArrayObject.mockReset();
  });

  test('When connectedQuery only contains notExist, only nodes with 0 connected are returned', () => {
    mockQuery('connected', ['notExist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.connected === 0)).toBe(true);
  });

  test('When connectedQuery only contains exist, only nodes with 1 or more connected are returned', () => {
    mockQuery('connected', ['exist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.connected > 0)).toBe(true);
  });

  test('When disabledQuery only contains notExist, only nodes with 0 disabled are returned', () => {
    mockQuery('disabled', ['notExist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.disabled === 0)).toBe(true);
  });

  test('When warningQuery only contains exist, only nodes with 1 or more warning are returned', () => {
    mockQuery('warning', ['exist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.warning > 0)).toBe(true);
  });

  test('When criticalQuery only contains notExist, only nodes with 0 critical are returned', () => {
    mockQuery('critical', ['notExist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.critical === 0)).toBe(true);
  });

  test('When unavailableQuery only contains exist, only nodes with 1 or more unavailable are returned', () => {
    mockQuery('unavailable', ['exist']);
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    const filteredRecords = result.current.filteredRecords;
    expect(filteredRecords.every((node) => node.device.resourceUnavailable > 0)).toBe(true);
  });

  test('When all queries are empty, all nodes are returned', () => {
    (useQueryArrayObject as jest.Mock).mockReturnValue(
      new Proxy({} as Record<string, string[]>, {
        get: () => [],
      })
    );
    const { result } = renderHook(() => useNodeListFilter(dummyAPPNode));
    expect(result.current.filteredRecords.length).toBe(dummyAPPNode.length);
  });
});
