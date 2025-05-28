import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { UsersFavoritesList } from '@box/widgets/favorites/userssFavoritesList';

export const UsersFavorites = () => (
  <AppShell 
    header={<Header />} 
    footer={<Footer />}
  >
    <SidebarLayout>
      <UsersFavoritesList />
    </SidebarLayout>
  </AppShell>
);
