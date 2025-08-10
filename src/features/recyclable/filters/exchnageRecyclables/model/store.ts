import {createForm} from '@box/shared/effector-forms';
import {ISelectValue, ITabSelectValue} from '@box/shared/ui';
import {urgencyTypeSelectValues} from '@box/entities/application';

const filters = createForm({
    fields: {
        search: {
            init: ''
        },
        urgency_type: {
            init: urgencyTypeSelectValues[0] as ITabSelectValue | null
        },
        category: {
            init: null as ISelectValue | null
        },
        region: {
            init: null as ISelectValue | null
        },
        district: {
            init: null as ISelectValue | null
        }
    }
});

export {
    filters
};
