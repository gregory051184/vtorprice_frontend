import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import Head from 'next/head';
import { ActiveApplicationsList } from '@box/widgets/applications/logistActiveApplicationList';

export const LogistActiveDeals:React.FC = () => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <Head>
      <title>Активные сделки</title>
    </Head>
    <SidebarLayout>
      <ActiveApplicationsList/>
    </SidebarLayout>
  </AppShell>
);
