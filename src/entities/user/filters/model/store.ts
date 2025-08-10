import {createForm} from "@box/shared/effector-forms";
import {DateRangePickerValue} from "@mantine/dates";
import {ISelectValue} from "@box/shared/ui";
import {IUser} from "@box/entities/user";
import { companyModel } from "@box/entities/company";

const managersFilters = createForm({
    fields: {
        search: {
            init: ''
        },
        status: {
            init: null as ISelectValue<number | null> | null
        },

        created_at: {
            init: [null, null] as DateRangePickerValue
        },
        manager: {
            init: null as ISelectValue<IUser> | null
        },
        application__recyclables: {
            init: null as ISelectValue<companyModel.ICompanyRecyclable['recyclables']> | null
        },
    }
})

export {
    managersFilters
}