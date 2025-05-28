import { TimeframeTypes } from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

const generateListOfOffersfilters = createForm({
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
    generateListOfOffersfilters
};