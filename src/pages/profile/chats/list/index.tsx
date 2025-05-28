import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { ChatsWidget } from '@box/widgets/chats';
import Head from 'next/head';

export const Chats = () => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <Head>
      <title>Список чатов</title>
    </Head>
    <SidebarLayout>
      <ChatsWidget />
    </SidebarLayout>
  </AppShell>
);
