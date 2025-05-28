import {createForm} from "@box/shared/effector-forms";
import {specialApplicationsPeriod} from "@box/entities/special-application";
import {ISelectValue, ITabSelectValue} from "@box/shared/ui";
import {companyModel} from '@box/entities/company';
import {sample} from "effector";
import {$authStore} from "@box/entities/auth";

export const createSpecialApplicationForm = () => {
    const specialApplicationForm = createForm({
        fields: {
            images: {
                init: [null, null, null, null, null] as Array<File | null | string>,
            },

            company: {
                init: null as null | ISelectValue<companyModel.ICompany>,
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val != null
                    }
                ]
            },

            period: {
                init: specialApplicationsPeriod[0] as ITabSelectValue | null,
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val != null
                    }
                ]
            },

            price: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val.length > 0
                    },

                ]
            },

            address: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => val.length > 0
                    }
                ]
            },
            latitude: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => !!val
                    }
                ]
            },
            longitude: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => !!val
                    }
                ]
            },
            city: {
                init: ''
            },
            comment: {
                init: '',
            },
            description: {
                init: '',
                rules: [
                    {
                        name: 'not_null',
                        validator: (val) => !!val
                    }
                ]
            },
            withNds: {
                init: false
            }
        },
        validateOn: ['change', 'submit'],
    })
    sample({
        // @ts-ignore
        source: $authStore.map((val) => val.user?.company),
        fn: (source) => {
            if (source != null) {
                return ({
                    id: source.id,
                    label: source.name,
                    value: source.id,
                });
            }
            return null;
        },
        target: specialApplicationForm.fields.company.set
    });
    sample({
        // @ts-ignore
        source: $authStore.map((val) => val.user?.company),
        fn: (source) => {
            if (source != null) {
                return source.address;
            }
            return null;
        },
        target: specialApplicationForm.fields.address.set
    });
    sample({
        // @ts-ignore
        source: $authStore.map((val) => val.user?.company),
        fn: (source) => {
            if (source != null) {
                return source.longitude;
            }
            return null;
        },
        target: specialApplicationForm.fields.longitude.set
    });
    sample({
        // @ts-ignore
        source: $authStore.map((val) => val.user?.company),
        fn: (source) => {
            if (source != null) {
                return source.latitude;
            }
            return null;
        },
        target: specialApplicationForm.fields.latitude.set
    });
    sample({
        // @ts-ignore
        source: $authStore.map((val) => val.user?.company),
        fn: (source) => {
            if (source != null) {
                return source.city.id;
            }
            return null;
        },
        target: specialApplicationForm.fields.city.set
    });

    return {
        form: specialApplicationForm
    };
}
