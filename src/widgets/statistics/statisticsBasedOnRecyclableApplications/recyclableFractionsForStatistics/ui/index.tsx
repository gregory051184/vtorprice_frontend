import React, {useEffect} from "react";
import {useGate, useStore} from "effector-react";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import {
    $shortRecyclablesApplicationsPrices,
    shortGate
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {
    RecyclableApplicationBuyForStatisticsRow, RecyclableApplicationSellForStatisticsRow
} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications/recyclableApplicationRowForStatistics";

type RecyclableApplicationsForStatisticsType = {
    categoryId: number,
    applications: IRecyclableApplicationShortForAll[],
    buy: boolean,
    sell: boolean,
}
export const RecyclableApplicationsForStatistics: React.FC<RecyclableApplicationsForStatisticsType> = ({
                                                                                                           categoryId,
                                                                                                           applications,
    buy,
                                                                                                           sell
                                                                                                       }) => {
    const recyclables = useStore($shortRecyclablesApplicationsPrices);

    const fractionVolume = (fractionId: number) => {
        const volumeFraction = applications
            .filter(app => app.recyclables?.category?.id === fractionId)
            .map(app => app.totalWeight / 1000)
            .reduce((sum, a) => sum + a, 0)
        return {volumeFraction: volumeFraction, fractionId: fractionId}
    }

    const showFractionsHandler = (categoryId: number) => {
        const fractions = recyclables.filter(recyclable =>
            recyclable.category === categoryId);
        const fractionSortedList = fractions
            .map(fraction => fraction.id === fractionVolume(fraction.id).fractionId ? {
                fraction: fraction,
                fractionVolume: fractionVolume(fraction.id).volumeFraction
            } : {fraction: fraction, fractionVolume: 0})
            .sort((a, b) => b.fractionVolume - a.fractionVolume)
            .map(fraction => fraction.fraction)
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

    useGate(shortGate);

    useEffect(() => {
    }, [recyclables, categoryId, applications]);

    return (
        <div className="w-full mt-6">
            {
                showFractionsHandler(categoryId).map(fraction => (
                    <div
                        key={fraction.id}
                        className="inline-flex">
                        {buy && <RecyclableApplicationBuyForStatisticsRow
                            fraction={fraction}
                            applications={applications}
                            averagePrice={averagePrice(fraction?.id, 'BUY')}
                            priceStatistics={priceStatistics(fraction?.id, 'BUY').price_rising}/>}
                        {sell && <RecyclableApplicationSellForStatisticsRow
                            fraction={fraction}
                            applications={applications}
                            averagePrice={averagePrice(fraction?.id, 'SELL')}
                            priceStatistics={priceStatistics(fraction?.id, 'SELL').price_rising}/>}
                    </div>
                ))
            }
        </div>
    )
}