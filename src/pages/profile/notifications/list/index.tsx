import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { NotificationList } from '@box/widgets/notifications';

export const Notifications = () => (
  <AppShell 
    header={<Header />} 
    footer={<Footer />}
  >
    <SidebarLayout>
      <NotificationList />
    </SidebarLayout>
  </AppShell>
);
