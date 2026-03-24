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

import { parsePlacement } from '@/utils/parse';
import { dummyAPIresource } from '@/utils/dummy-data/resource-detail/dummyAPIresource';
import { APIresource } from '@/shared-modules/types';

describe('parsePlacement', () => {
  test('returns undefined when placement is undefined', () => {
    // Verify undefined input returns undefined
    expect(parsePlacement(undefined)).toBeUndefined();
  });

  test('returns undefined when placement is empty object', () => {
    // Verify empty object returns undefined
    const placement: APIresource['physicalLocation'] = {};
    expect(parsePlacement(placement)).toBeUndefined();
  });

  test('returns formatted string when both rack.name and chassis.name exist', () => {
    // Verify normal case with both names present
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        name: 'RackName',
        chassis: { id: 'chassis-id', name: 'ChassisName' },
      },
    };
    expect(parsePlacement(placement)).toBe('RackName/ChassisName');
  });

  test('uses rack.id when rack.name does not exist', () => {
    // Verify fallback to rack.id when rack.name is not provided
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        chassis: { id: 'chassis-id', name: 'ChassisName' },
      },
    };
    expect(parsePlacement(placement)).toBe('rack-id/ChassisName');
  });

  test('uses chassis.id when chassis.name does not exist', () => {
    // Verify fallback to chassis.id when chassis.name is not provided
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        name: 'RackName',
        chassis: { id: 'chassis-id' },
      },
    };
    expect(parsePlacement(placement)).toBe('RackName/chassis-id');
  });

  test('uses both rack.id and chassis.id when both names do not exist', () => {
    // Verify fallback to both IDs when both names are not provided
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        chassis: { id: 'chassis-id' },
      },
    };
    expect(parsePlacement(placement)).toBe('rack-id/chassis-id');
  });

  test('uses rack.id when rack.name is empty string', () => {
    // Verify empty string is treated as falsy and falls back to rack.id
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        name: '',
        chassis: { id: 'chassis-id', name: 'ChassisName' },
      },
    };
    expect(parsePlacement(placement)).toBe('rack-id/ChassisName');
  });

  test('uses chassis.id when chassis.name is empty string', () => {
    // Verify empty string is treated as falsy and falls back to chassis.id
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        name: 'RackName',
        chassis: { id: 'chassis-id', name: '' },
      },
    };
    expect(parsePlacement(placement)).toBe('RackName/chassis-id');
  });

  test('uses both IDs when both names are empty strings', () => {
    // Verify both empty strings fall back to IDs
    const placement: APIresource['physicalLocation'] = {
      rack: {
        id: 'rack-id',
        name: '',
        chassis: { id: 'chassis-id', name: '' },
      },
    };
    expect(parsePlacement(placement)).toBe('rack-id/chassis-id');
  });

  test('undefined placement', () => {
    expect(parsePlacement(undefined)).toBe(undefined);
  });

  test('works with actual dummy data', () => {
    // Verify function works correctly with project dummy data
    expect(parsePlacement(dummyAPIresource.physicalLocation)).toBe('rack001/Jupiter XXXXXXXX');
  });
});
