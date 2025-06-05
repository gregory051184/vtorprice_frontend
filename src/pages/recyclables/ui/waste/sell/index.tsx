import {useRouter} from "next/router";
import {useGate, useStore} from "effector-react";
import {$recyclablesCategory} from "@box/entities/category/model";
import {gate as categoryRecyclable} from "@box/entities/category/model";
import {$allApplicationsWithoutPages, $applications} from "@box/entities/application/model";
import React, {useEffect, useState} from "react";
import {
    BackButton,
    Container,
    Select,

} from "@box/shared/ui";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {useScreenSize} from "@box/shared/hooks";
import {Swiper, SwiperSlide} from "swiper/react";
import {Grid, Pagination} from "swiper";
import s from "@box/widgets/recyclableCategories/ui/styles.module.scss";
import {
    applicationRecyclableStatusSelectValues, companyActivityTypesSelectValues,
    dealTypeSelectValues, TimeframeTypes
} from "@box/entities/application";
import {NewLandingStats} from "@box/widgets/landing/landingStats/ui/newLandingStats";
import {
    FullListOfApplicationsForMainPage
} from "@box/widgets/applications/applicationsListForMainPage/ui/fullListOfApplicationsForMainPage";
import {MainMenuSidePanel} from "@box/widgets/mainMenuSidePanel";
import {IRecyclableCategory} from "@box/entities/recyclable/model";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import {AppShell} from "@box/layouts/app_shell";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {FormsModals} from "@box/widgets/formsModals";
import {gate} from "@box/widgets/applications/applicationsListForMainPage";
import classNames from "classnames";


type RecyclableColorType = {
    recyclableCategory: IRecyclableCategory,
    totalVolume: number,
}


export const RecyclablesWasteSell = () => {
    const router = useRouter();
    const recyclableCategories = useStore($recyclablesCategory);
    const applications = useStore($allApplicationsWithoutPages);
    const apps = useStore($applications)

    const f = useForm(applicationFiltersForMainPageChart)
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showCompanies, setShowCompanies] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const recyclableCategoryVolume = (categoryId: number): number => {
        const filtered_apps = applications
            .filter(app => app?.recyclables?.category?.id === categoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app?.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    };

    const filtered_recyclableCategory = (): Array<RecyclableColorType> => {
        const result = []
        for (let i = 0; i < recyclableCategories.length; i++) {
            const recCat = recyclableCategories[i];
            const totalVolume = recyclableCategoryVolume(recCat?.id);
            result.push({
                recyclableCategory: recCat,
                totalVolume: totalVolume,
            })
        }
        return result.sort((a, b) => b.totalVolume - a.totalVolume);
    }

    const changeShowFormHandler = () => {
        setShowForm(!showForm)
    }

    const changeShowCompaniesHandler = () => {
        setShowCompanies(!showCompanies)
    }

    const changeShowApplicationsHandler = () => {
        setShowCategories(!showCategories)
    }

    useGate(applicationsWithPeriodWithoutPagesGate);
    useGate(categoryRecyclable);
    useGate(gate);
    useEffect(() => {
    }, [recyclableCategories, applications, apps]);

    if (isMobile) {
        return (
            <AppShell
                header={<Header/>}
                footer={<Footer/>}
            >
                <Head>
                    <title>Отходы продажа</title>
                </Head>
                <Container>
                    <BackButton/>
                    <MainMenuSidePanel
                        onChangeShowForm={changeShowFormHandler}
                        onChangeShowCompanies={changeShowCompaniesHandler}
                        onChangeShowApplications={changeShowApplicationsHandler}/>
                    <div className="mt-6">
                        <h1>Отходы продажа</h1>
                        <div className="mt-6">
                            <Select
                                inputProps={{mode: "stroke"}}
                                placeholder={'Период'}
                                className="w-full"
                                onSelect={f.fields.period_tab.onChange}
                                data={TimeframeTypes}
                                value={f.fields.period_tab.value}
                            />
                            <Select
                                className="w-full"
                                withClearButton
                                inputProps={{mode: 'stroke'}}
                                value={f.fields.company_activity_types.value}
                                placeholder="Тип компании"
                                onSelect={f.fields.company_activity_types.onChange}
                                data={companyActivityTypesSelectValues}
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={15}
                            pagination={{
                                el: ".swiper-pagination",
                                type: "bullets"
                            }}
                            modules={[Pagination]}
                        >
                            {filtered_recyclableCategory().map(category =>
                                    <SwiperSlide
                                        key={category.recyclableCategory?.id}
                                        onClick={() => category?.totalVolume > 0 && router.push(`/applications/wastes/sell/category/${category?.recyclableCategory?.id}`)}
                                        className={s.category_main_page_slider}>
                                        <div>
                        <span>
                            <p className={classNames(s.category_main_page_slider_name, "text-3xl")}>
                                {category?.recyclableCategory?.name}
                            </p>
                            {category?.totalVolume > 0 &&
                                <p className={classNames(s.category_main_page_slider_name, "text-lg")}>
                                    {`${category?.totalVolume} т`}
                                </p>
                            }
                        </span>
                                        </div>
                                    </SwiperSlide>
                            )}
                        </Swiper>
                        <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
                    </div>
                    <div
                        onClick={() => router.push('/profile/favorites')}
                        className={s.switch_button}>
                        {
                            <p>Избранное</p>
                        }
                    </div>
                    <FullListOfApplicationsForMainPage></FullListOfApplicationsForMainPage>
                </Container>
            </AppShell>
        )
    }
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Отходы продажа</title>
            </Head>
            <Container>
                <BackButton/>
                <div className="inline-flex mt-6">
                    <h1>Отходы продажа</h1>
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
                <div className='inline-flex w-full'>
                    <div className='w-5/6'>
                        <div className='w-full flex-wrap'>
                            {filtered_recyclableCategory().map(item => (
                                <div
                                    onClick={() => item?.totalVolume > 0 && router.push(`/applications/wastes/sell/category/${item?.recyclableCategory?.id}`)}
                                    className={s.category_main_page}>
                        <span>
                            <p className={s.category_main_page_name}>
                                {item?.recyclableCategory?.name}
                            </p>
                            {item.totalVolume > 0 && <p className={s.category_main_page_name}>
                                {`${item?.totalVolume} т`}
                            </p>}
                        </span>
                                </div>
                            ))
                            }
                        </div>
                        <NewLandingStats></NewLandingStats>
                        <FullListOfApplicationsForMainPage /*applications={apps.filter(app =>
                            app?.dealType?.id === dealTypeSelectValues[1]?.id &&
                            app?.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)}*/></FullListOfApplicationsForMainPage>
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