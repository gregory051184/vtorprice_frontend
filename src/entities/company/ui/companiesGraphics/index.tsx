import React from 'react';
import ReactECharts from 'echarts-for-react';
import {ICompaniesCircleGraphics} from './types';


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
            />
        </div>
    );
};
