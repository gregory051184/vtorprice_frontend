import React from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { UsersApplicationsList } from '@box/widgets/applications';
import { TabSelect } from '@box/shared/ui';
import { UsersEquipmentApplicationsList } from '@box/widgets/applications/useEquiomentApplicationList';
import { applicationTypes } from '@box/features/application/lib';
import { useStore, useUnit } from 'effector-react';
import { $userApplicationlistType, changeUserApplicationListType } from '../model';
import s from './style.module.scss';
import { SpecialApplicationsList } from '@box/pages/special-applications/list/ui/specialApplicationsList';


export const UsersApplications = () => {
  const listType = useStore($userApplicationlistType);
  const changeListType = useUnit(changeUserApplicationListType);
  
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
        {listType.id === 4 && <SpecialApplicationsList/>}
        {(listType.id === 1 || listType.id === 2) && <UsersApplicationsList />}
        {listType.id === 3 && <UsersEquipmentApplicationsList />}
      </SidebarLayout>
    </AppShell>
  );
};
