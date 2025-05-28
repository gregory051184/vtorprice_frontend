import {useStore} from "effector-react";
import {
    $allApplicationsWithoutPages,
    IRecyclableApplication,
    IRecyclableApplicationShortForAll
} from "@box/entities/application/model";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {useScreenSize} from "@box/shared/hooks";
import React, {useEffect, useState} from "react";
import {ISelectValue} from "@box/shared/ui";
import ReactECharts from "echarts-for-react";


type RecyclablesChartsForRecyclableCategoryPageType = {
    applications: IRecyclableApplicationShortForAll[]//IRecyclableApplication[]
}

export const RecyclablesChartsForRecyclableCategoryPage: React.FC<RecyclablesChartsForRecyclableCategoryPageType> = ({
                                                                                                                         applications
                                                                                                                     }) => {
    const apps = useStore($allApplicationsWithoutPages);
    const {fields} = useForm(applicationFiltersForMainPageChart);
    const [screenSize, satisfiess] = useScreenSize();
    const [fractionStatus, setFractionStatus] = useState<Array<ISelectValue<unknown>>>([]);

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';


    const objectsForCharts = applications?.map(app => [new Date(app.createdAt).toLocaleDateString().toString(), app?.price])

    const middlePrice = (): number => {

        const sum = //apps
            applications
                .map(app => app.price)
                .reduce((sum, i) => sum + i, 0);

        const num = applications.length//apps
        return Math.round(sum / num);
    }

    /*Добавил для переключения между отходами и гранулами*/
    useEffect(() => {
    }, [fields, apps, fractionStatus, applications, objectsForCharts]);


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
                data: objectsForCharts,
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
        <div className="mt-[30px]">
            <div className={!isMobile ? "inline-flex" : ""}>
                {!isMobile ?
                    <h3 className="w-auto text-white">

                        {
                            objectsForCharts.length > 0 &&
                            `ср. цена за ${fields?.period_tab?.value?.label === "Неделя" ? "неделю" :
                                fields?.period_tab?.value?.label.toLowerCase()} ${middlePrice(/*apps, recyclable*/)} ₽`
                        }
                    </h3> :
                    <h4 className="w-auto text-white">
                        {
                            objectsForCharts.length > 0 &&
                            `ср. цена за ${fields?.period_tab?.value?.label === "Неделя" ? "неделю" :
                                fields?.period_tab?.value?.label.toLowerCase()} ${middlePrice(/*apps, recyclable)*/)} ₽`
                        }
                    </h4>
                }
            </div>
            {applications.length > 0 &&
                <div className="w-full mt-5">
                    <ReactECharts option={options} className="w-full"/>
                </div>
            }
        </div>
    )
}

