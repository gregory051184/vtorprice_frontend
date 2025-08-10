import React from 'react';
import { useStore } from 'effector-react';
import { applicationModel } from '@box/entities/application';
import { BackButton, Paper } from '@box/shared/ui';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { UpdateEquipmentForm } from '@box/features/application/forms/update/equipment';
import s from "@box/pages/profile/applications/application/style.module.scss";

export const UsersEquipmentApplication = () => {
  const application = useStore(applicationModel.$equipmentApplication);

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <div className={s.back}>
          <BackButton />
        </div>
        {application
          && (
            <div className={s.title}>
              <h1 className="text-2xl">
                Редактирование заявки
              </h1>
              <Paper className="mt-[30px]">
                <UpdateEquipmentForm/>
              </Paper>
            </div>
          )}
      </SidebarLayout>
    </AppShell>
  );
};
