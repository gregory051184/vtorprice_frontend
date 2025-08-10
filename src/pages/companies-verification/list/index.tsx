import React, {useState} from 'react';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import Head from 'next/head';
import {AppShell, SidebarLayout} from '@box/layouts';
import {CompaniesStatusChangeListFilters, CompaniesVerificationsListFilters} from '@box/features/company';
import {CompaniesVerificationsList} from '@box/widgets/companies';
import s from './style.module.scss';
import classNames from 'classnames';
import {CompaniesChangeStatusList, ManagersResultsList} from "@box/widgets/companies/companiesVerificationsList/ui";
import {Button} from "@box/shared/ui";
import {useStoreMap} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@types";
import {ManagersResultListFilter} from "@box/entities/user/filters";

export const CompaniesVerifications = () => {
    const [verification, setVerification] = useState<boolean>(false);
    const [managersResults, setManagersResults] = useState<boolean>(false);
    const user = useStoreMap({
        store: $authStore,
        keys: ['user'],
        fn: (val) => val.user
    });
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Верификация компаний</title>
            </Head>
            <SidebarLayout>
                {(user && user?.role?.id < ROLE.MANAGER) &&
                    <Button
                        type="micro"
                        mode="light"
                        fullWidth
                        onClick={() => {
                            setVerification(!verification)
                            setManagersResults(false)
                        }}>
                        {verification ? "Перейти к статусам компаний" : "Перейти к верификации компаний"}
                    </Button>}
                {(user && user?.role?.id <= ROLE.MANAGER) &&
                    <Button
                        className="mt-7"
                        type="micro"
                        mode="light"
                        fullWidth
                        onClick={() => {
                            setManagersResults(!managersResults)
                            setVerification(false)
                        }}>
                        {!managersResults ? "Менеджмент - результаты" : "Перейти к статусам компаний"}
                    </Button>}

                {(verification && !managersResults) &&
                    <div className='mt-7'>
                        <div className={classNames('mb-[20px] hidden', s.button)}>
                            <h1 className='text-2xl'>Верификация компаний</h1>
                        </div>
                        <CompaniesVerificationsListFilters/>
                        <CompaniesVerificationsList/>
                    </div>
                }

                {(!verification && !managersResults) &&
                    <div className='mt-7'>
                        <div className={classNames('mb-[20px] hidden', s.button)}>
                            <h1 className='text-2xl'>Статус компаний</h1>
                        </div>
                        <CompaniesStatusChangeListFilters/>
                        <CompaniesChangeStatusList/>
                    </div>

                }
                {(!verification && managersResults) &&
                    <div className='mt-7'>
                        <ManagersResultListFilter/>
                        <ManagersResultsList/>
                    </div>
                }
            </SidebarLayout>
        </AppShell>
    )
};
