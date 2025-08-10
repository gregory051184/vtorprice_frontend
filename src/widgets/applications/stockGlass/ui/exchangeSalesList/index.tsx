import {useEvent, useGate, useStore} from "effector-react";
import {sales} from "@box/widgets/applications";
import {useLastSaleInfo} from "@box/widgets/applications/stockGlass/hooks";
import {AppCardForShortListForMainPage} from "@box/entities/application";
import React, {useEffect, useMemo} from "react";
import Empty from "@assets/icons/32_empty.svg";
import {IWithClass} from "@types";
import classNames from "classnames";
import {Button, Pagination, TabSelect} from "@box/shared/ui";
import {$graphData, $period, getGraphDataFx, selectValues, setPeriod} from "@box/pages/exchange/glass/model";
import {getGraphOptions} from "@box/pages/exchange/glass/config";
import s from "../styles/styles.module.scss";
import ReactECharts from "echarts-for-react";
import {NoGraphData} from "@box/shared/ui/noGraphData";
import {useRouter} from "next/router";
import {DeliveryCalculatorVertical} from "@box/features";

export const ExchangeSalesList: React.FC<IWithClass & { show?: boolean, active: number }> = ({
                                                                                                 className,
                                                                                                 show,
                                                                                                 active
                                                                                             }) => {
    const applications = useStore(sales?.store);
    const router = useRouter();
    const {id} = router.query;
    const period = useStore($period);
    const periodChange = useEvent(setPeriod);
    const fetchGraphData = useEvent(getGraphDataFx);
    const graphData = useStore($graphData);
    const validGraphConfig = useMemo(() => getGraphOptions(graphData), [graphData]);

    const sortedApplications = applications.result
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastSaleInfo = useLastSaleInfo(sortedApplications[0], sortedApplications[sortedApplications.length - 1]);

    let hasGraphData = true;
    if (graphData === undefined || graphData.length === 0) {
        hasGraphData = false;
    }

    const median = (values: number[]): number => {

        if (values.length === 0) {
            return 0;
        }
        const half = Math.floor(values.length / 2);

        return (values.length % 2
                ? values[half]
                : (values[half - 1] + values[half]) / 2
        );

    }

    const medianPrice = () => {
        const priceList = applications.result
            .map(application => application.price)
            .sort((a, b) => a - b)
        return median(priceList)
    }

    useGate(sales.list.gate);

    useEffect(() => {
        fetchGraphData({
            // @ts-ignore
            id: id as number,
            period: period.value,
            deal_type: active
        });
    }, [period, applications]);

    return (
        <div className={className}>

            <div className={s.top}>
                <TabSelect
                    className="my-[20px]"
                    onChange={periodChange}
                    values={selectValues}
                    value={period}

                />
                {hasGraphData && <p className='mx-auto text-center text-grey-40'>График изменения цены продажи</p>}
            </div>
            {hasGraphData && <ReactECharts option={validGraphConfig}/>}
            {!hasGraphData && <NoGraphData text={"Нет данных"}/>}
            {lastSaleInfo && (
                <div className="mt-[30px] flex justify-end items-center gap-[20px]">
                    <p className="text-grey-40">Изменение цены продажи</p>
                    <p className={classNames(lastSaleInfo.direction === 'grow' ? 'text-primaryGreen-main' : 'text-red-dark', 'text-xl font-medium')}>
                        {lastSaleInfo?.percentage.toFixed(2)}
                        %
                    </p>
                    <p className="text-grey-40">Средняя цена</p>
                    <p className="text-2xl">
                        {lastSaleInfo.price}
                        {' '}
                        ₽
                    </p>
                    <p className="text-grey-40">Рекомендуемая цена</p>
                    <p className="text-2xl">
                        {medianPrice()}
                        {' '}
                        ₽
                    </p>
                </div>
            )
            }
            {
            applications.count > 0 &&
                <div className="flex gap-4 cursor-pointer items-center float-right mt-5">
                    <p className="text-grey-50 text-sm whitespace-nowrap">Заявок</p>

                    <p>{applications.count}</p>
                </div>
            }
            {show && <div className="inline-flex">
                <div>
                    {!!applications?.result.length ?
                        applications.result
                            .map((application) => (
                                <AppCardForShortListForMainPage application={application} key={application?.id}/>)) :
                        <div className="flex justify-center my-[80px]">
                            <div className="flex flex-col items-center">
                                <Empty/>
                                <p className="mt-[20px] text-grey-50 text-sm">По вашему фильтру ничего не найдено</p>
                            </div>
                        </div>
                    }
                    <Pagination pagination={sales.list.pagination}/>
                </div>
                <div className="ml-16 mt-16">
                    {applications.result?.length > 0 &&
                        <div className={s.ordering_panel}>
                            <div className="mt-6 ml-5">
                                <Button
                                    onClick={() => router.push('/profile/favorites')}>
                                    Избранное
                                </Button>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-white ml-7">Перевозка</h3>
                                <DeliveryCalculatorVertical className="mb-[70px]"/>
                            </div>
                        </div>}
                </div>
            </div>
            }
        </div>
    )
}