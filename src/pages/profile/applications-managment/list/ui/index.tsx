import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { useStore, useUnit } from 'effector-react';
import { TabSelect } from '@box/shared/ui';
import s from './style.module.scss';
import { $userApplicationlistTypeManagement, changeUserApplicationListTypeManagement } from '../model/store';
import { ApplicationsManagementList, EquipmentApplicationsManagementList } from '@box/widgets/applications/applicationsManagment/list/ui';
import { applicationTypes } from '@box/features/application/lib';

export const ApplicationsManagement = () => {
  const listType = useStore($userApplicationlistTypeManagement);
  const changeListType = useUnit(changeUserApplicationListTypeManagement);
  
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <div className={s.header}>Мои заявки</div>
        <TabSelect
          onChange={changeListType}
          values={applicationTypes}
          value={listType}
        />
        {(listType.id === 1 || listType.id === 2) && <ApplicationsManagementList />}
        {listType.id === 3 && <EquipmentApplicationsManagementList />}
      </SidebarLayout>
    </AppShell>
  );
};