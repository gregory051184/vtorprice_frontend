import {applicationRecyclableStatusSelectValues, dealTypeSelectValues, TimeframeTypes} from '@box/entities/application';
import {createForm} from '@box/shared/effector-forms';
import {ISelectValue, ITabSelectValue} from '@box/shared/ui';

const appFilters = createForm({
    fields: {
        search: {
            init: ''
        },
        category: {
            init: null as ISelectValue | null
        },
        category__parent: {
            init: null as ISelectValue | null
        },
        applications__city: {
            init: null as ISelectValue | null
        },
        applications__urgency_type: {
            init: null as ISelectValue | null
        },
        application_recyclable_status: {
            init: applicationRecyclableStatusSelectValues[0]
        },
        period: {
            init: TimeframeTypes[0] as ITabSelectValue | null
        },
        deal_type: {
            init: dealTypeSelectValues[1] as ITabSelectValue | null
        },
    }
});



export {
    appFilters,
};