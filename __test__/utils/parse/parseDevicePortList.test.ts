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

import { parseDevicePortList } from '@/utils/parse/parseDevicePortList';
import { DevicePortList } from '@/shared-modules/types/APIresources';

describe('parseDevicePortList', () => {
  test('returns combined fabricID-switchID when both exist', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: 'switch1',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual(['fabric1-switch1']);
  });

  test('returns empty array when fabricID is undefined', () => {
    const devicePortList: DevicePortList = [
      {
        switchID: 'switch1',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns empty array when switchID is undefined', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns empty array when fabricID is empty string', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: '',
        switchID: 'switch1',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns empty array when switchID is empty string', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: '',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns empty array when both fabricID and switchID are empty strings', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: '',
        switchID: '',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns empty array when devicePortList is undefined', () => {
    const result = parseDevicePortList(undefined);

    expect(result).toEqual([]);
  });

  test('returns empty array when devicePortList is empty array', () => {
    const devicePortList: DevicePortList = [];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('returns multiple combined IDs when multiple valid ports exist', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: 'switch1',
      },
      {
        fabricID: 'fabric2',
        switchID: 'switch2',
      },
      {
        fabricID: 'fabric3',
        switchID: 'switch3',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual(['fabric1-switch1', 'fabric2-switch2', 'fabric3-switch3']);
  });

  test('filters out invalid ports and returns only valid combined IDs', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: 'switch1',
      },
      {
        fabricID: '',
        switchID: 'switch2',
      },
      {
        fabricID: 'fabric3',
        switchID: '',
      },
      {
        switchID: 'switch4',
      },
      {
        fabricID: 'fabric5',
      },
      {
        fabricID: 'fabric6',
        switchID: 'switch6',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual(['fabric1-switch1', 'fabric6-switch6']);
  });

  test('handles ports with only whitespace in fabricID', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: '   ',
        switchID: 'switch1',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('handles ports with only whitespace in switchID', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: '   ',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual([]);
  });

  test('handles ports with additional properties', () => {
    const devicePortList: DevicePortList = [
      {
        fabricID: 'fabric1',
        switchID: 'switch1',
        LTSSMState: 'L0',
        switchPortNumber: '1',
        switchPortType: 'USP',
      },
    ];

    const result = parseDevicePortList(devicePortList);

    expect(result).toEqual(['fabric1-switch1']);
  });
});
