import {createForm} from "@box/shared/effector-forms";
import {ISelectValue, ITabSelectValue} from "@box/shared/ui";
import {TimeframeTypes} from "@box/entities/application";

const applicationsForOffersFilters = createForm({
    fields: {
        category: {
            init: null as ISelectValue | null
        },
        period: {
            init: TimeframeTypes[0] as ITabSelectValue | null
        },
    }
});

export {
    applicationsForOffersFilters
};