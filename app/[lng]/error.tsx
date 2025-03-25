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

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { MessageBox } from '@/shared-modules/components';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px 0',
      }}
    >
      <MessageBox
        type='error'
        title={t('A runtime error has occurred')}
        message={
          <>
            <div>{t('Click the reload button')}</div>
            <div>{t('If the problem persists, please contact your administrator')}</div>
          </>
        }
      />
      <Button type='button' onClick={() => reset()}>
        {t('Reload')}
      </Button>
    </div>
  );
}
