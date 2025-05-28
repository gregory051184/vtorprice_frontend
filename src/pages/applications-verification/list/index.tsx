import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import React from 'react';
import { ApplicationsVerificationsList } from '@box/widgets/applications';
import { ApplicationsVerificationsListFilters } from '@box/features/application';

export const ApplicationVerifications = () => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <SidebarLayout>
      <ApplicationsVerificationsListFilters />
      <ApplicationsVerificationsList />
    </SidebarLayout>
  </AppShell>
);
