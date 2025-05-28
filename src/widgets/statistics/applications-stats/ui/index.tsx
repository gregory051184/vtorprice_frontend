import { IWithClass } from "@box/types";
import s from './style.module.scss';
import classNames from "classnames";
import { gate } from '../model';
import { useGate, useStore } from 'effector-react';
import { applicationsStatsModel } from '@box/entities/statistics';
import ReactECharts from 'echarts-for-react';
import { ApplicationsStatsFilters } from "@box/features/statistics/filters/applicationsStatsFilter";
import { useScreenSize } from "@box/shared/hooks";

export const ApplicationsStats: React.FC<IWithClass> = ({ className }) => {
    useGate(gate);
    const applicationsStats = useStore(applicationsStatsModel.$applicationsStats);

    const filteredPoints = applicationsStats?.graph?.points.filter((point) => point.date !== null);
    const data = filteredPoints?.map((point) => [point.date, point.value])

    let adaptiveLeft = '5%';
    const [, satisfies] = useScreenSize();
    if (!satisfies('xsm')) { adaptiveLeft = '10%'; }
      
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
        <div className={classNames("", className, s.adaptive)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Количество выставленных заявок: {" "} 
                {applicationsStats?.total}</h1>
            </div>
            <ApplicationsStatsFilters/>
            <div className={"w-full mt-[60px]"}>

                <ReactECharts option={options} style={{ width: '100%' }}/>

            </div>
        </div>
    );
};