import { IWithClass } from "@box/types";
import classNames from "classnames";
import { gate } from '../model';
import { useGate, useStore } from 'effector-react';
import ReactECharts from 'echarts-for-react';
import { logisticsDealsModel } from "@box/entities/analytics";
import { LogisticsDealsFilters } from "@box/features/analitics/filters/logisticsDealsFilter";
import s from './style.module.scss';
import { useScreenSize } from "@box/shared/hooks";

export const LogisticsDealsStats: React.FC<IWithClass> = ({ className }) => {
    useGate(gate);
    const logisticsDealsStats = useStore(logisticsDealsModel.$logisticsDeals);

    const filteredPoints = logisticsDealsStats?.graphData?.filter((point) => point[1] !== null);
    const data = filteredPoints?.map((point) => [point[1], point[0]])

    let adaptiveLeft = '5%';
    const [, satisfies] = useScreenSize();
    if (!satisfies('xsm')) { adaptiveLeft = '10%'; };
      
      const options = {
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: { interval: 0, rotate: 45 }
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
            data,
            itemStyle: {
                color: '#399977'
              },
              areaStyle: {
                color: 'rgba(57, 153, 119, 0.3)'
              }
          }
        ]
      };
    
    return (
        <div className={classNames("", className)}>
            <div className="flex w-full justify-center items-center mt-[30px]">
                <p className="font-semibold text-center text-sm">Количество проведенных сделок по логистике</p>
            </div>
            <LogisticsDealsFilters/>
            <div className={"w-full mt-[60px]"}>

                <ReactECharts option={options} style={{ width: '100%' }}/>

            </div>
            <div className={classNames("flex justify-between", s.adaptive)}>
                <div className={classNames("flex items-center mt-[30px] gap-6")}>
                    <p className="font-normal text-grey-40 text-sm">Общий вес:</p>
                    <p className="font-semibold text-xl">{logisticsDealsStats?.totalWeight}</p>
                </div>
                <div className={classNames("flex items-center mt-[30px] gap-6")}>
                    <p className="font-normal text-grey-40 text-sm">Общее количество отгрузок:</p>
                    <p className="font-semibold text-xl">{logisticsDealsStats?.totalCount}</p>
                </div>
                <div className={classNames("flex items-center mt-[30px] gap-6")}>
                    <p className="font-normal text-grey-40 text-sm">Общая сумма продаж:</p>
                    <p className="font-semibold text-xl">{logisticsDealsStats?.totalSum}</p>
                </div>
            </div>
        </div>
    );
};