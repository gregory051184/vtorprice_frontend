import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { ApplicationsFromUsersListFilters } from '@box/features/application';
import { ApplicationsFromUsersPurchaseList, ApplicationsFromUsersSalesList } from '@box/widgets/applications';
import { Button } from '@box/shared/ui';
import { useEvent } from 'effector-react';
import { createDealEvent } from './model';
import s from './style.module.scss';
import classNames from 'classnames';

export const ApplicationsFromUsers = () => {
  const handleClick = useEvent(createDealEvent);
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <ApplicationsFromUsersListFilters />
        <div className={classNames("flex gap-[10px] my-[30px]", s.tables)}>
          <ApplicationsFromUsersSalesList className={classNames("w-[49%]", s.table)} />
          <ApplicationsFromUsersPurchaseList className={classNames("w-[49%]", s.table)} />
        </div>
        <Button onClick={handleClick} type="mini" sx={{height: 50}} width={200} className="mt-[20px] mx-auto">Создать сделку</Button>
      </SidebarLayout>
    </AppShell>
  );
};
