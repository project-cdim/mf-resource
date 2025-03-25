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

import type { Meta, StoryObj } from '@storybook/react';

import { JsonTable } from '@/components';

const meta = {
  title: 'Components/JsonTable',
  component: JsonTable,
  parameters: {
    // layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // argTypes: {
  // },
} satisfies Meta<typeof JsonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const jsonDataObject = {
  deviceID1: 'deviceID1Value',
  type: 'CPU',
  attribute: {
    processorInfo: {
      xxxxx: 'xxxx',
    },
  },
  baseSpeedMHz: 4000,
  operatingSpeedMHz: 4000,
  tdpWatts: 200,
  totalCores: 4,
  totalEnabledCores: 4,
  totalThreads: 8,
  processorMemory: [
    {
      capacityMiB: 8192,
      integratedMemory: true,
      memoryType: 'DDR5',
      speedMHz: 2500,
    },
  ],
  memorySummary: {
    ECCModeEnabled: true,
    totalCacheSizeMiB: 4096,
    totalMemorySizeMiB: 8192,
  },
  constraint: {
    connectDevice: [
      {
        deviceID2: 'xxxxxx',
      },
    ],
    incompatibility: [
      {
        type: 'CPU',
        model: 'Modelxxx',
      },
    ],
  },
  status: {
    state: 'Enabled',
    health: 'OK',
  },
  powerState: 'On',
  powerCapability: true,
  cxlDeviceSwithInfo: 'xxxxxxxxxx',
  cxlDeviceSerialNumber: 'xxxxxxx',
  instructionSet: 'ARM-A64',
  processorArchitecture: 'ARM',
  processorId: {
    effectiveFamily: 'xxxxxxxx',
    effectiveModel: 'xxxxxxxx',
    identificationRegisters: 'xxxxxxxx',
    microcodeInfo: 'xxxxxxxx',
    protectedIdentificationNumber: 'xxxxxxxx',
    step: 'xxxxxxxx',
    vendorId: 'xxxxxxxx',
  },
  links: [
    {
      deviceType3: 'Accelerator',
      deviceID3: 'xxxxxxxxxx',
    },
    {
      deviceType4: 'graphicsController',
      deviceID4: 'xxxxxxxxxx',
    },
    {
      deviceType5: 'memory',
      deviceID5: 'xxxxxxxxxx',
    },
    {
      deviceType6: 'networkInterface',
      deviceID6: 'xxxxxxxxxx',
    },
    {
      deviceType7: 'storage',
      deviceID7: 'xxxxxxxxxx',
    },
  ],
  manufacturer: 'Intel(R) Corporation',
  model: 'Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz',
  cxlLTSSMState: 7,
  infoTimestamp: '2022-10-03T20:00:00Z',
};

/** When the root of the JSON is an object */
export const Standard_object: Story = {
  args: {
    json: jsonDataObject,
  },
};
/** When the root of the JSON is an array */
export const Standard_array: Story = {
  args: {
    json: jsonDataObject.links,
  },
};

/** When the JSON is an empty object */
export const Standard_EmptyObject: Story = {
  args: {
    json: {},
  },
};
/** When the JSON is an empty array */
export const Standard_EmptyArray: Story = {
  args: {
    json: [],
  },
};
