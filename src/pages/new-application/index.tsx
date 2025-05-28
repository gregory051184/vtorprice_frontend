import React, { useState } from 'react';
import classNames from 'classnames';

import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import {
  BackButton, Container, ITabSelectValue, Paper, TabSelect
} from '@box/shared/ui';
import { Stepper } from '@box/shared/ui/stepper';
import { CreateReadyForShipmentApplicationForm, CreateSupplyContractApplicationForm } from '@box/features/application/forms';
import { CreateEquipmentForm } from '@box/features/application/forms/create/equipment';

import s from './style.module.scss';
import { NotAuthAlert } from '@box/entities/notAuthAlert/ui';

const formTypes = [
  {
    id: 1,
    label: 'Готово к отгрузке',
    value: 1
  },
  {
    id: 2,
    label: 'Контракт на поставку',
    value: 2
  },
  {
    id: 3,
    label: 'Оборудование',
    value: 3
  },
];

export const NewApplicationPage: React.FC<{ tab: number }> = ({ tab }) => {
  const [selectedFormType, setSelectedFormType] = useState<ITabSelectValue>(formTypes[tab]);
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Container className="mt-[28px]">
        <BackButton />
        <div className={classNames('flex items-center gap-6', s.head)}>
          <h1 className="font-normal text-2xl">Создать заявку</h1>
          <TabSelect onChange={setSelectedFormType} values={formTypes} value={selectedFormType} />
        </div>
        <Paper className="mt-[28px]">
          <Stepper currentStep={selectedFormType.value}>
            <Stepper.Step>
              <CreateReadyForShipmentApplicationForm />
            </Stepper.Step>
            <Stepper.Step>
              <CreateSupplyContractApplicationForm />
            </Stepper.Step>
            <Stepper.Step> 
              <CreateEquipmentForm />
            </Stepper.Step>
          </Stepper>
        </Paper>
      </Container>
      <NotAuthAlert/>
    </AppShell>
  );
};
