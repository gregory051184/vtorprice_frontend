import { SidebarLayout, AppShell } from '@box/layouts';
import { LogistContractorsList } from '@box/widgets/companies/contractorsList';
import { Footer } from '@box/widgets/footer';
import { Header } from '@box/widgets/header';

export const LogistContractors = () => (
  <AppShell 
    header={<Header />}  
    footer={<Footer />}
  >
    <SidebarLayout>
      <LogistContractorsList />
    </SidebarLayout>
      
  </AppShell>
);
