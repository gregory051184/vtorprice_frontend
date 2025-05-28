import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { ManagerMyCompaniesList } from '@box/widgets/companies/companiesMyList';

export const MyCompany = () => (
  <AppShell 
    header={<Header />} 
    footer={<Footer />}
  >
    <SidebarLayout>
      <ManagerMyCompaniesList />
    </SidebarLayout>
  </AppShell>
);
