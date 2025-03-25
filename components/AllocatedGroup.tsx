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

import { Grid, Title, useMatches } from '@mantine/core';

import { AllocatedViewAll, AllocatedViewAllProps } from '@/components';

/**
 * Props for the AllocatedGroup component
 */
export type AllocatedGroupProps = {
  /** Group title */
  title: string;
  /** {@link AllocatedViewAllProps}Array */
  items: AllocatedViewAllProps[];
};

/**
 * A component that displays groups of resource count information during node configuration
 * @param props {@link AllocatedGroupProps}
 * @returns Groups of numerical information JSX.Element
 */
export const AllocatedGroup = (props: AllocatedGroupProps) => {
  const span = useMatches({
    base: 3,
    md: 2,
  });
  const items = props.items?.map((item) => (
    <Grid.Col span={span} key={props.title + item.title}>
      <AllocatedViewAll key={props.title + item.title} {...item} />
    </Grid.Col>
  ));

  return (
    <>
      <Title order={2} fz='lg'>
        {props.title}
      </Title>
      <Grid>{items}</Grid>
    </>
  );
};
