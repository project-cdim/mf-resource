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

import { Tabs } from '@mantine/core';
import _ from 'lodash';

import { APIDeviceType } from '@/shared-modules/types';

/** Props for the TabList component */
export type TabListTab = APIDeviceType | 'summary' | 'all';

/** Represents the props for the TabList component. */
export type TabListProps = {
  /** {@link APIDeviceType} */
  tabs: TabListTab[];
};

/**
 * Component that displays tabs
 * @param props {@link TabListProps}
 * @returns JSX.Element that displays the tabs (<Tabs.Tab>)
 */
export const TabList = (props: TabListProps) => {
  const tabs = props.tabs.map((type, index) => (
    <Tabs.Tab value={type} key={index}>
      {_.upperFirst(type)}
    </Tabs.Tab>
  ));

  return <Tabs.List>{tabs}</Tabs.List>;
};
