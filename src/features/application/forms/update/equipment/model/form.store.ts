import {sample} from 'effector';
import {applicationLib, applicationModel} from '@box/entities/application';
import {notificationModel} from '@box/entities/notification';
import Router from "next/router";



const equipmentUpdateForm = applicationLib.updateEquipmentForm();

sample({
    // @ts-ignore
    source: applicationModel.$equipmentApplication,
    fn: (source) => {
        if (source) {
            const images = source.images.map((image) => image.image);
            const imagesForForm = [null, null, null, null, null].map((item, id) => {
                if (images[id]) {
                    return images[id];
                }
                return item;
            });
            const company = {
                id: +source.company.id,
                label: source.company.name,
                value: +source.company.id
            }
            return ({
                images: imagesForForm,
                company: company,
                comment: source.comment,
                priceForUnit: source.price?.toString(),
                dealType: source.dealType,
                //ИЗМЕНИЛ
                category: {
                    id: source.equipment.category.id,
                    label: source.equipment.category.name,
                    value: source.equipment.category.id,
                },
                //ДОБАВИЛ
                equipment: {
                    id: source.equipment.id,
                    label: source.equipment.name,
                    value: source.equipment.id
                },

                description: source.description,//source.equipment.description,

                address: source.address,
                latitude: source.latitude,
                longitude: source.longitude,
                withNds: source.withNds,
                saleByParts: source.saleByParts,
                wasInUse: {
                    id: +source.wasInUse + 1,
                    label: source.wasInUse ? 'Б/У' : 'Новое',
                    value: +source.wasInUse
                },
                manufactureDate: source.manufactureDate,
                count: source.count?.toString(),

            });
        }
        return {};
    },
    target: equipmentUpdateForm.form.setForm
});

sample({
    // @ts-ignore
    clock: equipmentUpdateForm.form.formValidated,
    source: {
        values: equipmentUpdateForm.form.$values,
        id: applicationModel.$equipmentApplication.map((el) => el?.id)
    },
    fn: ({values, id}) => {
        const companyId = values.company?.id
        return ({
            id: id || 0,
            company: companyId,
            deal_type: values.dealType.id,
            count: +values.count,
            with_nds: values.withNds,
            price: +values.priceForUnit,
            address: values.address,
            longitude: +values.longitude,
            latitude: +values.latitude,
            //ИЗМЕНИЛ
            category: values.category?.id,
            //ДОБАВИЛ
            //name: values.equipment?.label,
            equipment: values?.equipment?.id,
            description: values.description,
            comment: values.comment,
            was_in_use: Boolean(values.wasInUse.value),
            sale_by_parts: values.saleByParts,
            ...(values.manufactureDate && {manufacture_date: new Date(values.manufactureDate).toJSON().split('T')[0]})
        })
    },

    target: applicationModel.updateEquipmentApplicationFx
});

sample({
    clock: applicationModel.updateEquipmentApplicationFx.doneData,
    source: {
        values: equipmentUpdateForm.form.$values,
        id: applicationModel.$equipmentApplication.map((el) => el?.id)
    },
    fn: ({values, id}) => ({
        id: id || 0,
        images: values.images
    }),
    target: applicationModel.postEquipmentsImagesFx
});

sample({
    clock: applicationModel.updateEquipmentApplicationFx.done,
    target: [equipmentUpdateForm.form.reset, notificationModel.showAlert.prepend(() => ({
        title: 'Успешно',
        message: 'Заявка отправлена на верификацию'
    }))],
});

export {
    equipmentUpdateForm,
};
