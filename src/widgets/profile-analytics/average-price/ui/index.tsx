import { IWithClass } from "@box/types";
import classNames from "classnames";
import { gate } from '../model';
import { useGate, useStore } from 'effector-react';
import { averagePriceModel } from "@box/entities/analytics";
import { AveragePriceFilters } from "@box/features/analitics/filters/averagePriceFilter";
import s from './style.module.scss';

export const AveragePrice: React.FC<IWithClass> = ({ className }) => {
    useGate(gate);
    const averagePrice = useStore(averagePriceModel.$averagePrice);
    
    let price: any = averagePrice?.averagePrice;
    if (averagePrice?.averagePrice == undefined) {
        price = 0;
    }
    
    return (
        <div className={classNames("", className)}>
            <div className={classNames("flex justify-center items-center mt-[0px] gap-6", s.adaptiveMT)}>
                <p className="font-semibold test-center text-sm">Средняя стоимость отправленных грузов</p>
            </div>
            <div className={classNames("flex items-center flex-row gap-[40px]", s.adaptive)}>
                <AveragePriceFilters/>
                <p className={classNames("font-semibold text-xl mt-[30px]", s.adaptiveFilter)}>{price}{' ₽'}</p>
            </div>
  
        </div>
    );
};