import React from 'react';
import Head from 'next/head';
import {AppShell} from '@box/layouts';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {Container} from '@box/shared/ui';
import {CompaniesListFilters, CompaniesListFiltersSearch} from '@box/features/company';
import {CompaniesTable} from '@box/widgets/companies';
import classNames from 'classnames';
import s from './style.module.scss';
import {CompaniesStats} from "@box/widgets/statistics/companies-stats/ui";

export const Companies = () => {
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Компании</title>
            </Head>
            <Container>
                <CompaniesStats/>
                <div className={classNames('mb-8 flex justify-between items-center', s.head)}>
                    {/*<div className="flex items-center gap-6">
                    </div>*/}
                    <CompaniesListFiltersSearch className={s.search}/>
                </div>
                <CompaniesListFilters/>
                <CompaniesTable className="mt-3"/>
            </Container>
        </AppShell>
    )
};
