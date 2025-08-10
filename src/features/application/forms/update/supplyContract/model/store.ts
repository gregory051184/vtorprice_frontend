import {sample} from 'effector';
import {
    packingSelectValues, packingTaxSelectValues, applicationLib, applicationModel
} from '@box/entities/application';

const supplyContractForm = applicationLib.createSupplyContractForm();

sample({
    // @ts-ignore
    source: applicationModel.$application,
    fn: (source) => {
        if (source) {
            const packingTax = packingTaxSelectValues.find(
                (el) => el.value === source.packingDeductionType?.id
            );
            return ({
                dealType: source.dealType,
                company: {
                    id: source.company?.id,
                    label: source.company.name,
                    value: source.company
                },
                packing: packingSelectValues[source.isPackingDeduction ? 1 : 2],
                packingTax,
                packingTaxVolume: source.packingDeductionValue?.toString(),
                ...(source.price && {price: (source.price).toString()}),
                recyclableType: {
                    id: source.recyclables?.id,
                    label: source.recyclables.name,
                    value: source.recyclables
                },
                ...(source.volume && {volume: (source.volume / 1000).toFixed(1)}),
                address: source.address,
                withNds: source.withNds
            });
        }
        return {};
    },
    target: supplyContractForm.form.setForm
});

sample({
    // @ts-ignore
    clock: supplyContractForm.form.formValidated,
    source: {
        values: supplyContractForm.form.$values,
        id: applicationModel.$application.map((el) => el?.id)
    },
    fn: ({values, id}) => ({
        id: id || 0,
        // @ts-ignore
        deal_type: values.dealType.id,
        urgency_type: 2,
        with_nds: values.withNds,
        volume: +values.volume,
        ...(values.volume && {volume: (+values.volume * 1000)}),
        ...(values.price && {price: (+values.price)}),
        address: values.address,
        recyclables: values.recyclableType?.value.id,
        company: values.company?.value.id,
    }),
    filter: ({id}) => typeof id !== 'undefined',
    target: applicationModel.updateApplicationEvent
});

export {
    supplyContractForm
};
