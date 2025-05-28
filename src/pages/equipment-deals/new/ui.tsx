import React, { FC } from "react";
import { $application } from './model';
import { useStore } from 'effector-react';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { AppShell } from '@box/layouts';
import {
  BackButton, Badge, Container, Paper
} from '@box/shared/ui';
import s from '../../deals/new/style.module.scss';
import classNames from "classnames";
import { EquipmentDealCreateForm } from "@box/features/deal/forms/equipment";
import { NotAuthAlert } from "@box/entities/notAuthAlert/ui";
import { NotVerificatedAlert } from "@box/entities/notVerificatedAlert/ui";
import { BreadCrumbs } from "@box/shared/ui/breadCrumbs";

const EquipmentDeal: FC = () => {
  const application = useStore($application);

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Container>
        <BackButton />
        <h1 className="text-2xl font-medium mt-[10px]">Создать сделку</h1>
        {
          application &&
          <>
            <BreadCrumbs
              className="mt-[10px]"
              breadcrumbs={[
                {
                  text: "Оборудование",
                  href: "/equipments-applications",
                },
                {
                  text: application.equipment.name,
                  href: `/equipment-applications/${application.equipment.id}`
                },
                {
                  text: "Создать сделку"
                }
              ]}
            />
            <Paper className="mt-[20px]">
              <div className={classNames("flex justify-between items-center gap-[16px]", s.header)}>
                <div className="flex gap-[20px] items-center">
                  {!!application.images.length && <div className="w-[156px] relative">
                    <img src={application.images[0].image} alt="Вторсырье" className="rounded-[10px]" />
                  </div>}
                  <div className="">
                    <h2 className="text-base">{application.equipment.name}</h2>
                    <p className="text-sm text-grey-50">{application.equipment.category.name}</p>
                  </div>
                </div>

                {application.dealType.id === 2 && (
                  <Badge color="red">
                    Продажа
                  </Badge>
                )}
                {application.dealType.id === 1 && (
                  <Badge color="green">
                    Покупка
                  </Badge>
                )}
              </div>
              <EquipmentDealCreateForm className="mt-[24px]" dealType={application.dealType.id} />
            </Paper>
          </>
        }
      </Container>
      <NotAuthAlert />
      <NotVerificatedAlert />
    </AppShell>
  )
}

export { EquipmentDeal }
