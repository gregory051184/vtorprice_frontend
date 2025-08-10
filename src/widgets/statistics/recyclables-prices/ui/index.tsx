import {RecycablePricesFilters} from "@box/features/statistics/filters/recycablePricesFilter/ui";
import {IWithClass} from "@box/types";
import s from './style.module.scss';
import classNames from "classnames";
import {gate, pagination} from '../model';
import {Pagination} from "@box/shared/ui";
import {RecycablePriceDataCard} from "@box/entities/statistics/recycablesPrices/ui/RecycablePriceDataCard";
import {useGate, useStore} from 'effector-react';
import {recycablesPricesModel} from '@box/entities/statistics';
import {
    $allApplicationsWithoutPagesForDealsStatistics,
    allApplicationsForDealsStatisticsGate
} from "@box/entities/application/model";
import {useEffect} from "react";
import {IRecycablePrice} from "@box/entities/statistics/recycablesPrices/model";

interface IFractionAppSum {
    id: number,
    sum: number,
    name: string,
}

export const RecycablePrices: React.FC<IWithClass> = ({className}) => {
    useGate(gate);
    useGate(allApplicationsForDealsStatisticsGate)
    const recyclablesPrices = useStore(recycablesPricesModel.$recycablesPrices);

    const applications = useStore($allApplicationsWithoutPagesForDealsStatistics);

    const sortHandler = () => {
        const filteredApplications = applications.filter(app => app.volume > 0)
        const list: IFractionAppSum[] = []
        const dealsList: IRecycablePrice[] = []
        for (let i = 0; i < filteredApplications.length; i++) {
            let fractionSum = 0
            const fractionId = filteredApplications[i].recyclables.id
            const fractionName = filteredApplications[i].recyclables.name
            for (let j = 0; j < filteredApplications.length; j++)
                if (filteredApplications[j].recyclables.id === fractionId) {
                    fractionSum += filteredApplications[j].volume
                }
            if (!list.map(item => item.id).includes(fractionId)) {
                list.push({id: fractionId, sum: fractionSum, name: fractionName})
            }
        }
        const sortedApplications = list.sort((a, b) => b.sum - a.sum)

        for (let i = 0; i < sortedApplications.length; i++) {
            const recyclableId = sortedApplications[i].id
            for (let j = 0; j < recyclablesPrices.length; j++) {
                if (recyclableId === recyclablesPrices[j].id) {
                    dealsList.push(recyclablesPrices[j])
                }
            }
        }
        return dealsList.filter(deal => deal.latestDealPrice > 0)
    }

    useEffect(() => {
    }, [applications, recyclablesPrices]);

    return (
        <div className={classNames("", className)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Цены на вторсырье на основе последних сделок</h1>
            </div>
            <RecycablePricesFilters/>
            <div className={"w-full mt-[26px]"}>
                <div className={classNames("grid grid-cols-6 border-l border-t border-grey-20", s.card_view)}>
                    {sortHandler().map((recyclablePriceData) => (
                        <RecycablePriceDataCard
                            className={classNames("")}
                            key={recyclablePriceData.id}
                            recycablePriceData={recyclablePriceData}
                        />
                    ))}
                </div>
                <Pagination pagination={pagination}/>
            </div>
        </div>
    );
};