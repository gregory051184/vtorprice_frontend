import {IWithClass} from "@box/types";
import classNames from "classnames";
import {useGate, useStore} from 'effector-react';
import {$recyclablesCategory, gate} from "@box/entities/category/model";
import {RecyclableCategoriesForStatistics} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications";
import React from "react";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";

export const RecyclableApplicationPrices: React.FC<IWithClass> = ({className}) => {
    //useGate(gate);
    //const recyclablesApplicationsPrices = useStore(recyclablesApplicationsPricesModel.$recyclablesApplicationsPrices);
    const f = useForm(applicationFiltersForMainPageChart)
    const recyclableCategories = useStore($recyclablesCategory);
    useGate(gate)
    return (
        <div className={classNames("mt-10", className)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Цены на вторсырье в активных заявках</h1>
            </div>
            {/*<RecyclableApplicationPricesFilters/>
            <div className='w-96 mt-6'>
                <Select
                    inputProps={{mode: "stroke"}}
                    placeholder={'Период'}
                    className="w-200"
                    onSelect={f.fields.period_tab.onChange}
                    data={TimeframeTypes}
                    value={f.fields.period_tab.value}
                />
            </div>*/}
            <RecyclableCategoriesForStatistics categories={recyclableCategories}></RecyclableCategoriesForStatistics>
            {/*<div className={"w-full mt-[26px]"}>
                <div className={classNames("grid grid-cols-6 border-l border-t border-grey-20", s.card_view)}>
                    {recyclablesApplicationsPrices.sort(function (a, b) {
                        return (a.category - b.category)
                    }).map((recyclableApplicationPriceData) => (
                        <RecyclableApplicationPriceDataCard
                            className={classNames("")}
                            key={recyclableApplicationPriceData.id}
                            recyclableApplicationPriceData={recyclableApplicationPriceData}
                        />
                    ))}
                </div>
                <Pagination pagination={pagination}/>
            </div>*/}
        </div>
    );
};