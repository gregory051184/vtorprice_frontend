import { RecycablePricesFilters } from "@box/features/statistics/filters/recycablePricesFilter/ui";
import { IWithClass } from "@box/types";
import s from './style.module.scss';
import classNames from "classnames";
import { gate, pagination } from '../model';
import { Pagination } from "@box/shared/ui";
import { RecycablePriceDataCard } from "@box/entities/statistics/recycablesPrices/ui/RecycablePriceDataCard";
import { useGate, useStore } from 'effector-react';
import { recycablesPricesModel } from '@box/entities/statistics';

export const RecycablePrices: React.FC<IWithClass> = ({ className }) => {
    useGate(gate);
    const recycablesPrices = useStore(recycablesPricesModel.$recycablesPrices);
    return (
        <div className={classNames("", className)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Цены на вторсырье на основе последних сделок</h1>
            </div>
            <RecycablePricesFilters/>
            <div className={"w-full mt-[26px]"}>
                <div className={classNames("grid grid-cols-6 border-l border-t border-grey-20", s.card_view)}>
                {recycablesPrices.map((recycablePriceData) => (
                    <RecycablePriceDataCard
                    className={classNames("")}
                    key={recycablePriceData.id}
                    recycablePriceData={recycablePriceData}
                    />
                ))}
                </div>
                <Pagination pagination={pagination} />
            </div>
        </div>
    );
};