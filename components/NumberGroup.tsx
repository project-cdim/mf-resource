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

import { NumberView, NumberViewProps } from '@/components';

/**
 * Props for the NumberGroup component
 */
export type NumberGroupProps = {
  /** Group title */
  title: string;
  /** Array of NumberViewProps */
  items: NumberViewProps[];
};

/**
 * Component that displays a group of numerical information
 * @param props NumberGroupProps
 * @returns JSX.Element for the group of numerical information
 */
export const NumberGroup = (props: NumberGroupProps) => {
  const span = useMatches({
    base: 3,
    md: 2,
  });
  const items = props.items?.map((item) => (
    <Grid.Col span={span} key={props.title + item.title}>
      <NumberView
        key={props.title + item.title}
        title={item.title}
        number={item.number}
        link={item.link}
        linkTitle={item.linkTitle}
        query={item.query}
      />
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
