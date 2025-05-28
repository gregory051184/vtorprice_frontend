import {IWithClass} from "@box/types";
import classNames from "classnames";
import {gate} from '@box/widgets/statistics/applications-stats/model/store';
import {useGate, useStore} from 'effector-react';
import ReactECharts from 'echarts-for-react';
import {useScreenSize} from "@box/shared/hooks";
import {$recyclablesApplicationsPrices} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {
    RecyclableApplicationPricesStatFilters
} from "@box/features/statistics/filters/recyclableApplicationPriceStatFilter";

export const ApplicationsStatsForPanel: React.FC<IWithClass> = ({className}) => {
    useGate(gate);
    const applicationsStats = useStore($recyclablesApplicationsPrices);
    const filteredPoints = applicationsStats[0]?.graph?.points?.filter((point) => point.date !== null);
    const data = filteredPoints?.map((point) => [point.date, point.value])

    let adaptiveLeft = '5%';
    const [, satisfies] = useScreenSize();
    if (!satisfies('xsm')) {
        adaptiveLeft = '10%';
    }

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
            <div className={classNames("flex items-center mt-[30px] gap-6 ml-[10px]")}>
                <h1 className="font-normal text-2xl" style={{color: 'white'}}>Количество заявок: {" "}
                    {applicationsStats[0]?.total}</h1>
            </div>
            <div className="ml-[10px]">
                <RecyclableApplicationPricesStatFilters/>
            </div>
            <div className={"w-full mt-[60px]"}>
                <ReactECharts option={options} style={{width: '100%', height: 'calc(200px + (350 - 200) * ((100vh - 700px) / (1440 - 700)))'}}/>
            </div>
        </div>
    );
};