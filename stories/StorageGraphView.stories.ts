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

import { StorageGraphView } from '@/components';

const meta = {
  title: 'Components/StorageGraphView',
  component: StorageGraphView,
  parameters: {
    // layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof StorageGraphView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 10 * 1024 ** 4,
      /** Allocated capacity per node */
      allocated: 50 * 1024 ** 4,
      /** Overall capacity */
      overall: 100 * 1024 ** 4,
    },
  },
};
export const AllZero: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 0,
      /** Allocated capacity per node */
      allocated: 0,
      /** Overall capacity */
      overall: 0,
    },
  },
};
export const UsedZero = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 0,
      /** Allocated capacity per node */
      allocated: 50 * 1024 ** 4,
      /** Overall capacity */
      overall: 100 * 1024 ** 4,
    },
  },
};
export const AllocatedZero: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 10 * 1024 ** 4,
      /** Allocated capacity per node */
      allocated: 0,
      /** Overall capacity */
      overall: 100 * 1024 ** 4,
    },
  },
};
export const OverallZero: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 10 * 1024 ** 4,
      /** Allocated capacity per node */
      allocated: 50 * 1024 ** 4,
      /** Overall capacity */
      overall: 0,
    },
  },
};
export const AllUndefined: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: undefined,
      /** Allocated capacity per node */
      allocated: undefined,
      /** Overall capacity */
      overall: undefined,
    },
  },
};
export const UsedUndefined: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: undefined,
      /** Allocated capacity per node */
      allocated: 50 * 1024 ** 4,
      /** Overall capacity */
      overall: 100 * 1024 ** 4,
    },
  },
};
export const AllocatedUndefined: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 10 * 1024 ** 4,
      /** Allocated capacity per node */
      allocated: undefined,
      /** Overall capacity */
      overall: 100 * 1024 ** 4,
    },
  },
};
export const OverallUndefined: Story = {
  args: {
    /** Title */
    title: 'Title 1',
    data: {
      /** Used capacity */
      used: 10 * 1024 ** 4,
      /** Allocated capacity per node */
      allocated: 50 * 1024 ** 4,
      /** Overall capacity */
      overall: undefined,
    },
  },
};
