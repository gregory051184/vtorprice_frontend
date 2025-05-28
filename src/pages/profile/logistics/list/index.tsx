import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import Head from 'next/head';
import { TransportApplicationsList } from '@box/widgets/applications/applicationsTransportList';
import { ILogistics } from './types';

export const Logistics:React.FC<ILogistics> = ({ itemLink }) => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <Head>
      <title>Заявка на транспорт</title>
    </Head>
    <SidebarLayout>
      <TransportApplicationsList itemLink={itemLink} />
    </SidebarLayout>
  </AppShell>
);
