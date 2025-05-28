import {createForm} from "@box/shared/effector-forms";


export const companyStaffCreateForm = createForm({
    fields: {
        first_name: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        last_name: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        company: {
            init: 0
        },
        middle_name: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val.length > 0
                }
            ]
        },
        phone: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val.length === 11
                }
            ]
        },
        position: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val.length > 0
                }
            ]
        },
    },
    validateOn: ['change', 'submit']
});