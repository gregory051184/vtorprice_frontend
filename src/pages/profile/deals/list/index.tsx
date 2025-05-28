import { SidebarLayout, AppShell } from '@box/layouts';
import { Footer } from '@box/widgets/footer';
import { Header } from '@box/widgets/header';
import { UsersDealsList } from '@box/widgets/deal';

export const UsersDeals = () => (
  <AppShell 
    header={<Header />}  
    footer={<Footer />}
  >
    <SidebarLayout>
      <UsersDealsList />
    </SidebarLayout>
      
  </AppShell>
);
