import React from 'react';
import { useStore } from 'effector-react';
import { applicationModel } from '@box/entities/application';
import { BackButton, Paper } from '@box/shared/ui';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { UpdateReadyForShipmentApplicationForm, UpdateSupplyContractApplicationForm } from '@box/features/application';
import s from './style.module.scss';

export const UsersApplication = () => {
  const application = useStore(applicationModel.$application);

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
                {application.urgencyType.id === 1 ? (
                  <UpdateReadyForShipmentApplicationForm />
                ) : (
                  <UpdateSupplyContractApplicationForm />
                )}
              </Paper>
            </div>
          )}
      </SidebarLayout>
    </AppShell>
  );
};
