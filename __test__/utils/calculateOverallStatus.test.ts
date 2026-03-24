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

import { calculateOverallStatus } from '@/utils/calculateOverallStatus';
import { APIDeviceHealth, APIDeviceState } from '@/shared-modules/types';

describe('calculateOverallStatus', () => {
  describe('when health is Critical', () => {
    test('returns Critical regardless of state', () => {
      const states: APIDeviceState[] = [
        'Enabled',
        'Disabled',
        'StandbyOffline',
        'StandbySpare',
        'InTest',
        'Starting',
        'Absent',
        'UnavailableOffline',
        'Deferring',
        'Quiesced',
        'Updating',
        'Qualified',
        'Degraded',
      ];

      states.forEach((state) => {
        expect(calculateOverallStatus('Critical', state)).toBe('Critical');
      });
    });
  });

  describe('when health is OK', () => {
    test('returns OK when state is Enabled', () => {
      expect(calculateOverallStatus('OK', 'Enabled')).toBe('OK');
    });

    test('returns Critical when state is Disabled', () => {
      expect(calculateOverallStatus('OK', 'Disabled')).toBe('Critical');
    });

    test('returns Critical when state is Absent', () => {
      expect(calculateOverallStatus('OK', 'Absent')).toBe('Critical');
    });

    test('returns Critical when state is UnavailableOffline', () => {
      expect(calculateOverallStatus('OK', 'UnavailableOffline')).toBe('Critical');
    });

    test('returns Critical when state is Degraded', () => {
      expect(calculateOverallStatus('OK', 'Degraded')).toBe('Critical');
    });

    test('returns Warning when state is StandbyOffline', () => {
      expect(calculateOverallStatus('OK', 'StandbyOffline')).toBe('Warning');
    });

    test('returns Warning when state is StandbySpare', () => {
      expect(calculateOverallStatus('OK', 'StandbySpare')).toBe('Warning');
    });

    test('returns Warning when state is InTest', () => {
      expect(calculateOverallStatus('OK', 'InTest')).toBe('Warning');
    });

    test('returns Warning when state is Starting', () => {
      expect(calculateOverallStatus('OK', 'Starting')).toBe('Warning');
    });

    test('returns Warning when state is Deferring', () => {
      expect(calculateOverallStatus('OK', 'Deferring')).toBe('Warning');
    });

    test('returns Warning when state is Quiesced', () => {
      expect(calculateOverallStatus('OK', 'Quiesced')).toBe('Warning');
    });

    test('returns Warning when state is Updating', () => {
      expect(calculateOverallStatus('OK', 'Updating')).toBe('Warning');
    });

    test('returns Warning when state is Qualified (default case)', () => {
      expect(calculateOverallStatus('OK', 'Qualified')).toBe('Warning');
    });
  });

  describe('when health is Warning', () => {
    test('returns Warning when state is Enabled', () => {
      expect(calculateOverallStatus('Warning', 'Enabled')).toBe('Warning');
    });

    test('returns Critical when state is Disabled', () => {
      expect(calculateOverallStatus('Warning', 'Disabled')).toBe('Critical');
    });

    test('returns Critical when state is Absent', () => {
      expect(calculateOverallStatus('Warning', 'Absent')).toBe('Critical');
    });

    test('returns Critical when state is UnavailableOffline', () => {
      expect(calculateOverallStatus('Warning', 'UnavailableOffline')).toBe('Critical');
    });

    test('returns Critical when state is Degraded', () => {
      expect(calculateOverallStatus('Warning', 'Degraded')).toBe('Critical');
    });

    test('returns Warning when state is StandbyOffline', () => {
      expect(calculateOverallStatus('Warning', 'StandbyOffline')).toBe('Warning');
    });

    test('returns Warning when state is StandbySpare', () => {
      expect(calculateOverallStatus('Warning', 'StandbySpare')).toBe('Warning');
    });

    test('returns Warning when state is InTest', () => {
      expect(calculateOverallStatus('Warning', 'InTest')).toBe('Warning');
    });

    test('returns Warning when state is Starting', () => {
      expect(calculateOverallStatus('Warning', 'Starting')).toBe('Warning');
    });

    test('returns Warning when state is Deferring', () => {
      expect(calculateOverallStatus('Warning', 'Deferring')).toBe('Warning');
    });

    test('returns Warning when state is Quiesced', () => {
      expect(calculateOverallStatus('Warning', 'Quiesced')).toBe('Warning');
    });

    test('returns Warning when state is Updating', () => {
      expect(calculateOverallStatus('Warning', 'Updating')).toBe('Warning');
    });

    test('returns Warning when state is Qualified (default case)', () => {
      expect(calculateOverallStatus('Warning', 'Qualified')).toBe('Warning');
    });
  });

  describe('edge cases', () => {
    test('returns Critical for unknown health value (default fallback)', () => {
      // Cast to bypass TypeScript type checking to test default fallback
      const unknownHealth = 'Unknown' as APIDeviceHealth;
      expect(calculateOverallStatus(unknownHealth, 'Enabled')).toBe('Critical');
    });
  });
});
