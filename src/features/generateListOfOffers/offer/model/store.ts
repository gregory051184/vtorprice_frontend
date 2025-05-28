import {createForm} from "@box/shared/effector-forms";
import {ISelectValue} from "@box/shared/ui";
import { cityModel } from "@box/entities/city";


const dealsForOffersFilters = createForm({
    fields: {
        dealsByThisRecyclable: {
            init: null as ISelectValue<number | null> | null
        },
        lastDealDate: {
            init: null as ISelectValue<string> | null
        },
        city: {
            init: null as ISelectValue<cityModel.ICity> | null
        },
        buyAppsByThisRecyclable: {
            init: null as ISelectValue<number | null> | null
        },
        lastAppDate: {
            init: null as ISelectValue<string> | null
        }
    }
});

export {
    dealsForOffersFilters
};