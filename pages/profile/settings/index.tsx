import React from 'react';
import { allSettled } from 'effector';
import { useStoreMap } from 'effector-react';
import { type NextPage } from 'next';
import Head from 'next/head';

import { AppShell, SidebarLayout } from '@box/layouts';
import { Footer } from '@box/widgets/footer';
import { Header } from '@box/widgets/header';
import { CompanyOwnerSettings } from '@box/widgets/settings/companyOwnerSettings';
import { withServerSideAuth } from '@box/providers';
import { $authStore, getMeSsrFx } from '@box/entities/auth';
import { ROLE } from '@box/types';
import { LogistSettings } from '@box/widgets/settings/logistSettings';
import { ManagerSettings } from '@box/widgets/settings/managerSettings';
import {NoSubscribeNoStaffAlert} from "@box/entities/noSubscribeNoStaffAlert/ui";


const Index: NextPage = () => {
  const user = useStoreMap({
    store: $authStore,
    keys: ['user'],
    fn: (val) => val.user
  });

  let element: JSX.Element;
  switch (user?.role.id as ROLE) {
    case ROLE.MANAGER:
    case ROLE.ADMIN:
      element = <ManagerSettings />;
      break;
    case ROLE.LOGIST:
      element = <LogistSettings />;
      break;
    case ROLE.COMPANY_ADMIN:
      element = <CompanyOwnerSettings />;
      break
    default:
      element = <CompanyOwnerSettings />;
  }

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>Настройки</title>
      </Head>
      <SidebarLayout>{element}</SidebarLayout>
      <NoSubscribeNoStaffAlert/>
    </AppShell>
  );
};

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  scope,
  context
}) => {
  const accessToken = context.req.cookies.access_token;
  if (accessToken) {
    await allSettled(getMeSsrFx, {
      scope,
      params: accessToken 
    });
  }
});
export default Index;
