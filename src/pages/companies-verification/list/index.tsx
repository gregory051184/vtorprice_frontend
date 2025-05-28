import React from 'react';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import Head from 'next/head';
import { AppShell, SidebarLayout } from '@box/layouts';
import { CompaniesVerificationsListFilters } from '@box/features/company';
import { CompaniesVerificationsList } from '@box/widgets/companies';
import s from './style.module.scss';
import classNames from 'classnames';

export const CompaniesVerifications = () => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <Head>
      <title>Верификация компаний</title>
    </Head>
    <SidebarLayout>
      <div className={classNames('mb-[20px] hidden', s.button)}>
        <h1 className='text-2xl'>Верификация компаний</h1>
      </div>
      <CompaniesVerificationsListFilters />
      <CompaniesVerificationsList />
    </SidebarLayout>
  </AppShell>
);
