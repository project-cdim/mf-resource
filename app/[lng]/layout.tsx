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

import React from 'react';

import { Metadata, Viewport } from 'next';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { Layout } from '@/shared-modules/components';

import '@/styles/globals.css';

export const viewport: Viewport = {
  initialScale: 1,
  minimumScale: 1,
  width: 'device-width',
};

export const metadata: Metadata = {
  title: 'Resource Management',
};

type Params = Promise<{ lng: string }>;

/**
 * Root layout component.
 *
 * @param children - The content to be rendered inside the layout.
 * @returns The rendered layout component.
 */

const RootLayout = async ({ children, params }: { children: React.ReactNode; params: Params }) => {
  const lng = (await params).lng;

  if (!routing.locales.includes(lng as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={lng} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='auto' />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider defaultColorScheme='auto'>
            <Layout>{children}</Layout>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
