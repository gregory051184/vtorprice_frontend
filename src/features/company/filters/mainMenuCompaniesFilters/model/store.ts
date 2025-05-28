import {createForm} from '@box/shared/effector-forms';
import {IPillValue, ISelectValue, ITabSelectValue} from '@box/shared/ui';
import {createEvent} from 'effector';

import {DateRangePickerValue} from "@mantine/dates";
import {dealTypeSelectValues, TimeframeTypes} from '@box/entities/application';
import { companyModel } from '@box/entities/company';
import {IRegion} from "@box/entities/region/model";
import {IDistrict} from "@box/entities/district";
import {IActivityTypeAdvantage} from "@box/entities/company/model";

const mainMenuCompaniesFilters = createForm({
        fields: {
            search: {
                init: ''
            },
            created_at: {
                init: [null, null] as DateRangePickerValue
            },
            activity_types__advantages: {
                init: [] as Array<IPillValue<IActivityTypeAdvantage>>
            },
            deal_type_tab: {
                init: dealTypeSelectValues[0] as ITabSelectValue | null,
            },
            deal_type_select: {
                init: null as ISelectValue | null,
            },
            urgency_type_tab: {
                init: null as ITabSelectValue | null,
            },
            //Добавил чтобы не было дефолтного значения если использовать select
            urgency_type_select: {
                init: null as ISelectValue | null,
            },
            recyclables: {
                init: null as ISelectValue | null
            },
            price__gte: {
                init: ''
            },
            price__lte: {
                init: ''
            },
            total_weight__gte: {
                init: ''
            },
            total_weight__lte: {
                init: ''
            },
            city: {
                init: null as ISelectValue | null
            },
            region: {
                init: null as ISelectValue<IRegion> | null
            },
            district: {
                init: null as ISelectValue<IDistrict> | null
            },
            status: {
                init: null as ITabSelectValue | null
            },
            period: {
                init: null as ISelectValue | null
            },
            period_tab: {
                init: TimeframeTypes[0] as ITabSelectValue | null
            },

            nds: {
                init: null as ISelectValue | null
            },

            bale_weight__gte: {
                init: ''
            },

            bale_weight__lte: {
                init: ''
            },

            weediness__gte: {
                init: ''
            },

            weediness__lte: {
                init: ''
            },

            moisture__gte: {
                init: ''
            },

            moisture__lte: {
                init: ''
            },

            company_activity_type: {
                init: null as ISelectValue | null
            },

            company_deals_number: {
                init: ''
            },

            company_volume: {
                init: ''
            },

            company_failed_deals: {
                init: null as ISelectValue | null
            },

            company_has_applications: {
                init: null as ISelectValue | null
            },

            company_has_supply_contract: {
                init: null as ISelectValue | null
            },

            owner_has_companies: {
                init: null as ISelectValue | null
            },

            is_jur_or_ip: {
                init: null as ISelectValue | null
            },

            companies_trust: {
                init: {

                    id: 11,
                    label: 'Не обязательно',
                    value: null,
                } as ISelectValue<number | null> | null
            },

            company_rating: {
                init: {
                    id: 10,
                    label: 'Любой',
                    value: 0,
                } as ISelectValue<number | null> | null
            },

            activity_types__rec_col_types: {
                init: null as ISelectValue<companyModel.IRecColType> | null
            },
        }
    })
;

const applyMainMenuCompaniesFilters = createEvent<void>();

export {
    mainMenuCompaniesFilters,
    applyMainMenuCompaniesFilters
};
