import {createForm} from "@box/shared/effector-forms";


export const equipmentProposalForm = createForm({
    fields: {
        sender_company: {
            init: 0
        },

        companies: {
            init: Array<number>,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: Array<number>) => val.length > 0
                }
            ]
        },

        applications: {
            init: Array<number>,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: Array<number>) => val.length > 0
                }
            ]
        }
    },
    validateOn: ['change', 'submit'],
});