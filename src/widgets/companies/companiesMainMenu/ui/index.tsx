import React, {useEffect} from 'react';
import classNames from 'classnames';
import {
    Button,
    Container,
    Pagination,
    Table,
} from '@box/shared/ui';
import {IWithClass} from '@types';
import {useGate, useStore} from 'effector-react';
import {useOrdering, usePagination} from '@box/shared/lib/factories';
import {useScreenSize} from '@box/shared/hooks';
import {
    companiesMainFiltersGate,
    paginationForMainFilters,
    ordering
} from '@box/widgets/companies/companiesList/model/table.store'
import s from './style.module.scss';
import {headers} from '../lib';
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@box/layouts";
import {useRouter} from "next/router";
import {
    CompanyCardForCompaniesMainFilterPage,
} from "@box/entities/company";
import {useForm} from "@box/shared/effector-forms";
import {CompaniesFiltersLayout} from "@box/layouts/filters_layout/ui/companiesFilters";
import {mainMenuCompaniesFilters} from "@box/features/company/filters/mainMenuCompaniesFilters";
import {
    $companiesWithMainFilters,
    companiesForMainFilterLoading,
} from "@box/entities/company/model";


export const CompaniesListForMainPage: React.FC<IWithClass> = ({
                                                                   className
                                                               }) => {
    const companiesList = useStore($companiesWithMainFilters);
    //const applications = useStore(applicationModel.$applications);
    const loading = useStore(companiesForMainFilterLoading.$loaderStore);
    //const pag = usePagination(pagination);
    const pag = usePagination(paginationForMainFilters);
    const ord = useOrdering(ordering);
    const [, satisfies] = useScreenSize();

    const {fields, reset} = useForm(mainMenuCompaniesFilters);

    const router = useRouter();

    /*const companies = (apps: applicationModel.IRecyclableApplication[]): companyModel.ICompany[] => {
        const a: companyModel.ICompany[] = [];
        apps = applications
            .filter(app => app.recyclables?.id === fields.recyclables?.value?.id)
            //@ts-ignore
            .filter(app => +fields?.company_deals_number?.value > 0 ? app.company?.dealsCount >= +fields?.company_deals_number?.value : app)
            //@ts-ignore
            .filter(app => +fields?.company_rating?.value?.value > 0 ? app.company.averageReviewRate >= +fields?.company_rating?.value?.value : app)
        //@ts-ignore
        for (let i = 0; i < apps.length; i++) {
            if (!a.map(elem => elem.id).includes(apps[i].company.id)) {
                //@ts-ignore
                a.push(apps[i].company);
            }
        }
        return companiesList.filter(company => a.map(comp => comp.id).includes(company.id));
    }*/


    //useGate(gate);
    useGate(companiesMainFiltersGate);
    useEffect(() => {
    }, [companiesList]);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <CompaniesFiltersLayout>
                <Container>
                    {Object.keys(fields).length > 0 &&
                        <div className="mt-6 mb-6 inline-flex">
                            <p className="font-bold">{`Фильтры >> `}</p>
                            {
                                fields.deal_type_select?.value?.label &&
                                <p>{`${fields.deal_type_select?.value?.label} >`}</p>
                            }
                            {
                                fields.urgency_type_select?.value?.label &&
                                <p>{`${fields.urgency_type_select?.value?.label} >`}</p>
                            }
                            {
                                fields.period?.value?.label && <p>{`${fields.period?.value?.label} >`}</p>
                            }
                            {
                                fields.city?.value && <p>{`${fields.city?.value?.label} >`}</p>
                            }
                            {
                                fields.region?.value && <p>{`${fields.region?.value?.label} >`}</p>
                            }
                            {
                                fields.district?.value && <p>{`${fields.district?.value?.label} >`}</p>
                            }
                            {
                                fields.nds?.value && <p>{`${fields.nds?.value?.label} >`}</p>
                            }
                            {
                                fields.city?.value?.label && <p>{`${fields.city?.value?.label} >`}</p>
                            }
                            {
                                fields.recyclables?.value?.label && <p>{`${fields.recyclables?.value?.label} >`}</p>
                            }
                            {
                                fields.moisture__gte?.value && <p>{`Влажность ${fields.moisture__gte?.value} >`}</p>
                            }
                            {
                                fields.weediness__gte?.value && <p>{`Сорность ${fields.weediness__gte?.value} >`}</p>
                            }

                        </div>}
                    <div className="mt-6 mb-6">
                        <h1>{
                            //@ts-ignore
                            fields.recyclables?.value?.label
                        }</h1>
                    </div>
                    {satisfies('md') ? (
                            <Table
                                loading={loading && pag.currentPage === 1}
                                empty={companiesList.length === 0}
                                className={classNames(className, s.table)}
                                pagination={<Pagination pagination={paginationForMainFilters}/>}
                            >
                                <div className="inline-flex">
                                    <div>
                                        {/*companies(applications).map((company)*/companiesList.map(company => (
                                            <CompanyCardForCompaniesMainFilterPage company={company}
                                                                                   key={company.id}/>))}
                                    </div>
                                    {
                                        companiesList?.length > 0 &&
                                        <div className={s.ordering_panel}>
                                            <h3 className="text-white">Упорядочить</h3>
                                            <Table.List
                                                headers={headers}
                                                ordering={ord.ordering}
                                                onOrderingChange={ord.setOrdering}
                                            />
                                            <div className="mt-6 ml-2">
                                                <Button onClick={() => router.push('/profile/favorites')}>
                                                    Избранное
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Table>)
                        : (
                            <div className={s.card_view}>
                                <Pagination pagination={paginationForMainFilters}/>
                            </div>)}
                </Container>
            </CompaniesFiltersLayout>
        </AppShell>
    )
        ;
};
