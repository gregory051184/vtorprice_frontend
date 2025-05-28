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
import {
    AppCardForShortListForMainPage,
    applicationModel,
} from '@box/entities/application';
import {useOrdering, usePagination} from '@box/shared/lib/factories';
import {useScreenSize} from '@box/shared/hooks';
import {
    pagination,
    gate,
    ordering
} from '../model';
import s from './style.module.scss';
import {headers} from '../lib';
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@box/layouts";
import {useRouter} from "next/router";
import {useForm} from "@box/shared/effector-forms";
import {ApplicationsFiltersLayout} from "@box/layouts/filters_layout";
import {DeliveryCalculator, DeliveryCalculatorVertical} from "@box/features";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";


export const ApplicationsListForMainPage: React.FC<IWithClass> = ({
                                                                      className
                                                                  }) => {
    const applications = useStore(applicationModel.$applications);
    const loading = useStore(applicationModel.applicationsLoading.$loaderStore);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const {fields, reset} = useForm(mainMenuApplicationFilters);

    const router = useRouter();
    /*const queries = router.query;

    const defaultFilters = (queries: ParsedUrlQuery) => {

        //@ts-ignore
        //setFraction(applications.filter(app => app?.recyclables?.id === +queries['category'])[0]?.recyclables)

        //@ts-ignore
        //setFractions(applications.filter(app => app?.recyclables?.id === +queries['category']))
    }

    useEffect(() => {
        defaultFilters(queries)
    }, [queries]);*/

    useGate(gate);
    useEffect(() => {
    }, [applications]);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <ApplicationsFiltersLayout>
                <Container>
                    {Object.keys(fields).length > 0 &&
                        <div className="mt-6 mb-6 inline-flex flex-wrap">
                            <p className="font-bold whitespace-nowrap">{`Фильтры >> `}</p>
                            {
                                fields.deal_type_select?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.deal_type_select?.value?.label} >`}</p>
                            }
                            {
                                fields.urgency_type_select?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.urgency_type_select?.value?.label} >`}</p>
                            }
                            {
                                fields.created_at?.value[0] !== null &&
                                //@ts-ignore
                                <p className="whitespace-nowrap">{`Опубликовано ${new Date(fields.created_at?.value).toLocaleDateString()} >`}</p>
                            }
                            {
                                fields.period?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.period?.value?.label} >`}</p>
                            }
                            {
                                fields.city?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.city?.value?.label} >`}</p>
                            }
                            {
                                fields.recyclables?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.recyclables?.value?.label} >`}</p>
                            }
                            {
                                fields.moisture__gte?.value &&
                                <p className="whitespace-nowrap">{`Влажность ${fields?.moisture__gte?.value} >`}</p>
                            }
                            {
                                fields.weediness__gte?.value &&
                                <p className="whitespace-nowrap">{`Сорность ${fields?.weediness__gte?.value} >`}</p>
                            }
                        </div>}
                    <div className="mt-6 mb-6">
                        <h1>{
                            //@ts-ignore
                            fields.recyclables?.value?.label
                        }</h1>
                    </div>
                    {(!isLaptop && !isMobile) && <Table
                        loading={loading && pag.currentPage === 1}
                        empty={applications.length === 0}
                        className={classNames(className, s.table)}
                        pagination={<Pagination pagination={pagination}/>}
                    >
                        <div className="inline-flex">
                            <div>
                                {applications.filter(app => app?.recyclables?.id === fields.recyclables?.value?.id)
                                    .map((application) => (
                                    <AppCardForShortListForMainPage application={application} key={application?.id}/>))}

                            </div>
                            {applications?.length > 0 &&
                                <div className={s.ordering_panel}>
                                    <h3 className="text-white">Упорядочить</h3>
                                    <Table.List
                                        headers={headers}
                                        ordering={ord.ordering}
                                        onOrderingChange={ord.setOrdering}
                                    />
                                    <div className="mt-6 ml-5">
                                        <Button
                                            onClick={() => router.push('/profile/favorites')}>
                                            Избранное
                                        </Button>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-white">Перевозка</h3>
                                        <DeliveryCalculatorVertical className="mb-[70px]"/>
                                    </div>
                                </div>}
                        </div>
                    </Table>}

                    {(isLaptop && !isMobile) &&
                        <div className="mt-6">
                            <DeliveryCalculator className="w-full"></DeliveryCalculator>
                            <div className="mt-6">
                                <Button
                                    fullWidth={true}
                                    mode="light"
                                    onClick={() => router.push('/profile/favorites')}>
                                    Избранное
                                </Button>
                            </div>
                            <div className={isLaptop ? "inline-flex ml-28" : "inline-flex"}>
                                <div>
                                    {applications
                                        .filter(app => app?.recyclables?.id === fields.recyclables?.value?.id)
                                        .map((application) => (
                                            <AppCardForShortListForMainPage application={application} key={application?.id}/>))}
                                </div>
                            </div>
                        </div>}

                    {(isMobile && !isLaptop) &&
                        <div className="mt-6">
                            <DeliveryCalculator className="w-full"></DeliveryCalculator>
                            <div className="mt-6">
                                <Button
                                    fullWidth={true}
                                    mode="light"
                                    onClick={() => router.push('/profile/favorites')}>
                                    Избранное
                                </Button>
                            </div>
                            <div className="inline-flex">
                                <div>
                                    {applications
                                        .filter(app => app?.recyclables?.id === fields.recyclables?.value?.id)
                                        .map((application) => (
                                            <AppCardForShortListForMainPage application={application} key={application?.id}/>))}
                                </div>
                            </div>
                        </div>}
                </Container>
            </ApplicationsFiltersLayout>
        </AppShell>
    )
        ;
};
