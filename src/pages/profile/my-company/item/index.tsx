import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { CompanyManagement } from '@box/widgets/company-management';

export const ACompanyManagement = () => (
  <AppShell 
    header={<Header />} 
    footer={<Footer />}
  >
    <SidebarLayout>
        <CompanyManagement/>
    </SidebarLayout>
  </AppShell>
);