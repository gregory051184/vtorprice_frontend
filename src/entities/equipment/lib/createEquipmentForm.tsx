import {createForm} from "@box/shared/effector-forms";
import {ISelectValue} from "@box/shared/ui";

export const equipmentCreateFormFunc = () => {
    const equipmentCreateForm = createForm({
        fields: {
            category: {
                init: null as ISelectValue<number> | null,
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val != null,
                    }
                ]
            },

            description: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val != null,
                    }
                ]
            },
            name: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val != null,
                    }
                ]
            },

        },
        validateOn: ['change', 'submit']
    });
    return {form: equipmentCreateForm};
}
