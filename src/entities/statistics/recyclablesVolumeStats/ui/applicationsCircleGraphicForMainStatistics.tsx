import React, {useEffect} from 'react';
import ReactECharts from 'echarts-for-react';
import {IAdaptiveDataForMainStatistics, IGraphicsData, IRecyclablesCircleGraphicsForMainStatistics} from './types';
import classNames from 'classnames';
import {useScreenSize} from '@box/shared/hooks';



export const CompaniesStatsCircleGraphics: React.FC<IRecyclablesCircleGraphicsForMainStatistics> = ({
                                                                                                        className,
                                                                                                        data,
                                                                                                        category,
                                                                                                        subCategory,
                                                                                                        //companyType
                                                                                                    }) => {

    const categoryHandler = (cat: IGraphicsData) =>
        category(cat)


    const subCategoryHandler = (subCat: IGraphicsData) => {
        category(subCat)
    }

    // const companyTypeHandler = (companyTypeId: number) => {
    //     companyType(companyTypeId)
    // }


    const [, satisfies] = useScreenSize();

    const adaptiveData: IAdaptiveDataForMainStatistics = {
        title: {
            size: {x: '50%', y: '1%'}
            // size1: {x: '10%', y: '5%'},
            // size2: {x: '50%', y: '5%'},
            // size3: {x: '90%', y: '5%'}
        },
        pie: {
            size: {x: '50%', y: '54%'}
            //size1: {x: '10%', y: '45%'},
            //size2: {x: '50%', y: '45%'},
            //size3: {x: '90%', y: '45%'}
        }
    };
    let radius = 280;
    let adaptiveTooltip = {
        trigger: 'item',
        axisPointer: {type: 'cross'}
    };

    if (!satisfies('sm')) {
        adaptiveData.title.size = {x: '50%', y: '31%'}
        adaptiveData.pie.size = {x: '50%', y: '47%'}
        // adaptiveData.title.size1 = {x: '50%', y: '1%'};
        // adaptiveData.title.size2 = {x: '50%', y: '31%'};
        // adaptiveData.title.size3 = {x: '50%', y: '61%'};
        // adaptiveData.pie.size1 = {x: '50%', y: '17%'};
        // adaptiveData.pie.size2 = {x: '50%', y: '47%'};
        // adaptiveData.pie.size3 = {x: '50%', y: '77%'};
        radius = 125;
    }
    if (!satisfies('xsm')) {
        adaptiveData.title.size = {x: '50%', y: '29%'}
        adaptiveData.pie.size = {x: '50%', y: '43%'}
        // adaptiveData.title.size1 = {x: '50%', y: '1%'};
        // adaptiveData.title.size2 = {x: '50%', y: '29%'};
        // adaptiveData.title.size3 = {x: '50%', y: '57%'};
        // adaptiveData.pie.size1 = {x: '50%', y: '15%'};
        // adaptiveData.pie.size2 = {x: '50%', y: '43%'};
        // adaptiveData.pie.size3 = {x: '50%', y: '71%'};
        radius = 125;
        adaptiveTooltip = {
            trigger: 'item',
            axisPointer: {type: 'cross'},
            // @ts-ignore
            // eslint-disable-next-line
            position: function (pos, params, dom, rect, size) {
                // @ts-ignore
                // eslint-disable-next-line
                return ['10%', pos[1]];
            }
        };
    }

    const onChartClick = (params: any) => {
        if (params.data.subCategory) {
            subCategoryHandler({id: params.data.id, name: params.data.name, value: params.data.value})
        }
        else {
            categoryHandler({id: params.data.id, name: params.data.name, value: params.data.value})
        }

    };
    const onEvents = {
        click: onChartClick,
    };

    const g = () => {
        for (let i = 0; i < data.length; i++) {

        }
    }

    const options = {
        toolbox: {},
        tooltip: adaptiveTooltip,
        // title: [
        //     {
        //         text: 'Категории',
        //         left: adaptiveData.title.size.x,
        //         top: adaptiveData.title.size.y,
        //         textAlign: 'center'
        //     },
        // ],
        series: [
            {
                type: 'pie',
                data: data?.map(item => ({
                    value: item.value,
                    name: item.name,
                    id: item.id,
                    itemStyle: {color: item.fill}
                })),
                roseType: 'area',
                radius: [30, radius],
                center: [adaptiveData.pie.size.x, adaptiveData.pie.size.y],
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: false
                }
            },
        ]
    };

    useEffect(() => {
    }, [category, subCategory]);

    return (
        <div className={classNames("h-full", className)}>
            <ReactECharts onEvents={onEvents} option={options} style={{width: "100%", height: '640px'}}
            />
        </div>
    );
};
