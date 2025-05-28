import {createForm} from '@box/shared/effector-forms';


export const subscribeForm = createForm({
    fields: {
        company: {
            init: 0
        },

        level: {
            init: 0,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: number) => val > 0
                }
            ]
        },

        period: {
            init: 0,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: number) => val > 0
                }
            ]
        },

    },
    validateOn: ['change', 'submit'],
});




