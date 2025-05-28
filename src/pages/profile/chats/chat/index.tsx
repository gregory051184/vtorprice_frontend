import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { ChatWidget } from '@box/widgets/chats';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const Chat = () => {
  const router = useRouter();
  const chatId = parseInt(router.query.id as string, 10);
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>Чат с пользователем</title>
      </Head>
      <SidebarLayout>
        <ChatWidget chatId={chatId} />
      </SidebarLayout>
    </AppShell>
  );
};
