import React from 'react';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import Head from 'next/head';
import {AsyncSelect, Button, Container, SearchInput, Separator} from '@box/shared/ui';
import { AppShell } from '@box/layouts';
import {
  ExchangeRecyclablesList,
  ExchangeSquareRecyclablesCategoryList
} from '@box/widgets/recyclable';
import Pointer from '@assets/icons/16_location.svg';
import Add from '@assets/icons/16_add.svg';
import { ExchangeRecyclablesListFilters } from '@box/features/recyclable';
import Link from 'next/link';
import { useScreenSize } from "@box/shared/hooks";
import classNames from "classnames";
import { recyclablesCategoriesSelectApi } from "@box/entities/company";
import { useForm } from "@box/shared/effector-forms";
import { filters } from "@box/features/recyclable/filters/exchnageRecyclables/model";
import {CompaniesStats} from "@box/widgets/statistics/companies-stats/ui";


export const Exchange = () => {
  const [screenSize, satisfies] = useScreenSize();
  const { fields } = useForm(filters);

  const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
  const isMobile = screenSize === 'xxsm';
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>Все заявки</title>
      </Head>
      <Container>
        {/*<ExchangeRecyclablesListFilters.UrgencyTypeTabs />*/}
        <ExchangeSquareRecyclablesCategoryList/>
        <CompaniesStats/>
        <div className={classNames("mb-8 flex justify-between items-center", isMobile && 'flex-col mb-[10px]')}>
          <div className={classNames("flex items-center gap-6", isMobile && 'flex-col w-full')}>
            <h1 className="font-normal text-2xl">Все заявки</h1>
            <ExchangeRecyclablesListFilters.UrgencyTypeTabs />
          </div>
          {!isLaptop && <div className={classNames("flex gap-[10px]", isMobile && "mt-[10px]")}>
            <Link href="/map">
              <Button type="mini" mode="stroke" iconLeft={<Pointer width={16} height={16}/>}>
                Показать на карте
              </Button>
            </Link>
            <Link href="/new-application">
              <Button type="mini" mode="stroke" iconLeft={<Add width={16} height={16}/>}>
                Создать заявку
              </Button>
            </Link>
          </div>}
        </div>
        <div className={classNames('flex gap-[20px]', isMobile && 'flex-col-reverse gap-[10px]')}>
          <AsyncSelect
            inputProps={{
              mode: 'stroke',
            }}
            withClearButton
            value={fields.category.value}
            onSelect={fields.category.onChange}
            placeholder="Категория"
            loadData={recyclablesCategoriesSelectApi}
          />
          {isLaptop && <div className="flex gap-[10px]">
            <Link href="/map">
              <Button type="mini" mode="stroke" iconLeft={<Pointer width={16} height={16}/>} className="h-[56px]">
                Показать на карте
              </Button>
            </Link>
            <Link href="/new-application">
              <Button type="mini" mode="stroke" iconLeft={<Add width={16} height={16}/>} className="h-[56px]">
                Создать заявку
              </Button>
            </Link>
          </div>}
          {
            !isLaptop &&
            <SearchInput mode="stroke" className="grow" value={fields.search.value} placeholder="Поиск по заявкам..." onChange={fields.search.onChange} />
          }
        </div>
        {
          isLaptop &&
          <div className="mt-[16px]">
            <SearchInput mode="stroke" className="grow" value={fields.search.value} placeholder="Поиск по заявкам..." onChange={fields.search.onChange} />
          </div>
        }
      </Container>
      {satisfies('md') && <Separator h={30} />}
      <Container>
        <ExchangeRecyclablesList />
      </Container>
    </AppShell>
  )
};
