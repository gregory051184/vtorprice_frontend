import {
    Container,
    Select,
} from "@box/shared/ui";
import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {useRouter} from "next/router";
import {useGate, useStore} from "effector-react";
import {$recyclablesCategory} from "@box/entities/category/model";
import {useScreenSize} from "@box/shared/hooks";
import s from './styles.module.scss'
import 'swiper/css';
import {$allApplicationsWithoutPages} from "@box/entities/application/model";
import {
    applicationRecyclableStatusSelectValues,
    appRecStatusSelectSellBuyValues, TimeframeTypes
} from "@box/entities/application";
import {MainMenuSidePanel} from "@box/widgets/mainMenuSidePanel";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {
    FullListOfApplicationsForMainPage
} from "@box/widgets/applications/applicationsListForMainPage/ui/fullListOfApplicationsForMainPage";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {FormsModals} from "@box/widgets/formsModals";
import {StockMarketRecyclableTables} from "@box/widgets/recyclable";
import classNames from "classnames";


export const RecyclableCategoriesListForMainPage = () => {

    const router = useRouter();
    const recyclableCategories = useStore($recyclablesCategory);
    const applications = useStore($allApplicationsWithoutPages);

    const f = useForm(applicationFiltersForMainPageChart)
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showCompanies, setShowCompanies] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const routerPathHandler = (name: string) => {
        if (name === 'Отходы покупка') {
            return '/applications/wastes/buy'
        }
        if (name === 'Отходы продажа') {
            return '/applications/wastes/sell'
        }
        if (name === 'Гранула покупка') {
            return '/applications/granule/buy'
        }
        if (name === 'Гранула продажа') {
            return '/applications/granule/sell'
        }
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

    useEffect(() => {
    }, [showForm, showCategories, showCompanies]);

    if (isMobile) {
        return (
            //Поправить стили для мобилы
            <Container>

                <div className='w-auto mt-6'>
                    <Select
                        inputProps={{mode: "stroke"}}
                        placeholder={'Период'}
                        className="w-full"
                        onSelect={f.fields.period_tab.onChange}
                        data={TimeframeTypes}
                        value={f.fields.period_tab.value}
                    />
                    <Select
                        inputProps={{mode: "stroke"}}
                        placeholder={'Тип продукции'}
                        className="w-full mt-6"
                        onSelect={f.fields.application_recyclable_status_tab.onChange}
                        data={applicationRecyclableStatusSelectValues}
                        value={f.fields.application_recyclable_status_tab.value}
                    />
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
                        {appRecStatusSelectSellBuyValues.map(item =>
                            <SwiperSlide
                                onClick={
                                    //@ts-ignore
                                    () => router.push(routerPathHandler(item.label))}
                                className={s.category_main_page_slider}>
                                <div>
                                    <p className={classNames(s.category_main_page_slider_name, "text-lg")}>
                                        {item.label}
                                    </p>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                    <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
                </div>
                <StockMarketRecyclableTables applications={applications}
                                             recyclableCategories={recyclableCategories}/>
                <div
                    onClick={() => router.push('/profile/favorites')}
                    className={s.switch_button}>
                    {
                        <p>Избранное</p>
                    }
                </div>
                <FullListOfApplicationsForMainPage></FullListOfApplicationsForMainPage>
            </Container>
        )
    }
    return (
        <Container>
            <div className={s.top_banner}>
                <div className='inline-flex'>
                    <h1 className="info_banner_title">Вторпрайс - агентство по продаже вторсырья</h1>
                </div>
                <p className="text-lg text-grey-70 mt-5 font-normal">Поможем купить или продать вторичные
                    ресурсы по
                    оптимальным ценам</p>
            </div>
            <div className="inline-flex mt-6">
                <h1>{`Категории`}</h1>
                <div className='w-auto ml-36 inline-flex'>
                    <Select
                        inputProps={{mode: "stroke"}}
                        placeholder={'Период'}
                        className="w-130"
                        onSelect={f.fields.period_tab.onChange}
                        data={TimeframeTypes}
                        value={f.fields.period_tab.value}
                    />
                    <Select
                        inputProps={{mode: "stroke"}}
                        placeholder={'Тип продукции'}
                        className="w-130 ml-5"
                        onSelect={f.fields.application_recyclable_status_tab.onChange}
                        data={applicationRecyclableStatusSelectValues}
                        value={f.fields.application_recyclable_status_tab.value}
                    />
                </div>
            </div>
            <div className='inline-flex w-full mt-6'>
                <div className='w-5/6'>
                    <div className='w-full inline-flex'>
                        {appRecStatusSelectSellBuyValues.map(item => (
                                <div
                                    className={s.select_category_status_main_page_name}
                                    onClick={
                                        //@ts-ignore
                                        () => router.push(routerPathHandler(item.label))}>
                                    {item.label}
                                </div>
                            )
                        )}
                        <div className={s.all_categories}>
                            <p>Все категории</p>
                        </div>
                    </div>
                    <StockMarketRecyclableTables applications={applications}
                                                 recyclableCategories={recyclableCategories}/>
                    <FullListOfApplicationsForMainPage></FullListOfApplicationsForMainPage>
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
    )
}