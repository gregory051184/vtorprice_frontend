import {useGate, useStore} from "effector-react";
import {$recyclables, IRecyclable} from "@box/entities/recyclable/model";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {AppShell} from "@box/layouts";
import {BackButton, Container, Select} from "@box/shared/ui";
import {
    $allApplicationsWithoutPages, $applications,
} from "@box/entities/application/model";
import {useRouter} from "next/router";
import {ICompanyShortForAll} from "@box/entities/company/model";
import s from '../../style.module.scss';
import {
    FullListOfApplicationsForMainPage
} from "@box/widgets/applications/applicationsListForMainPage/ui/fullListOfApplicationsForMainPage";
import {MainMenuSidePanel} from "@box/widgets/mainMenuSidePanel";
import {
    applicationRecyclableStatusSelectValues,
    companyActivityTypesSelectValues,
    dealTypeSelectValues,
    TimeframeTypes
} from "@box/entities/application";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {FormsModals} from "@box/widgets/formsModals";
import {gate} from "@box/widgets/applications/applicationsListForMainPage";
import {useScreenSize} from "@box/shared/hooks";
import {RecyclableSwiper} from "@box/widgets/recyclable";


type RecyclableTotalVolumeType = {
    recyclable: IRecyclable,
    totalVolume: number,
}


export const RecyclablesWasteSellByCategory = () => {
    const recyclables = useStore($recyclables);
    const applications = useStore($allApplicationsWithoutPages);
    const apps = useStore($applications)
    const router = useRouter();

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const f = useForm(applicationFiltersForMainPageChart);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showCompanies, setShowCompanies] = useState<boolean>(false);

    const recyclableCategoryVolume = (categoryId: number): number => {
        const filtered_apps = applications.filter(app => app?.recyclables?.id === categoryId &&
            app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    };

    const companyApplicationsVolume = (companyId: number, categoryId: number) => {
        const filtered_apps = applications.filter(app => app?.company?.id === companyId && app?.recyclables?.category?.id === categoryId &&
            app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    };

    const cityRecyclableCategoryVolume = (categoryId: number, cityId: number): number => {
        const filtered_apps = applications.filter(app => app?.recyclables?.category?.id === categoryId && app.company?.city?.id === cityId &&
            app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    }

    const cityRecyclablePercentInCategory = (categoryId: number, cityId: number): string => {
        const filtered_apps_volume = +(applications
            .filter(app => app?.recyclables?.category?.id === categoryId && app?.company?.city?.id === cityId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app?.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app.totalWeight)
            .reduce((sum, a) => sum + a, 0) / 1000);
        const filtered_apps = +(applications
            .filter(app => app?.recyclables?.category?.id === categoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app.totalWeight)
            .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
        return `${(filtered_apps_volume / filtered_apps * 100).toFixed(2)} %`
    }


    const filteredCompaniesByCityAndCategoryId = (categoryId: number) => {
        const result = []
        const citiesInApplications = applications
            .filter(app => app?.recyclables?.category?.id === categoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app?.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app?.company?.city?.id/*app?.city*/)
            .reduce((result: Array<any>, item: number) => {
                return result.includes(item) ? result : [...result, item];
            }, []);

        const companiesInApplications = applications
            .filter(app => app?.recyclables?.category?.id === categoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app?.company)
            .reduce((result: Array<any>, item: ICompanyShortForAll/*ICompany*/) => {
                return result.includes(item?.id) ? result : [...result, item];
            }, [])
        for (let i = 0; i < citiesInApplications.length; i++) {
            const cityId = citiesInApplications[i]
            result.push(companiesInApplications.filter(company => company?.city?.id === cityId).map(company => ({
                company: company,
                totalVolume: companyApplicationsVolume(+company?.id, categoryId)
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

    if (isMobile) {
        return (
            <AppShell
                header={<Header/>}
                footer={<Footer/>}
            >
                <Head>
                    <title>{recyclables.length > 0 ? `Отходы ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : 'Отходы продажа'}</title>
                </Head>
                <Container>
                    <BackButton/>
                    <div>
                        <MainMenuSidePanel
                            onChangeShowForm={changeShowFormHandler}
                            onChangeShowCompanies={changeShowCompaniesHandler}
                            onChangeShowApplications={changeShowApplicationsHandler}/>
                    </div>
                    <div className="mt-6">
                        <h1>{recyclables.length > 0 ? `Отходы ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : 'Отходы продажа'}</h1>
                        <div className={'w-auto mt-6'}>
                            <Select
                                inputProps={{mode: "stroke"}}
                                placeholder={'Период'}
                                className="w-full"
                                onSelect={f.fields.period_tab.onChange}
                                data={TimeframeTypes}
                                value={f.fields.period_tab.value}
                            />
                            <Select
                                className="w-full mt-6"
                                withClearButton
                                inputProps={{mode: 'stroke'}}
                                value={f.fields.company_activity_types.value}
                                placeholder="Тип компании"
                                onSelect={f.fields.company_activity_types.onChange}
                                data={companyActivityTypesSelectValues}
                            />
                        </div>
                    </div>
                    <RecyclableSwiper recyclables={filteredRecyclableCategory}/>
                    {/*<div className="mt-6">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={15}
                            pagination={{
                                el: ".swiper-pagination",
                                type: "bullets"
                            }}
                            modules={[Pagination]}
                        >
                            {filteredRecyclableCategory().map(item =>
                                    <SwiperSlide
                                        key={item?.recyclable?.id}
                                        onClick={() => item?.totalVolume > 0 && router.push(`/applications/wastes/sell/category/recyclable/${item?.recyclable?.id}`)}
                                        className={s.category_main_page_slider}>
                                        <div>
                        <span>
                            <p className={classNames(s.category_main_page_slider_name, "text-3xl")}>
                                {item?.recyclable?.name}
                            </p>
                            {item?.totalVolume > 0 &&
                                <p className={classNames(s.category_main_page_slider_name, "text-lg")}>
                                    {`${item?.totalVolume} т`}
                                </p>
                            }
                        </span>
                                        </div>
                                    </SwiperSlide>
                            )}
                        </Swiper>
                        <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
                    </div>*/}
                    <div className='mt-7'>
                        <h3>{recyclables.length > 0 ? `Компании с объявлениями по отходам ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : ''}</h3>
                        {recyclables.length > 0 && filteredCompaniesByCityAndCategoryId(recyclables.map(rec => rec?.category?.id)[0]).map(item => (
                            <div
                                className='flex-wrap inline-flex ml-5 mt-7 w-full break-words'
                                key={item[0]?.company?.city?.id}>
                                <div>
                                    <div className="font-bold">
                                        <h4>
                                            {item[0]?.company?.city?.name}
                                        </h4>
                                    </div>
                                    <div className="inline-flex">
                                        <h4 className='font-bold mt-1'>
                                            {`${cityRecyclableCategoryVolume(recyclables.map(rec => rec?.category?.id)[0], item[0]?.company?.city?.id)} т`}
                                        </h4>
                                        <h4 className="ml-1 font-bold mt-1">
                                            {cityRecyclablePercentInCategory(recyclables.map(rec => rec?.category?.id)[0], item[0].company?.city?.id)}
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
                    {recyclables.length > 0 &&
                        <div className='mt-10'>
                            <h3>{`Объявления по отходам ${recyclables.map(rec => rec?.category?.name)[0]} продажа`}</h3>
                            <FullListOfApplicationsForMainPage></FullListOfApplicationsForMainPage>
                        </div>}
                </Container>
                <FormsModals showForm={showForm}
                             showCompanies={showCompanies}
                             showApplications={showCategories}
                             onChangeShowForm={changeShowFormHandler}
                             onChangeShowCompanies={changeShowCompaniesHandler}
                             onChangeShowApplications={changeShowApplicationsHandler}
                />
            </AppShell>
        )
    }

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>{recyclables.length > 0 ? `Отходы ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : 'Отходы продажа'}</title>
            </Head>

            <Container>
                <BackButton/>
                <div className="inline-flex mt-6">
                    <h1>{recyclables.length > 0 ? `Отходы ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : 'Отходы продажа'}</h1>
                    <div className={'w-auto ml-36 inline-flex'}>
                        <Select
                            inputProps={{mode: "stroke"}}
                            placeholder={'Период'}
                            className="w-130"
                            onSelect={f.fields.period_tab.onChange}
                            data={TimeframeTypes}
                            value={f.fields.period_tab.value}
                        />
                        <Select
                            className="w-130 ml-5"
                            withClearButton
                            inputProps={{mode: 'stroke'}}
                            value={f.fields.company_activity_types.value}
                            placeholder="Тип компании"
                            onSelect={f.fields.company_activity_types.onChange}
                            data={companyActivityTypesSelectValues}
                        />
                    </div>
                </div>
                <div className='inline-flex w-full mt-6'>
                    <div className='w-5/6'>
                        <div className='w-full flex-wrap'>
                            {filteredRecyclableCategory().map(item => (
                                <div
                                    onClick={() => item?.totalVolume > 0 && router.push(`/applications/wastes/sell/category/recyclable/${item?.recyclable?.id}`)}
                                    className={s.category_main_page}>
                        <span>
                            {item?.recyclable?.name?.length > 0 &&
                                <p className={s.category_main_page_name}>
                                    {item?.recyclable?.name}
                                </p>}
                            {item?.totalVolume > 0 &&
                                <p className={s.category_main_page_name}>
                                    {item?.totalVolume}
                                </p>}
                        </span>
                                </div>
                            ))
                            }
                        </div>
                        <div className='mt-7'>
                            <h3>{recyclables.length > 0 ? `Компании с объявлениями по отходам ${recyclables.map(rec => rec?.category?.name)[0]} продажа` : ''}</h3>
                            {recyclables.length > 0 && filteredCompaniesByCityAndCategoryId(recyclables.map(rec => rec?.category?.id)[0]).map(item => (
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
                                                {`${cityRecyclableCategoryVolume(recyclables.map(rec => rec?.category?.id)[0], item[0]?.company?.city?.id)} т`}
                                            </h4>
                                            <h4 className="ml-1 font-bold mt-1">
                                                {cityRecyclablePercentInCategory(recyclables.map(rec => rec?.category?.id)[0], item[0]?.company?.city?.id)}
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
                        {recyclables.length > 0 &&
                            <div className='mt-10'>
                                <h3>{`Объявлениями по отходам ${recyclables.map(rec => rec?.category?.name)[0]} продажа`}</h3>
                                <FullListOfApplicationsForMainPage /*applications={apps
                                    .filter(app => +app?.recyclables?.category?.id === +recyclables
                                            .map(rec => rec?.category?.id)[0] &&
                                        app?.dealType?.id === dealTypeSelectValues[1]?.id &&
                                        app?.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)}*/></FullListOfApplicationsForMainPage>
                            </div>}
                    </div>
                    <div>
                        <MainMenuSidePanel
                            onChangeShowForm={changeShowFormHandler}
                            onChangeShowCompanies={changeShowCompaniesHandler}
                            onChangeShowApplications={changeShowApplicationsHandler}/>
                    </div>
                </div>
                <FormsModals showForm={showForm}
                             showCompanies={showCompanies}
                             showApplications={showCategories}
                             onChangeShowForm={changeShowFormHandler}
                             onChangeShowCompanies={changeShowCompaniesHandler}
                             onChangeShowApplications={changeShowApplicationsHandler}
                />
            </Container>
        </AppShell>
    )
}