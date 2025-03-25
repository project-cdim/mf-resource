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

import { Card, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { PageLink } from '@/shared-modules/components';
import { ResourceListQuery } from '@/shared-modules/types';

/**
 * Props for the NumberView component.
 */
export type NumberViewProps = {
  /** The title of the number view. */
  title: string;
  /** The number to be displayed. */
  number: number | undefined;
  /** The link associated with the number view. */
  link: string;
  /** An optional query for the resource list. */
  query?: ResourceListQuery;
  /** Link title */
  linkTitle?: string;
};

/**
 * Component to display number information
 * @param props {@link NumberViewProps}
 * @returns Number information JSX.Element
 */
export const NumberView = (props: NumberViewProps) => {
  const t = useTranslations();
  return (
    <PageLink
      title={props.linkTitle || t('View details')}
      path={props.link}
      query={props.query}
      color='rgb(55 65 81 / var(--tw-text-opacity))'
    >
      <Card withBorder>
        <Title order={2} size='h4' fw={500}>
          {props.title}
        </Title>
        {props.number !== undefined ? (
          <Text fz='1.875rem' fw={600} pb={24}>
            {props.number}
          </Text>
        ) : (
          <Text fz='1.875rem' fw={600} pb={24} style={{ visibility: 'hidden' }}>
            {/* Placeholder to keep spacing consistent */}
            &nbsp;
          </Text>
        )}
      </Card>
    </PageLink>
  );
};
