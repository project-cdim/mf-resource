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

'use client';

import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { PageHeader } from '@/shared-modules/components';
import { useQuery } from '@/shared-modules/utils/hooks';

/**
 * CXL Switch Detail Page
 *
 * @returns Page content
 */
const CxlSwitchDetail = () => {
  const t = useTranslations();
  const query = useQuery();
  const items = [
    { title: t('Resource Management') },
    { title: t('CXL Switches'), href: '/cdim/res-cxl-switch-list' },
    { title: `${t('CXL Switch Details')} <${query.id}>` },
  ];
  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('CXL Switch Details')} items={items} mutate={() => void {}} loading={false} />
      <p style={{ color: 'red', fontSize: '30px' }}>Under Construction</p>
    </Stack>
  );
};

export default CxlSwitchDetail;
