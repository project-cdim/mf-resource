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

import { NumberGroup, NumberViewProps } from '@/components';

const meta = {
  title: 'Components/NumberGroup',
  component: NumberGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // argTypes: {
  // },
} satisfies Meta<typeof NumberGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const NumberViewDummy: NumberViewProps = {
  title: 'Excluded',
  number: 10,
  link: './resource-list',
  query: { health: ['Warning'], type: ['Accelerator'] },
};

export const Standard: Story = {
  args: {
    title: 'Title',
    items: [NumberViewDummy],
  },
};

/** Columns are fixed to 4 */
export const ManyItems: Story = {
  args: {
    title: 'Title',
    items: [NumberViewDummy, NumberViewDummy, NumberViewDummy, NumberViewDummy, NumberViewDummy, NumberViewDummy],
  },
};

/** No items */
export const NoItem: Story = {
  args: {
    title: 'Title',
    items: [],
  },
};
