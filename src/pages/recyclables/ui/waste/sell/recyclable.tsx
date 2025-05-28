import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import React, {useEffect} from "react";
import {AppShell} from "@box/layouts";
import {BackButton, Container, Select} from "@box/shared/ui";
import {useGate, useStore} from "effector-react";
import {$recyclable} from "@box/entities/recyclable/model";
import {
    $allApplicationsWithoutPages, $applications,
    IRecyclableApplication, IRecyclableApplicationShortForAll
} from "@box/entities/application/model";
import s from "@box/pages/recyclables/ui/style.module.scss";
import {useRouter} from "next/router";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {
    RecyclablesChartsForRecyclableCategoryPage,
} from "@box/widgets/recyclable/recyclablesForRecyclablePage/ui";
import {
    FullListOfApplicationsForMainPage
} from "@box/widgets/applications/applicationsListForMainPage/ui/fullListOfApplicationsForMainPage";
import {applicationRecyclableStatusSelectValues, dealTypeSelectValues, TimeframeTypes} from "@box/entities/application";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {gate} from "@box/widgets/applications/applicationsListForMainPage";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {useScreenSize} from "@box/shared/hooks";

interface ISubCategoriesForChart {
    name: string,
    volume: number,
    companies: Array<any>,
    price: number,
}


export const ApplicationsAndCompaniesByRecyclableWasteSell = () => {
    const applications = useStore($allApplicationsWithoutPages);
    const recyclable = useStore($recyclable);
    const apps = useStore($applications)
    const router = useRouter();
    const f = useForm(applicationFiltersForMainPageChart);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const filteredRecFixed = () => {
        return applications
            .filter(app => app?.dealType?.id === BuyOrSellDeals.SELL &&
                app?.recyclables?.id === recyclable?.id &&
                !app?.recyclables?.name.toLowerCase().split(' ').includes('гранула'))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt)?.getTime())
    }

    const cityRecyclableCategoryVolume = (categoryId: number, cityId: number): number => {
        const filtered_apps = applications.filter(app => app?.recyclables?.id === categoryId && app?.company?.city?.id === cityId &&
            app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    }

    const cityRecyclablePercentInCategory = (categoryId: number, cityId: number): string => {
        const filtered_apps_volume = +(applications
            .filter(app => app?.recyclables?.id === categoryId && app?.company?.city?.id === cityId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app.totalWeight)
            .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
        const filtered_apps = +(applications
            .filter(app => app?.recyclables?.id === categoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app.totalWeight)
            .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
        return `${(filtered_apps_volume / filtered_apps * 100).toFixed(2)} %`
    }

    const companyApplicationsVolume = (companyId: number) => {
        const filtered_apps = applications.filter(app =>
            //@ts-ignore
            app?.company?.id === companyId && app?.recyclables?.id === recyclable.id &&
            app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id);
        return (filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    }

    const companies = (apps: IRecyclableApplicationShortForAll[]/*IRecyclableApplication[]*/, subCategoryId: number) => {
        const list: Array<ISubCategoriesForChart> = [
            {name: 'Переработчик', volume: 0, companies: [], price: 0},
            {name: 'Сборщик', volume: 0, companies: [], price: 0},
            {name: 'Покупатель', volume: 0, companies: [], price: 0}
        ];

        const citiesInApplications = apps
            .filter(app => app?.recyclables?.id === subCategoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)
            .map(app => app?.company?.city?.id)
            .reduce((result: Array<any>, item: number) => {
                return result.includes(item) ? result : [...result, item];
            }, []);

        const comp = apps
            //@ts-ignore
            .filter(app => app.recyclables?.id === subCategoryId &&
                app?.dealType?.id === dealTypeSelectValues[1]?.id && app.applicationRecyclableStatus?.id === applicationRecyclableStatusSelectValues[0]?.id)

        const processor = [];
        const buyer = [];
        const importer = [];

        for (let j = 0; j < comp.length; j++) {
            if (comp[j].dealType?.id === BuyOrSellDeals.BUY
                && comp[j]?.recyclables?.name.toLowerCase().split(' ').includes('гранула')
                && !list[2].companies.map(com => com?.company?.id).includes(comp[j]?.company?.id)) {
                buyer.push(comp[j].company);
                list[2].volume += 1;
                list[2].price = +(apps.filter(app =>
                    app?.dealType?.id === BuyOrSellDeals.BUY && app?.recyclables?.name.toLowerCase().split(' ').includes('гранула') &&
                    app?.recyclables?.id === recyclable?.id)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
            }

            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && comp[j]?.recyclables?.name.toLowerCase().split(' ').includes('гранула')
                && !list[0]?.companies.map(com => com?.company?.id).includes(comp[j]?.company?.id)) {
                list[0].volume += 1;
                processor.push(comp[j]?.company)
                list[0].price = +(apps.filter(app =>
                    app?.dealType?.id === BuyOrSellDeals.SELL && app?.recyclables?.name.toLowerCase().split(' ').includes('гранула') &&
                    app?.recyclables?.id === recyclable?.id)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && !comp[j]?.recyclables?.name.toLowerCase().split(' ').includes('гранула')
                && !list[1]?.companies.map(com => com?.company?.id).includes(comp[j]?.company?.id)) {
                list[1].volume += 1;
                importer.push(comp[j].company)
                list[1].price = +(apps.filter(app =>
                    app?.dealType?.id === BuyOrSellDeals.SELL && !app?.recyclables?.name.toLowerCase().split(' ').includes('гранула') &&
                    app?.recyclables?.id === recyclable?.id)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.BUY
                && !comp[j]?.recyclables?.name.toLowerCase().split(' ').includes('гранула')
                && !list[0].companies.map(com => com?.company?.id).includes(comp[j]?.company?.id)) {
                list[0].volume += 1;
                processor.push(comp[j].company)
                list[0].price = +(apps.filter(app =>
                    app?.dealType?.id === BuyOrSellDeals.BUY && !app?.recyclables?.name.toLowerCase().split(' ').includes('гранула') &&
                    app?.recyclables?.id === recyclable?.id)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000).toFixed();
            }

        }

        for (let i = 0; i < citiesInApplications.length; i++) {
            const cityId = citiesInApplications[i]

            list[2].companies.push(buyer.filter(company => company?.city?.id === cityId).map(company => ({
                company: company,
                totalVolume: companyApplicationsVolume(+company?.id)
            })).filter((o, index, arr) =>
                arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
            ))

            list[0].companies.push(processor.filter(company => company?.city?.id === cityId).map(company => ({
                company: company,
                totalVolume: companyApplicationsVolume(+company?.id)
            })).filter((o, index, arr) =>
                arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
            ))

            list[1].companies.push(importer.filter(company => company?.city?.id === cityId).map(company => ({
                company: company,
                totalVolume: companyApplicationsVolume(+company?.id)
            })).filter((o, index, arr) =>
                arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
            ))
        }
        return list;
    }

    const totalVolume = () => {
        return `${filteredRecFixed()
            .map(app => app.totalWeight)
            .reduce((sum, a) => sum + a, 0)} т`;
    }

    const deviationPercent = () => {
        const devPercent = +((filteredRecFixed()[filteredRecFixed().length - 1]?.price - filteredRecFixed()[0]?.price) /
            filteredRecFixed()[0]?.price * 100).toFixed(2);
        let deviation = "";
        if (devPercent) {
            switch (true) {
                case devPercent > 0:
                    deviation = `▲ ${Math.abs(devPercent)}%`;
                    break;
                case devPercent < 0:
                    deviation = `▼ ${Math.abs(devPercent)}%`;
                    break;
                default:
                    deviation = `▼ ${Math.abs(devPercent)}%`;
            }
        } else {
            deviation = '--';
        }
        return deviation
    }

    const deviationRubles = () => {
        const devRub = +((filteredRecFixed()[filteredRecFixed().length - 1]?.price -
            filteredRecFixed()[0]?.price));
        let deviation = "";
        if (devRub) {
            switch (true) {
                case devRub > 0:
                    deviation = `▲ ${Math.abs(devRub)}₽`;
                    break;
                case devRub < 0:
                    deviation = `▼ ${Math.abs(devRub)}₽`;
                    break;
                default:
                    deviation = `▼ ${Math.abs(devRub)}₽`;
            }
        } else {
            deviation = '--';
        }
        return deviation
    }

    const middlePrice = (): string => {
        if (filteredRecFixed().length > 0) {
            const sum = //apps
                filteredRecFixed()
                    .map(app => app.price)
                    .reduce((sum, i) => sum + i, 0);

            const num = filteredRecFixed().length//apps
            return `${Math.round(sum / num)}₽`;
        } else {
            return '--'
        }
    }

    //useGate(applicationsWithPeriodWithoutPagesGate);
    useGate(gate);
    useEffect(() => {
    }, [recyclable, applications, apps]);

    if (isMobile) {
        return (
            <AppShell
                header={<Header/>}
                footer={<Footer/>}
            >
                <Head>
                    <title>{recyclable?.id ? `Продажа отходы (${recyclable?.name})` : 'Продажа отходы'}</title>
                </Head>
                <Container>
                    <BackButton/>
                    <div className="mt-6">
                        <h1>{recyclable?.id ? `Продажа отходы (${recyclable?.name})` : 'Продажа отходы'}</h1>
                        <div className={'w-auto mt-6'}>
                            <Select
                                inputProps={{mode: "stroke"}}
                                placeholder={'Период'}
                                className="w-200"
                                onSelect={f.fields.period_tab.onChange}
                                data={TimeframeTypes}
                                value={f.fields.period_tab.value}
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
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div>
                                    <h3>Пос. цена</h3>
                                    <p className="mt-2">
                                        {filteredRecFixed()[filteredRecFixed().length - 1]?.price ?
                                            `${filteredRecFixed()[filteredRecFixed().length - 1]?.price}₽` : '--'
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div className='ml-12'>
                                    <h3>Объявлений</h3>
                                    <p className="mt-2">
                                        {
                                            filteredRecFixed().length
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div className='ml-12'>
                                    <h3>Изм. ₽</h3>
                                    <p className="mt-2">
                                        {
                                            deviationRubles()
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div className='ml-12'>
                                    <h3>Изм. %</h3>
                                    <p className="mt-2">
                                        {
                                            deviationPercent()
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div className='ml-12'>
                                    <h3>Средняя цена</h3>
                                    <p className="mt-2">
                                        {
                                            middlePrice()
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide
                                className={s.category_main_page_slider}>
                                <div className='ml-12'>
                                    <h3>Объём</h3>
                                    <p className="mt-2">
                                        {
                                            totalVolume()
                                        }
                                    </p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
                    </div>
                    <div className='mt-7'>
                        {(recyclable?.id && filteredRecFixed().length > 0) &&
                            <RecyclablesChartsForRecyclableCategoryPage applications={
                                filteredRecFixed()}></RecyclablesChartsForRecyclableCategoryPage>
                        }
                    </div>
                    {(recyclable?.id && filteredRecFixed().length > 0) &&
                        <div className='mt-7'>
                            <h3>{`Компании с объявлениями по продаже отходов ${recyclable?.name}`}</h3>
                            {
                                //@ts-ignore
                                companies(filteredRecFixed(), recyclable?.id).map(item => (
                                    <div
                                        className={s.companies_list}
                                        key={item?.companies[0]?.company?.city?.id}>
                                        {<div>
                                            <h3 className='font-bold'>
                                                {item?.name}
                                            </h3>
                                            {item?.companies.map(companies => (
                                                <div className='w-44 inline-flex flex-wrap p-1 mt-3'>
                                                    {companies[0]?.company?.city?.name.length > 0 &&
                                                        <div>
                                                            <div className="font-bold">
                                                                <h4>
                                                                    <div
                                                                        title={companies[0]?.company?.city?.name}
                                                                        className="w-[172px] overflow-ellipsis whitespace-nowrap overflow-hidden">
                                                                        {companies[0]?.company?.city?.name}
                                                                    </div>
                                                                </h4>

                                                            </div>
                                                            <div className="inline-flex font-bold mt-1">
                                                                <h4>
                                                                    {
                                                                        //@ts-ignore
                                                                        `${cityRecyclableCategoryVolume(recyclable?.id, companies[0]?.company?.city?.id)} т`}
                                                                </h4>
                                                                <h4 className="ml-2">
                                                                    {
                                                                        //@ts-ignore
                                                                        cityRecyclablePercentInCategory(recyclable?.id, companies[0]?.company?.city?.id)}
                                                                </h4>
                                                            </div>
                                                        </div>}
                                                    {companies.length > 0 &&
                                                        //@ts-ignore
                                                        companies.map(elem => (
                                                            <div>
                                                                <div
                                                                    onClick={() => router.push(`/companies/${elem?.company?.id}`)}
                                                                    className={s.company_title}>
                                                                    <p>{elem?.company?.name}</p>
                                                                    <p>{`${elem?.totalVolume} т`}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>))}
                                        </div>}
                                    </div>
                                ))}
                        </div>}
                    {(recyclable?.id && filteredRecFixed().length > 0) &&
                        <div className='mt-10'>
                            <h3>{
                                //@ts-ignore
                                `Объявлениями по продаже отходов ${recyclable?.name}`}</h3>
                            <FullListOfApplicationsForMainPage></FullListOfApplicationsForMainPage>
                        </div>}
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
                <title>{recyclable?.id ? `Продажа отходов (${recyclable?.name})` : 'Продажа отходов'}</title>
            </Head>
            <Container>
                <BackButton/>
                <div className="inline-flex mt-6">
                    <h1>{recyclable?.id ? `Продажа отходов (${recyclable?.name})` : 'Продажа отходов'}</h1>
                    <div className={'w-auto ml-36'}>
                        <Select
                            inputProps={{mode: "stroke"}}
                            placeholder={'Период'}
                            className="w-200"
                            onSelect={f.fields.period_tab.onChange}
                            data={TimeframeTypes}
                            value={f.fields.period_tab.value}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className='inline-flex flex-wrap ml-12'>
                        <div>
                            <h3>Пос. цена</h3>
                            <p className="mt-2">
                                {filteredRecFixed()[filteredRecFixed().length - 1]?.price ?
                                    `${filteredRecFixed()[filteredRecFixed().length - 1]?.price}₽` : '--'
                                }
                            </p>
                        </div>
                        <div className='ml-12'>
                            <h3>Объявлений</h3>
                            <p className="mt-2">
                                {
                                    filteredRecFixed().length
                                }
                            </p>
                        </div>
                        <div className='ml-12'>
                            <h3>Изм. ₽</h3>
                            <p className="mt-2">
                                {
                                    deviationRubles()
                                }
                            </p>
                        </div>
                        <div className='ml-12'>
                            <h3>Изм. %</h3>
                            <p className="mt-2">
                                {
                                    deviationPercent()
                                }
                            </p>
                        </div>
                        <div className='ml-12'>
                            <h3>Средняя цена</h3>
                            <p className="mt-2">
                                {
                                    middlePrice()
                                }
                            </p>
                        </div>
                        <div className='ml-12'>
                            <h3>Объём</h3>
                            <p className="mt-2">
                                {
                                    totalVolume()
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className='mt-7'>
                    {(recyclable?.id && filteredRecFixed().length > 0) &&
                        <RecyclablesChartsForRecyclableCategoryPage applications={
                            filteredRecFixed()}></RecyclablesChartsForRecyclableCategoryPage>}
                </div>
                {(recyclable?.id && filteredRecFixed().length > 0) && <div className='mt-7'>
                    <h3>{`Компании с объявлениями по продаже ${recyclable?.name}`}</h3>
                    {
                        //@ts-ignore
                        companies(filteredRecFixed(), recyclable?.id).map(item => (
                            <div
                                className={s.companies_list}
                                key={item?.companies[0]?.company?.city?.id}>
                                {<div>
                                    <h3 className='font-bold'>
                                        {item?.name}
                                    </h3>
                                    {item?.companies.map(companies => (
                                        <div className='w-44 inline-flex flex-wrap p-1 mt-3'>
                                            {companies[0]?.company?.city?.name.length > 0 &&
                                                <div>
                                                    <div className="font-bold">
                                                        <h4>
                                                            <div
                                                                title={companies[0]?.company?.city?.name}
                                                                className="w-[172px] overflow-ellipsis whitespace-nowrap overflow-hidden">
                                                                {companies[0]?.company?.city?.name}
                                                            </div>
                                                        </h4>

                                                    </div>
                                                    <div className="inline-flex font-bold mt-1">
                                                        <h4>
                                                            {
                                                                //@ts-ignore
                                                                `${cityRecyclableCategoryVolume(recyclable?.id, companies[0]?.company?.city?.id)} т`}
                                                        </h4>
                                                        <h4 className="ml-2">
                                                            {
                                                                //@ts-ignore
                                                                cityRecyclablePercentInCategory(recyclable?.id, companies[0]?.company?.city?.id)}
                                                        </h4>
                                                    </div>
                                                </div>}
                                            {companies.length > 0 &&
                                                //@ts-ignore
                                                companies.map(elem => (
                                                    <div>
                                                        <div
                                                            onClick={() => router.push(`/companies/${elem?.company?.id}`)}
                                                            className={s.company_title}>
                                                            <p>{elem?.company?.name}</p>
                                                            <p>{`${elem?.totalVolume} т`}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>))}
                                </div>}
                            </div>
                        ))}
                </div>}
                {(recyclable?.id && filteredRecFixed().length > 0) && <div className='mt-10'>
                    <h3>{
                        //@ts-ignore
                        `Объявлениями по продаже ${recyclable?.name}`}</h3>
                    <FullListOfApplicationsForMainPage
                        /*applications={apps.filter(app => app?.recyclables?.id === recyclable?.id &&
                            !recyclable?.name.toLowerCase().split(' ').includes('гранула'))}*/></FullListOfApplicationsForMainPage>
                </div>}
            </Container>
        </AppShell>
    )
}




