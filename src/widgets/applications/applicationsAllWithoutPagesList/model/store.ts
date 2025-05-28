import {applicationModel} from '@box/entities/application';
import {attach, sample} from "effector";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {createGate} from "effector-react";

const applicationsWithPeriodWithoutPagesGate = createGate();

const getApplicationsForRecyclablePageFx = attach({
    source: {
        filters: applicationFiltersForMainPageChart.$values,
    },
    mapParams: (_, {filters}) => ({
        period: filters.period_tab?.value,

    }),
    effect: applicationModel.getAllApplicationsFx
})

sample({
    clock: [applicationsWithPeriodWithoutPagesGate.open, applicationFiltersForMainPageChart.$values],
    source: applicationFiltersForMainPageChart.$values,
    target: getApplicationsForRecyclablePageFx
})


export {
    applicationsWithPeriodWithoutPagesGate,
    getApplicationsForRecyclablePageFx
}