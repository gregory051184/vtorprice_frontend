import {Container, Tip} from "@box/shared/ui";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useGate, useStore} from "effector-react";
import {
    $shortRecyclablesApplicationsPrices, shortGate
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {useForm} from "@box/shared/effector-forms";
import s from "./styles.module.scss";
import {useScreenSize} from "@box/shared/hooks";
import {
    IRecyclableApplicationShortForAll
} from "@box/entities/application/model";
import classNames from "classnames";
import {
    RecyclableMainPageBuyRow,
    RecyclableMainPageRow,
    RecyclableMainPageSellRow
} from "@box/widgets/recyclable/stockMarketRecyclableTables/ui/row";
import {IRecyclableCategory} from "@box/entities/recyclable/model";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import ReactECharts from "echarts-for-react";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {VolumesType} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications";
import {IUniversal, RecyclableColorType, StockMarketRecyclableTablesType} from "@box/widgets/recyclable";


// type RecyclableColorType = {
//     recyclableCategory: IRecyclableCategory,
//     totalVolume: number,
//     percents: string,
// }
//
// interface IUniversal {
//     name: string,
//     id: number,
//     value: number
// }
//
// type StockMarketRecyclableTablesType = {
//     applications: Array<IRecyclableApplicationShortForAll>;
//     recyclableCategories: IRecyclableCategory[];
// }

export const StockMarketRecyclableTables: React.FC<StockMarketRecyclableTablesType> = ({
                                                                                           applications,
                                                                                           recyclableCategories,
                                                                                       }) => {
    const recyclables = useStore($shortRecyclablesApplicationsPrices);
    useGate(shortGate)

    const [showMore, setShowMore] = useState<number>(0);
    const [showMoreBuy, setShowMoreBuy] = useState<number>(0);
    const [showMoreSell, setShowMoreSell] = useState<number>(0);


    const [category, setCategory] = useState<IUniversal>({name: '', id: 0, value: 0});
    const [hiddeCategoryChart, setHiddeCategoryChart] = useState<boolean>(false);

    const [showCategoriesStatisticsForMobile, setShowCategoriesStatisticsForMobile] = useState<boolean>(false);
    const [showFractionBuyStatisticsForMobile, setShowFractionBuyStatisticsForMobile] = useState<boolean>(false);
    const [showFractionSellStatisticsForMobile, setShowFractionSellStatisticsForMobile] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const {fields} = useForm(mainMenuApplicationFilters);
    const router = useRouter();

    // const recyclableCategoryVolume = (categoryId: number): number => {
    //     const filtered_apps = applications.filter(app => app.recyclables.category.id === categoryId);
    //     return +(filtered_apps.map(app => app.totalWeight).reduce((sum, a) => sum + a, 0) / 1000).toFixed();
    // };


    const recyclableCategoryVolume = (categoryId: number): VolumesType => {
        const filtered_apps = applications
            .filter(app => app.recyclables.category.id === categoryId);

        const filtered_buy = applications
            .filter(app => app.recyclables.category.id === categoryId && app?.dealType?.id === BuyOrSellDeals.BUY);
        const filtered_sell = (applications
            .filter(app => app.recyclables.category.id === categoryId && app?.dealType?.id === BuyOrSellDeals.SELL));

        return {
            totalVolume: +(filtered_apps
                .map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
            buyVolume: +(filtered_buy.map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
            sellVolume: +(filtered_sell.map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
        };
    };

    /*const showFractionsHandler = (categoryId: number) => {
        if (fields.search?.value.length === 0) {
        return recyclables.filter(recyclable =>
            recyclable.category === categoryId);
        } else {
            return recyclables.filter(recyclable =>
                recyclable.name.indexOf(fields.search?.value) > -1
            )
        }
    };*/

    const fractionVolume = (fractionId: number) => {
        const volumeFraction = applications
            .filter(app => app.recyclables?.id === fractionId)
            .map(app => app.totalWeight / 1000)
            .reduce((sum, a) => sum + a, 0)
        return {volumeFraction: volumeFraction, fractionId: fractionId}

    }

    const showFractionsHandler = (categoryId: number) => {
        const fractions = recyclables.filter(recyclable =>
            recyclable.category === categoryId);
        const fractionSortedList = fractions
            // .filter(fraction => fractionVolume(fraction.id).volumeFraction > 0)
            .map(fraction => fraction.id === fractionVolume(fraction.id).fractionId ? {fraction: fraction, fractionVolume: fractionVolume(fraction.id).volumeFraction} : {fraction: fraction, fractionVolume: 0})
            .filter(fraction => fractionVolume(fraction.fraction.id).volumeFraction > 0)
            .sort((a, b) => b.fractionVolume - a.fractionVolume)
            .map(fraction => fraction.fraction)
        // const fList = fractions
        //     .map(fraction => fraction.id === fractionVolume(fraction.id).fractionId ? {fraction: fraction, fractionVolume: fractionVolume(fraction.id).volumeFraction} : {fraction: fraction, fractionVolume: 0})
        //     .sort((a, b) => b.fractionVolume - a.fractionVolume)
        //     .filter(fraction => fraction.fractionVolume > 0)
        return fractionSortedList
    };

    const averagePrice = (fractionId: number, str?: string) => {
        if (str) {
            let dealType: number
            if (str === "BUY") {
                dealType = BuyOrSellDeals.BUY
            }
            if (str === "SELL") {
                dealType = BuyOrSellDeals.SELL
            }
            const allBuyAppsCount = applications
                .filter(app => app.recyclables?.id === fractionId && app?.dealType?.id === dealType).length > 0 ? applications
                .filter(app => app.recyclables?.id === fractionId && app?.dealType?.id === dealType).length : 0;
            const appsSum = applications
                .filter(app => app.recyclables?.id === fractionId && app?.dealType?.id === dealType).length > 0 ? applications
                .filter(app => app.recyclables?.id === fractionId && app?.dealType?.id === dealType)
                .reduce((a, b) => a + b.price, 0) : 0;
            if (allBuyAppsCount > 0 && appsSum > 0) {
                return +(appsSum / allBuyAppsCount).toFixed(0);
            }
        }
        const allBuyAppsCount = applications
            .filter(app => app.recyclables?.id === fractionId).length > 0 ? applications
            .filter(app => app.recyclables?.id === fractionId).length : 0;
        const appsSum = applications
            .filter(app => app.recyclables?.id === fractionId).length > 0 ? applications
            .filter(app => app.recyclables?.id === fractionId)
            .reduce((a, b) => a + b.price, 0) : 0;
        if (allBuyAppsCount > 0 && appsSum > 0) {
            return +(appsSum / allBuyAppsCount).toFixed(0);
        }
        return 0
    }

    const priceStatistics = (fractionId: number, str?: string) => {
        if (str) {
            let dealType: number
            if (str === "BUY") {
                dealType = BuyOrSellDeals.BUY
            }
            if (str === "SELL") {
                dealType = BuyOrSellDeals.SELL
            }
            const currentApp = applications
                .filter(application => application.recyclables?.id === fractionId && application?.dealType?.id === dealType)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(application => application?.price)

            const devPercent = +((currentApp[0] - currentApp[currentApp.length - 1]) / currentApp[currentApp.length - 1] * 100).toFixed(2);
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
            const min_price = Math.min(...applications
                .filter(app => app?.recyclables?.id === fractionId)
                .map(app => app.price));
            const max_price = Math.max(...applications
                .filter(app => app?.recyclables?.id === fractionId)
                .map(app => app.price));
            return {
                max_price: max_price,
                min_price: min_price,
                price_rising: deviation
            }
        }
        const currentApp = applications
            .filter(application => application.recyclables?.id === fractionId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(application => application?.price)
        const devPercent = +((currentApp[0] - currentApp[currentApp.length - 1]) / currentApp[currentApp.length - 1] * 100).toFixed(2);
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
        const min_price = Math.min(...applications
            .filter(app => app?.recyclables?.id === fractionId)
            .map(app => app.price));
        const max_price = Math.max(...applications
            .filter(app => app?.recyclables?.id === fractionId)
            .map(app => app.price));
        return {
            max_price: max_price,
            min_price: min_price,
            price_rising: deviation
        }

    };

    const filtered_recyclableCategory = (str?: string): Array<RecyclableColorType> => {
        const result = []
        for (let i = 0; i < recyclableCategories.length; i++) {
            const recCat = recyclableCategories[i];
            const totalVolume = recyclableCategoryVolume(recCat.id);
            if (str) {
                let dealType: number
                if (str === "BUY") {
                    dealType = BuyOrSellDeals.BUY
                }
                if (str === "SELL") {
                    dealType = BuyOrSellDeals.SELL
                }
                const allVolume = applications
                    .filter(app => app.recyclables.category.id === recCat.id && app?.dealType?.id === dealType).length > 0 ? applications
                    .filter(app => app.recyclables.category.id === recCat.id && app?.dealType?.id === dealType)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000 : 0;
                const percents = allVolume > 0 ? `${((allVolume / totalVolume.totalVolume) * 100).toFixed(2)}%` : '--'
                result.push({
                    recyclableCategory: recCat,
                    totalVolume: {
                        totalVolume: totalVolume.totalVolume,
                        buyVolume: totalVolume.buyVolume,
                        sellVolume: totalVolume.sellVolume,
                    },
                    percents: percents
                })
            } else {
                result.push({
                    recyclableCategory: recCat,
                    totalVolume: {
                        totalVolume: totalVolume.totalVolume,
                        buyVolume: totalVolume.buyVolume,
                        sellVolume: totalVolume.sellVolume,
                    },
                    percents: '--'
                })
            }
        }
        return result.sort((a, b) => b.totalVolume.totalVolume - a.totalVolume.totalVolume);

        /*result
            .sort((a, b) => a.recyclableCategory.name
                .localeCompare(b.recyclableCategory.name));*/
    }

    //для получения категорий для графиков
    const dataCategories = (applications: IRecyclableApplicationShortForAll[]/*IRecyclableApplication[]*/) => {
        const list = []
        for (let i = 0; i < recyclableCategories.length; i++) {
            const category = {
                value: 0,
                name: recyclableCategories[i]?.name,
                id: recyclableCategories[i]?.id,
            }
            for (let j = 0; j < applications.length; j++) {
                if (!list.map(elem => elem.id).includes(category.id)) {
                    if (applications[j].recyclables?.category?.id === recyclableCategories[i]?.id) {
                        category.value += +(applications[j]?.totalWeight / 1000).toFixed()//applications[j].totalPrice ? applications[j].totalPrice : applications[j].price * applications[j].volume
                    }
                }
            }
            list.push(category);
        }
        return list;
    }

    let adaptiveLeft = '5%';
    if (!satisfies('xsm')) {
        adaptiveLeft = '10%';
    }

    const currentBuyApps = (categoryId: number) => applications
        .filter(app => app.recyclables?.category?.id === categoryId && app?.dealType?.id === BuyOrSellDeals.BUY)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt)?.getTime())
        .map(app => [new Date(app.createdAt).toLocaleDateString().toString(), (app.totalWeight / 1000).toFixed()])

    const currentSellApps = (categoryId: number) => applications
        .filter(app => app.recyclables?.category?.id === categoryId && app?.dealType?.id === BuyOrSellDeals.SELL)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt)?.getTime())
        .map(app => [new Date(app.createdAt).toLocaleDateString().toString(), (app.totalWeight / 1000).toFixed()])

    const buyOptionsForChartCreate = (item: IUniversal) => {
        const options = {
            tooltip: {},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {interval: 0, rotate: 45}
            },
            grid: {
                left: adaptiveLeft,
                right: '5%',
                bottom: '5%',
                top: '5%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    data: currentBuyApps(item.id),
                    itemStyle: {
                        color: '#399977'
                    },
                    areaStyle: {
                        color: 'rgba(57, 153, 119, 0.3)'
                    }
                }
            ]
        };
        return options
    }

    const sellOptionsForChartCreate = (item: IUniversal) => {
        const options = {
            tooltip: {},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {interval: 0, rotate: 45}
            },
            grid: {
                left: adaptiveLeft,
                right: '5%',
                bottom: '5%',
                top: '5%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    data: currentSellApps(item.id),
                    itemStyle: {
                        color: '#399977'
                    },
                    areaStyle: {
                        color: 'rgba(57, 153, 119, 0.3)'
                    }
                }
            ]
        };
        return options
    }

    useEffect(() => {
    }, [recyclableCategories, recyclables, applications, category]);

    if (isMobile) {
        return (
            <div className="w-full">
                <div>
                    {recyclables.length === 0 &&
                        <Tip>
                            <p className={s.blink_me}>
                                Вычисляем общие данные для каждой фракции, пожалуйста, подождите...
                            </p>
                        </Tip>
                    }
                </div>
                {recyclables.length > 0 &&
                    <div className='w-full'>
                        <div className="mt-9">
                            <p className={s.main_title}>
                                Статистика категорий
                            </p>
                            <div
                                onClick={() => setShowCategoriesStatisticsForMobile(!showCategoriesStatisticsForMobile)}
                                className={s.switch_button}>
                                {!showCategoriesStatisticsForMobile ?
                                    <p>Показать полностью статистику категорий</p> :
                                    <p>Скрыть статистику категорий</p>
                                }
                            </div>
                            {recyclableCategories.length > 0 &&
                                filtered_recyclableCategory()
                                    .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                                    /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                        recyclableCategory?.recyclableCategory?.name
                                            .toLowerCase()
                                            .indexOf(fields.search?.value
                                                .split(' ')[0]
                                                .toLowerCase()) > -1 : recyclableCategory)*/
                                    .slice(0, !showCategoriesStatisticsForMobile ? 3 : filtered_recyclableCategory().length - 1)
                                    .map((recyclableCategory) => (
                                        <div
                                            className={s.table}
                                            key={recyclableCategory?.recyclableCategory?.id}>
                                            <div className="inline-flex">
                                                <p
                                                    onClick={() => router.push(`/applications/category/${recyclableCategory?.recyclableCategory.id}`)}
                                                    className={s.category_title}>{recyclableCategory?.recyclableCategory?.name}
                                                </p>
                                                <p className="ml-6 text-sm mt-[3px]">
                                                    {`${recyclableCategory?.totalVolume.totalVolume} т`}
                                                </p>
                                            </div>
                                            <div>
                                                {/*ЧТОБЫ ПОКАЗЫВАЛИСЬ ВСЕ КАТЕГОРИИ НУЖНО ВЕРНУТЬ showFractionsHandler() ВО ВСЕ PageRow и поменять в них fraction тип на IRecyclableApplicationPrice*/}
                                                {showMore !== recyclableCategory.recyclableCategory?.id &&
                                                    showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                        .slice(0, 3)
                                                        .map((fraction) => (
                                                            <div>
                                                                <RecyclableMainPageRow
                                                                    fraction={fraction}
                                                                    applications={applications}
                                                                    averagePrice={averagePrice(fraction?.id)}
                                                                    priceStatistics={priceStatistics(fraction?.id).price_rising}/>
                                                                {showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length > 3 &&
                                                                    showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                        .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                        .slice(0, 3).length - 1].id === fraction?.id &&
                                                                    < button
                                                                        onClick={() => {
                                                                            setShowMore(fraction?.category)
                                                                        }}
                                                                        type="button"
                                                                        className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                        Показать всё
                                                                    </button>}
                                                            </div>
                                                        ))}

                                            </div>
                                            {showMore === recyclableCategory?.recyclableCategory?.id &&
                                                showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                    .map((fraction) => (
                                                        <div>
                                                            <RecyclableMainPageRow
                                                                fraction={fraction}
                                                                applications={applications}
                                                                averagePrice={averagePrice(fraction?.id)}
                                                                priceStatistics={priceStatistics(fraction?.id).price_rising}/>
                                                            {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                                < button
                                                                    onClick={() => {
                                                                        setShowMore(0)
                                                                    }}
                                                                    type="button"
                                                                    className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                                    Скрыть
                                                                </button>
                                                            }
                                                        </div>
                                                    ))}
                                        </div>
                                    ))}
                        </div>
                        <div className="min-w-[230px] mt-9">
                            <p className={s.main_title}>
                                Статистика покупки фракций
                            </p>
                            <div
                                onClick={() => setShowFractionBuyStatisticsForMobile(!showFractionBuyStatisticsForMobile)}
                                className={s.switch_button}>
                                {!showFractionBuyStatisticsForMobile ?
                                    <p>Показать полностью статистику покупки фракций</p> :
                                    <p>Скрыть статистику покупки фракций</p>
                                }
                            </div>
                            {recyclableCategories.length > 0 && filtered_recyclableCategory('BUY')
                                /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                    recyclableCategory?.recyclableCategory?.name
                                        .toLowerCase().indexOf(fields.search?.value.split(' ')[0]
                                        .toLowerCase()) > -1 : recyclableCategory)*/
                                .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                                .slice(0, !showFractionBuyStatisticsForMobile ? 3 : filtered_recyclableCategory('BUY').length - 1)
                                .map((recyclableCategory) => (
                                    <div
                                        className={s.table}
                                        key={recyclableCategory?.recyclableCategory?.id}>
                                        <div className="inline-flex">
                                            <p className={s.category_title}>
                                                {`${recyclableCategory?.recyclableCategory?.name} Покупка`}
                                            </p>
                                            <p className="text-sm mt-[3px] ml-4">
                                                {`${recyclableCategory?.totalVolume.buyVolume} т`}
                                            </p>
                                            <p className="ml-4 text-sm mt-[3px]">
                                                {`${recyclableCategory?.percents}`}
                                            </p>
                                        </div>
                                        <div>
                                            {showMoreBuy !== recyclableCategory?.recyclableCategory?.id &&
                                                showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                    .slice(0, 3)
                                                    .map((fraction) => (
                                                        <div>
                                                            <RecyclableMainPageBuyRow
                                                                fraction={fraction}
                                                                applications={applications}
                                                                averagePrice={averagePrice(fraction?.id, 'BUY')}
                                                                priceStatistics={priceStatistics(fraction?.id, 'BUY').price_rising}/>

                                                            {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                    .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                    .slice(0, 3).length - 1].id === fraction?.id &&
                                                                < button
                                                                    onClick={() => {
                                                                        setShowMoreBuy(fraction?.category)
                                                                    }}
                                                                    type="button"
                                                                    className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                    Показать всё
                                                                </button>}
                                                        </div>
                                                    ))}

                                        </div>
                                        {showMoreBuy === recyclableCategory.recyclableCategory?.id &&
                                            showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                .map((fraction) => (
                                                    <div>
                                                        <RecyclableMainPageBuyRow
                                                            fraction={fraction}
                                                            applications={applications}
                                                            averagePrice={averagePrice(fraction?.id, 'BUY')}
                                                            priceStatistics={priceStatistics(fraction?.id, 'BUY').price_rising}/>

                                                        {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                            < button
                                                                onClick={() => {
                                                                    setShowMoreBuy(0)
                                                                }}
                                                                type="button"
                                                                className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                                Свернуть
                                                            </button>
                                                        }
                                                    </div>
                                                ))}
                                    </div>
                                ))}
                        </div>
                        <div className="min-w-[230px] mt-9">
                            <p className={s.main_title}>
                                Статистика продажи фракций
                            </p>
                            <div
                                onClick={() => setShowFractionSellStatisticsForMobile(!showFractionSellStatisticsForMobile)}
                                className={s.switch_button}>
                                {!showFractionBuyStatisticsForMobile ?
                                    <p>Показать полностью статистику продажи фракций</p> :
                                    <p>Скрыть статистику продажи фракций</p>
                                }
                            </div>
                            {recyclableCategories.length > 0 && filtered_recyclableCategory('SELL')
                                /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                    recyclableCategory?.recyclableCategory?.name
                                        .toLowerCase()
                                        .indexOf(fields.search?.value.split(' ')[0]
                                            .toLowerCase()) > -1 : recyclableCategory)*/
                                .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                                .slice(0, !showFractionSellStatisticsForMobile ? 3 : filtered_recyclableCategory('SELL').length - 1)
                                .map((recyclableCategory) => (
                                    <div
                                        className={s.table}
                                        key={recyclableCategory?.recyclableCategory?.id}>
                                        <div className="inline-flex">
                                            <p className={s.category_title}>
                                                {`${recyclableCategory?.recyclableCategory?.name} Продажа`}
                                            </p>
                                            <p className="text-sm mt-[3px] ml-4">
                                                {`${recyclableCategory?.totalVolume.sellVolume} т`}
                                            </p>
                                            <p className="ml-4 text-sm mt-[3px]">
                                                {`${recyclableCategory?.percents}`}
                                            </p>
                                        </div>
                                        <div>
                                            {showMoreSell !== recyclableCategory?.recyclableCategory?.id &&
                                                showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                    .slice(0, 3)
                                                    .map((fraction) => (
                                                        <div>
                                                            <RecyclableMainPageSellRow
                                                                fraction={fraction}
                                                                applications={applications}
                                                                averagePrice={averagePrice(fraction?.id, 'SELL')}
                                                                priceStatistics={priceStatistics(fraction?.id, 'SELL').price_rising}/>
                                                            {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                    .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                    .slice(0, 3).length - 1].id === fraction?.id &&
                                                                < button
                                                                    onClick={() => {
                                                                        setShowMoreSell(fraction?.category)
                                                                    }}
                                                                    type="button"
                                                                    className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                    Показать всё
                                                                </button>}
                                                        </div>
                                                    ))}

                                        </div>
                                        {showMoreSell === recyclableCategory?.recyclableCategory?.id &&
                                            showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                .map((fraction) => (
                                                    <div>
                                                        <RecyclableMainPageSellRow
                                                            fraction={fraction}
                                                            applications={applications}
                                                            averagePrice={averagePrice(fraction?.id, 'SELL')}
                                                            priceStatistics={priceStatistics(fraction?.id, 'SELL').price_rising}/>
                                                        {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                            < button
                                                                onClick={() => {
                                                                    setShowMoreSell(0)
                                                                }}
                                                                type="button"
                                                                className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                                Свернуть
                                                            </button>
                                                        }
                                                    </div>
                                                ))}
                                    </div>
                                ))}
                        </div>
                    </div>
                }

            </div>
        )
    }
    return (
        <Container>
            {!hiddeCategoryChart &&
                <div className="mt-5">
                    <BarChart
                        width={900}
                        height={300}
                        data={dataCategories(applications)}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            angle={-45}
                            height={86}
                            tickFormatter={(name) => name.length > 10 ? `${name.slice(0, 10)}...` : name}
                            textAnchor="end"
                            dataKey="name"/>

                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="value" name="объём тонн" fill="#399977"
                             onClick={e => setCategory({name: e.name, value: e.value, id: e.id})}/>
                    </BarChart>
                </div>
            }
            <div className='inline-flex w-full'>
                <div
                    onClick={() => setHiddeCategoryChart(!hiddeCategoryChart)}
                    className={s.switch_button}>
                    {!hiddeCategoryChart ?
                        <p>Скрыть графики категорий</p> :
                        <p>Показать графики категорий</p>
                    }
                </div>
                {
                    category.id > 0 &&
                    <div
                        onClick={() => setCategory({name: '', value: 0, id: 0})}
                        className={s.switch_button}>
                        <p>{`Скрыть график продажи/покупки ${category?.name}`}</p>

                    </div>
                }
            </div>
            {
                category.id > 0 &&
                <div className='inline-flex w-full mb-6'>
                    {currentSellApps(category.id).length > 0 &&
                        <div>
                            <h4 className="ml-4 mt-3">{`Покупка ${category?.name}`}</h4>
                            <ResponsiveContainer width={460} height={245}>
                                <ReactECharts option={sellOptionsForChartCreate(category)} className="w-auto"/>
                            </ResponsiveContainer>
                        </div>
                    }
                    {currentBuyApps(category.id).length > 0 &&
                        <div>
                            <h4 className="ml-4 mt-3">{`Продажа ${category?.name}`}</h4>
                            <ResponsiveContainer width={460} height={245} className="ml-6">
                                <ReactECharts option={buyOptionsForChartCreate(category)} className="w-auto"/>
                            </ResponsiveContainer>
                        </div>
                    }
                </div>
            }
            <div>
                {recyclables.length === 0 &&
                    <Tip>
                        <p className={s.blink_me}>
                            Вычисляем общие данные для каждой фракции, пожалуйста, подождите...
                        </p>
                    </Tip>
                }
            </div>
            {recyclables.length > 0 &&
                <div className='w-full flex-wrap inline-flex mt-7'>
                    <div>
                        <p className={s.category_title}>
                            Общие
                        </p>
                        {recyclableCategories.length > 0 && filtered_recyclableCategory()
                            /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                recyclableCategory?.recyclableCategory?.name.toLowerCase().indexOf(fields.search?.value
                                    .split(' ')[0]
                                    .toLowerCase()) > -1 : recyclableCategory)*/
                            .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                            .map((recyclableCategory) => (
                                <div
                                    className={s.table}
                                    key={recyclableCategory?.recyclableCategory?.id}>
                                    <div className="inline-flex">
                                        <p
                                            onClick={() => router.push(`/applications/category/${recyclableCategory?.recyclableCategory.id}`)}
                                            className={s.category_title}>{recyclableCategory?.recyclableCategory?.name}
                                        </p>
                                        <p className="ml-6 text-sm mt-[3px]">
                                            {`${recyclableCategory?.totalVolume.totalVolume} т`}
                                        </p>
                                    </div>
                                    <div>
                                        {/*ЧТОБЫ ПОКАЗЫВАЛИСЬ ВСЕ КАТЕГОРИИ НУЖНО ВЕРНУТЬ showFractionsHandler() ВО ВСЕ PageRow и поменять в них fraction тип на IRecyclableApplicationPrice*/}
                                        {showMore !== recyclableCategory.recyclableCategory?.id &&
                                            showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                .slice(0, 3)
                                                .map((fraction) => (
                                                    <div>
                                                        <RecyclableMainPageRow
                                                            fraction={fraction}
                                                            applications={applications}
                                                            averagePrice={averagePrice(fraction?.id)}
                                                            priceStatistics={priceStatistics(fraction?.id).price_rising}/>
                                                        {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3).length - 1].id === fraction?.id &&
                                                            < button
                                                                onClick={() => {
                                                                    setShowMore(fraction?.category)
                                                                }}
                                                                type="button"
                                                                className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                Показать все
                                                            </button>}
                                                    </div>
                                                ))}

                                    </div>
                                    {showMore === recyclableCategory?.recyclableCategory?.id &&
                                        showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                            .map((fraction) => (
                                                <div>
                                                    <RecyclableMainPageRow
                                                        fraction={fraction}
                                                        applications={applications}
                                                        averagePrice={averagePrice(fraction?.id)}
                                                        priceStatistics={priceStatistics(fraction?.id).price_rising}/>
                                                    {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                        < button
                                                            onClick={() => {
                                                                setShowMore(0)
                                                            }}
                                                            type="button"
                                                            className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                            Скрыть
                                                        </button>
                                                    }
                                                </div>
                                            ))}
                                </div>
                            ))}
                    </div>
                    <div className="min-w-[230px]">
                        <p className={s.category_title}>
                            Покупка
                        </p>
                        {recyclableCategories.length > 0 && filtered_recyclableCategory('BUY')
                            /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                recyclableCategory?.recyclableCategory?.name
                                    .toLowerCase().indexOf(fields.search?.value.split(' ')[0]
                                    .toLowerCase()) > -1 : recyclableCategory)*/
                            .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                            .map((recyclableCategory) => (
                                <div
                                    className={s.table}
                                    key={recyclableCategory?.recyclableCategory?.id}>
                                    <div className="inline-flex">
                                        <p className="text-sm mt-[3px]">
                                            {`${recyclableCategory?.totalVolume.buyVolume} т`}
                                        </p>
                                        <p className="ml-4 text-sm mt-[3px]">
                                            {`${recyclableCategory?.percents}`}
                                        </p>
                                    </div>
                                    <div>
                                        {showMore !== recyclableCategory?.recyclableCategory?.id &&
                                            showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                .slice(0, 3)
                                                .map((fraction) => (
                                                    <div>
                                                        <RecyclableMainPageBuyRow
                                                            fraction={fraction}
                                                            applications={applications}
                                                            averagePrice={averagePrice(fraction?.id, 'BUY')}
                                                            priceStatistics={priceStatistics(fraction?.id, 'BUY').price_rising}/>

                                                        {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3).length - 1].id === fraction?.id &&
                                                            < button
                                                                onClick={() => {
                                                                    setShowMore(fraction?.category)
                                                                }}
                                                                type="button"
                                                                className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                ...
                                                            </button>}
                                                    </div>
                                                ))}

                                    </div>
                                    {showMore === recyclableCategory.recyclableCategory?.id &&
                                        showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                            .map((fraction) => (
                                                <div>
                                                    <RecyclableMainPageBuyRow
                                                        fraction={fraction}
                                                        applications={applications}
                                                        averagePrice={averagePrice(fraction?.id, 'BUY')}
                                                        priceStatistics={priceStatistics(fraction?.id, 'BUY').price_rising}/>

                                                    {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                        < button
                                                            onClick={() => {
                                                                setShowMore(0)
                                                            }}
                                                            type="button"
                                                            className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                            ...
                                                        </button>
                                                    }
                                                </div>
                                            ))}
                                </div>
                            ))}
                    </div>
                    <div className="min-w-[230px]">
                        {<h4
                            className={s.category_title}>Продажа
                        </h4>}
                        {recyclableCategories.length > 0 && filtered_recyclableCategory('SELL')
                            /*.filter(recyclableCategory => fields.search?.value.length > 0 ?
                                recyclableCategory?.recyclableCategory?.name
                                    .toLowerCase()
                                    .indexOf(fields.search?.value.split(' ')[0]
                                        .toLowerCase()) > -1 : recyclableCategory)*/
                            .filter(recyclableCategory => recyclableCategory.totalVolume.totalVolume > 0)
                            .map((recyclableCategory) => (
                                <div
                                    className={s.table}
                                    key={recyclableCategory?.recyclableCategory?.id}>
                                    <div className="inline-flex">
                                        <p className="text-sm mt-[3px]">
                                            {`${recyclableCategory?.totalVolume.sellVolume} т`}
                                        </p>
                                        <p className="ml-4 text-sm mt-[3px]">
                                            {`${recyclableCategory?.percents}`}
                                        </p>
                                    </div>
                                    <div>
                                        {showMore !== recyclableCategory?.recyclableCategory?.id &&
                                            showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                .slice(0, 3)
                                                .map((fraction) => (
                                                    <div>
                                                        <RecyclableMainPageSellRow
                                                            fraction={fraction}
                                                            applications={applications}
                                                            averagePrice={averagePrice(fraction?.id, 'SELL')}
                                                            priceStatistics={priceStatistics(fraction?.id, 'SELL').price_rising}/>
                                                        {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                                                .slice(0, 3).length - 1].id === fraction?.id &&
                                                            < button
                                                                onClick={() => {
                                                                    setShowMore(fraction?.category)
                                                                }}
                                                                type="button"
                                                                className={classNames(s.button, 'bg-grey-10 rounded-md text-sm font-semibold mt-4 ml-24 pl-1 pr-1')}>
                                                                ...
                                                            </button>}
                                                    </div>
                                                ))}

                                    </div>
                                    {showMore === recyclableCategory?.recyclableCategory?.id &&
                                        showFractionsHandler(recyclableCategory?.recyclableCategory?.id)
                                            .map((fraction) => (
                                                <div>
                                                    <RecyclableMainPageSellRow
                                                        fraction={fraction}
                                                        applications={applications}
                                                        averagePrice={averagePrice(fraction?.id, 'SELL')}
                                                        priceStatistics={priceStatistics(fraction?.id, 'SELL').price_rising}/>
                                                    {showFractionsHandler(recyclableCategory?.recyclableCategory?.id)[showFractionsHandler(recyclableCategory?.recyclableCategory?.id).length - 1].id === fraction?.id &&
                                                        < button
                                                            onClick={() => {
                                                                setShowMore(0)
                                                            }}
                                                            type="button"
                                                            className={classNames(s.button, 'bg-grey-10 rounded-md text-sm mt-4 font-semibold ml-24 pl-1 pr-1')}>
                                                            ...
                                                        </button>
                                                    }
                                                </div>
                                            ))}
                                </div>
                            ))}
                    </div>
                </div>}
        </Container>
    )
}