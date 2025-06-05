import {createForm} from "@box/shared/effector-forms";
import {ISelectValue, ITabSelectValue} from "@box/shared/ui";
import {createEvent} from "effector";
import {
    applicationRecyclableStatusSelectValues, companyActivityTypesSelectValues,
    TimeframeTypes,
    urgencyTypeSelectValues
} from "@box/entities/application";

const applicationFiltersForMainPageChart = createForm({
    fields: {
        period_tab: {
            init: TimeframeTypes[1] as ITabSelectValue | null
        },
        application_recyclable_status: {
            init: applicationRecyclableStatusSelectValues[0] /*as ISelectValue | null,*/
        },
        application_recyclable_status_tab: {
            init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null,
        },
        company_activity_types: {
            init: null as ITabSelectValue | null,
        }
    }
})

const applyApplicationFiltersForMainPageChart = createEvent<void>()



export {
    applicationFiltersForMainPageChart,
    applyApplicationFiltersForMainPageChart,
}