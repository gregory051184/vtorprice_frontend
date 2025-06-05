import {useGate, useStore} from "effector-react";
import {$recyclables, IRecyclable, recyclableGate} from "@box/entities/recyclable/model";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {AppShell} from "@box/layouts";
import {BackButton, Container, Select} from "@box/shared/ui";
import {
    $allApplicationsWithoutPages, $applications
} from "@box/entities/application/model";
import {useRouter} from "next/router";
import {ICompany, ICompanyShortForAll} from "@box/entities/company/model";
import s from './style.module.scss';
import {
    FullListOfApplicationsForMainPage
} from "@box/widgets/applications/applicationsListForMainPage/ui/fullListOfApplicationsForMainPage";
import {MainMenuSidePanel} from "@box/widgets/mainMenuSidePanel";
import {
    applicationRecyclableStatusSelectValues,
    companyActivityTypesSelectValues,
    TimeframeTypes
} from "@box/entities/application";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {gate} from "@box/widgets/applications/applicationsListForMainPage";
import {$recyclablesCategory, gate as categoryRecyclable} from "@box/entities/category/model";


type RecyclableTotalVolumeType = {
    recyclable: IRecyclable,
    totalVolume: number,
}


export const RecyclablesByCategory = () => {
    const recyclables = useStore($recyclables);
    const apps = useStore($applications);
    const applications = useStore($allApplicationsWithoutPages);
    const router = useRouter();

    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showCompanies, setShowCompanies] = useState<boolean>(false);

    const f = useForm(applicationFiltersForMainPageChart);

    const recyclableCategoryVolume = (categoryId: number): number => {
        const filtered_apps = applications.filter(app => app?.recyclables?.id === categoryId);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0)).toFixed();
    };

    const cityRecyclableCategoryVolume = (categoryId: number, cityId: number): number => {
        const filtered_apps = applications
            .filter(app => app?.recyclables?.category?.id === categoryId && app?.company?.city?.id === cityId);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0)).toFixed();
    }

    const cityRecyclablePercentInCategory = (categoryId: number, cityId: number): string => {
        const filtered_apps_volume = +(applications
            .filter(app => app?.recyclables?.category?.id === categoryId && app?.company?.city?.id === cityId)
            .map(app => app?.totalWeight)
            .reduce((sum, a) => sum + a, 0)).toFixed();
        const filtered_apps = +(applications
            .filter(app => app?.recyclables?.category?.id === categoryId)
            .map(app => app?.totalWeight)
            .reduce((sum, a) => sum + a, 0)).toFixed();
        return `${(filtered_apps_volume / filtered_apps * 100).toFixed(2)} %`
    }

    const companyApplicationsVolume = (companyId: number, categoryId: number) => {
        const filtered_apps = applications
            .filter(app => app?.company?.id === companyId && app?.recyclables?.category?.id === categoryId);
        return +(filtered_apps
            .map(app => app?.totalWeight)
            .reduce((sum, a) => sum + a, 0)).toFixed();
    };


    const filteredCompaniesByCityAndCategoryId = (categoryId: number) => {
        const result = []
        const citiesInApplications = applications
            .filter(app => app?.recyclables?.category?.id === categoryId)
            .map(app => app?.company?.city?.id)
            .reduce((result: Array<any>, item: number) => {
                return result.includes(item) ? result : [...result, item];
            }, []);

        const companiesInApplications = applications
            .filter(app => app?.recyclables?.category?.id === categoryId)
            .map(app => app?.company)
            .reduce((result: Array<any>, item: ICompanyShortForAll/*ICompany*/) => {
                return result.includes(item?.id) ? result : [...result, item];
            }, [])

        for (let i = 0; i < citiesInApplications.length; i++) {
            const cityId = citiesInApplications[i]
            result.push(companiesInApplications.filter(company => company?.city?.id === cityId).map(company => ({
                company: company,
                totalVolume: companyApplicationsVolume(+company.id, categoryId)
            })).filter((o, index, arr) =>
                arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
            ))
        }
        return result
    }


    const filteredRecyclableCategory = (): Array<RecyclableTotalVolumeType> => {
        const result = []
        for (let i = 0; i < recyclables.length; i++) {
            const recCat = recyclables[i];
            const totalVolume = recyclableCategoryVolume(recCat?.id);
            result.push({
                recyclable: recCat,
                totalVolume: totalVolume,
            })
        }
        return result.sort((a, b) => b.totalVolume - a.totalVolume);
    };


    const changeShowFormHandler = () => {
        setShowForm(!showForm)
    }

    const changeShowCompaniesHandler = () => {
        setShowCompanies(!showCompanies)
    }

    const changeShowApplicationsHandler = () => {
        setShowCategories(!showCategories)
    }

    useEffect(() => {
    }, [applications, recyclables, apps]);

    useGate(applicationsWithPeriodWithoutPagesGate);
    useGate(gate);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>{`Вторсырьё ${recyclables.map(rec => rec?.category?.name)[0]}`}</title>
            </Head>

            <Container>
                <BackButton/>
                <div className="inline-flex mt-6">
                    <h1>{recyclables.map(rec => rec?.category?.name)[0]}</h1>
                    <div className={'w-auto ml-32 inline-flex'}>
                        <Select
                            inputProps={{mode: "stroke"}}
                            placeholder={'Период'}
                            className="w-100"
                            onSelect={f.fields.period_tab.onChange}
                            data={TimeframeTypes}
                            value={f.fields.period_tab.value}
                        />
                        <Select
                            className="w-100 ml-5"
                            withClearButton
                            inputProps={{mode: 'stroke'}}
                            value={f.fields.company_activity_types.value}
                            placeholder="Тип компании"
                            onSelect={f.fields.company_activity_types.onChange}
                            data={companyActivityTypesSelectValues}
                        />
                        <Select
                            inputProps={{mode: "stroke"}}
                            placeholder={'Тип продукции'}
                            className="w-100 ml-5"
                            onSelect={f.fields.application_recyclable_status_tab.onChange}
                            data={applicationRecyclableStatusSelectValues}
                            value={f.fields.application_recyclable_status_tab.value}
                        />
                    </div>
                </div>
                <div className='inline-flex w-full mt-6'>
                    <div className='w-5/6'>
                        <div className='w-full flex-wrap'>
                            {filteredRecyclableCategory().map(item => (
                                <div
                                    onClick={() => router.push(`/applications/category/recyclable/${item?.recyclable?.id}`)}
                                    className={s.category_main_page}>
                        <span>
                            <p className={s.category_main_page_name}>
                                {item?.recyclable?.name}
                            </p>
                            {item?.totalVolume > 0 &&
                                <p className={s.category_main_page_name}>
                                    {`${item?.totalVolume} т`}
                                </p>}
                        </span>
                                </div>
                            ))
                            }
                        </div>
                        <div className='mt-7'>
                            <h3>{`Компании с объявлениями по ${recyclables.map(rec => rec?.category?.name)[0]}`}</h3>
                            {filteredCompaniesByCityAndCategoryId(recyclables.map(rec => rec?.category?.id)[0])
                                .map(item => (
                                    <div
                                        className='flex-wrap inline-flex ml-5 mt-7 w-56'
                                        key={item[0]?.company?.city?.id}>
                                        <div>
                                            <div className="font-bold">
                                                <h4>
                                                    {item[0]?.company?.city?.name}
                                                </h4>

                                            </div>
                                            <div className="inline-flex">
                                                <h4 className='font-bold mt-1'>
                                                    {`${cityRecyclableCategoryVolume(recyclables
                                                        .map(rec => rec?.category?.id)[0], item[0]?.company?.city?.id)} т`}
                                                </h4>
                                                <h4 className="ml-1 font-bold mt-1">
                                                    {cityRecyclablePercentInCategory(recyclables
                                                        .map(rec => rec?.category?.id)[0], item[0]?.company?.city?.id)}
                                                </h4>
                                            </div>
                                            <div>
                                                {item?.map(company => (
                                                    <div
                                                        onClick={() => router.push(`/companies/${company?.company?.id}`)}
                                                        className={s.company_title}
                                                        key={company?.company?.id}>
                                                        <p>{company?.company?.name}</p>
                                                        <p>{`${company?.totalVolume} т`}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className='mt-10'>
                            <h3>{`Объявлениями по ${recyclables.map(rec => rec?.category?.name)[0]}`}</h3>
                            <FullListOfApplicationsForMainPage /*applications={apps
                                .filter(app => +app?.recyclables?.category?.id === +recyclables
                                    .map(rec => rec?.category?.id)[0])}*/></FullListOfApplicationsForMainPage>
                        </div>
                    </div>
                    <div>
                        <MainMenuSidePanel
                            onChangeShowForm={changeShowFormHandler}
                            onChangeShowCompanies={changeShowCompaniesHandler}
                            onChangeShowApplications={changeShowApplicationsHandler}/>
                    </div>
                </div>
            </Container>
        </AppShell>
    )
}