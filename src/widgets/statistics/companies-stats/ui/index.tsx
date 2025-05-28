import { IWithClass } from "@box/types";
import s from './style.module.scss';
import classNames from "classnames";
import { gate } from '../model';
import { useGate, useStore } from 'effector-react';
import { companiesStatsModel } from '@box/entities/statistics';
import { CompaniesStatsCircleGraphics } from "@box/entities/statistics/companiesStats/ui";

export const CompaniesStats: React.FC<IWithClass> = ({ className }) => {
    useGate(gate);
    const сompaniesStats = useStore(companiesStatsModel.$companiesStats);

    const suppliers = сompaniesStats?.recyclingCount.filter(item => item.activityType === 1)
    .map((point) => [point.companyCount, point.name]);
    const processors = сompaniesStats?.recyclingCount.filter(item => item.activityType === 2)
    .map((point) => [point.companyCount, point.name]);
    const buyers = сompaniesStats?.recyclingCount.filter(item => item.activityType === 3)
    .map((point) => [point.companyCount, point.name]);
      
     return (
        <div className={classNames("", className)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Всего компаний: {" "} 
                {сompaniesStats?.total}</h1>
            </div>
            <div className={classNames("w-full h-[400px] mt-[20px]", s.piesHolder)}>

                  <CompaniesStatsCircleGraphics suppliers={suppliers} processors={processors} buyers={buyers}/>

            </div>
        </div>
    );
};