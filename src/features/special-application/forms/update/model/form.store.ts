import {sample} from 'effector';
import {
    $specialApplication,
    createSpecialApplicationForm,
    updateSpecialApplicationFx
} from "@box/entities/special-application";


const {form: specialAppForm} = createSpecialApplicationForm();

sample({
    // @ts-ignore
    source: $specialApplication,
    fn: (source) => {
        if (source) {
            const images = source.specialApplication.images.map((image) => image.image);
            const imagesForForm = [null, null, null, null, null].map((item, id) => {
                if (images[id]) {
                    return images[id];
                }
                return item;
            });

            const period = (id: number) => {
                if (id === 1) {
                    return {
                        id: 1,
                        label: 'День',
                        value: 1,
                    }
                }
                if (id === 2) {
                    return {
                        id: 2,
                        label: 'Два дня',
                        value: 2,
                    }
                }
                if (id === 3) {
                    return {
                        id: 3,
                        label: 'Четыре дня',
                        value: 3,
                    }
                }
                if (id === 4) {
                    return {
                        id: 4,
                        label: 'Семь дней',
                        value: 4,
                    }
                }
            }

            const company = {
                //@ts-ignore
                id: +source.specialApplication.companies[0].id,
                //@ts-ignore
                label: source.specialApplication.companies[0].name,
                //@ts-ignore
                value: +source.specialApplication.companies[0].id
            }
            return ({
                images: imagesForForm,
                company: company,
                comment: source.specialApplication.comment,
                price: source.specialApplication.price?.toString(),
                address: source.specialApplication.address,
                latitude: source.specialApplication.latitude,
                longitude: source.specialApplication.longitude,
                withNds: source.specialApplication.withNds,
                description: source.specialApplication.description,
                period: period(+source.specialApplication.period),
                city: source.specialApplication.city?.toString(),
            });
        }
        return {};
    },
    target: specialAppForm.setForm
});

sample({
    // @ts-ignore
    clock: specialAppForm?.formValidated,
    source: {
        values: specialAppForm?.$values,
        id: $specialApplication.map((el) => el?.id)
    },
    fn: ({values, id}) => {
        const companyId = values.company?.id

        return ({
            id: id || 0,
            company: companyId,
            with_nds: values.withNds,
            price: +values.price,
            address: values.address,
            longitude: +values.longitude,
            latitude: +values.latitude,
            comment: values.comment,
            description: values.description,
            //@ts-ignore
            period: +values.period?.toString(),
        })
    },
    target: updateSpecialApplicationFx
});

export {
    specialAppForm,
};
