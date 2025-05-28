import React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import Pointer from '@assets/icons/16_location.svg';
import Add from '@assets/icons/16_add.svg';

import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { Button, Container } from '@box/shared/ui';
import { EquipmentsListFilters, EquipmentsListFiltersSearch } from '@box/features/application/filters/equipmentApplications';
import { EquipmentsTable } from '@box/widgets/applications/applicationsEquipmentList/ui';

import s from './style.module.scss';
import Link from 'next/link';

export const Equipments = () => {
  const router = useRouter();
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>Оборудование</title>
      </Head>
      <Container>
        <div className={classNames('mb-8 flex justify-between items-center', s.head)}>
          <div className={s.headBox}>
            <h1 className={classNames("font-normal text-2xl", s.title)}>Оборудование</h1>
            <div className="flex gap-[10px]">
              <Link href="/map">
                <Button type="mini" mode="stroke" iconLeft={<Pointer width={16} height={16} />}>
                  Показать на карте
                </Button>
              </Link>
              <Button 
                type="mini" 
                mode="stroke" 
                iconLeft={<Add width={16} height={16} />} 
                onClick={() => {
                  router.push({
                    pathname: '/new-application/',
                    query: { tab: 2 }
                  }); 
                }}
              >
                Создать заявку
              </Button>
            </div>
          </div>
          <EquipmentsListFiltersSearch className={s.search} />
        </div>
        <EquipmentsListFilters />
        <EquipmentsTable />
      </Container>
    </AppShell>
  );
};
