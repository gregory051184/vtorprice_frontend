import React, { useState } from 'react';
import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import {
  BackButton,
  Container, ITabSelectValue, Paper
} from '@box/shared/ui';
import { Stepper } from '@box/shared/ui/stepper';
import { CreateSupplyContractApplicationForm } from '@box/features/application/forms';
import classNames from 'classnames';
import { CreateTransportApplicationForm } from '@box/features/logistics';
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
];

export const TransportNewApplication = () => {
  const [selectedFormType] = useState<ITabSelectValue>(formTypes[0]);
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Container className="mt-[28px]">
        <div className={classNames(s.head)}>
          <BackButton />
          <h1 className="font-normal text-2xl mt-[10px]">Создать заявку на транспорт</h1>
        </div>
        <Paper className="mt-[28px]">
          <Stepper currentStep={selectedFormType.value}>
            <Stepper.Step>
              <CreateTransportApplicationForm />
            </Stepper.Step>
            <Stepper.Step>
              <CreateSupplyContractApplicationForm />
            </Stepper.Step>
          </Stepper>
        </Paper>
      </Container>
      <NotAuthAlert />
    </AppShell>
  );
};
