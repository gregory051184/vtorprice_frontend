import React from 'react';
import ReactECharts from 'echarts-for-react';
import {ICompaniesCircleGraphics} from './types';
import {useScreenSize} from "@box/shared/hooks";


export const CompaniesCircleGraphics: React.FC<ICompaniesCircleGraphics> = ({
                                                                                className,
                                                                                companies
                                                                            }) => {
    const graphicsData = companies
        .sort((a, b) => +a?.volume - +b?.volume)
        .map((item) => ({
            name: item?.company?.name,
            value: item?.volume
        }));

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';


    // const onChartClick = (params: any) => {
    //     console.log(params);
    //
    // };
    // const onEvents = {
    //     click: onChartClick,
    // };

    if (isMobile) {
    return (
        <div className={className}>
            <ReactECharts option={{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {type: 'cross'},

                },
                series: {
                    type: 'pie',
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: graphicsData
                }
            }}
                          style={{height: 400}}
            />
        </div>
    );
    }
    return (
        <div className={className}>
            <ReactECharts option={{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {type: 'cross'},

                },
                series: {
                    type: 'pie',
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: graphicsData
                }
            }}
                          style={{height: 700}}
                // onEvents={onEvents}
            />
        </div>
    );
};
