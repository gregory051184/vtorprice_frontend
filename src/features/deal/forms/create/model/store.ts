import {createForm} from '@box/shared/effector-forms';
import {ISelectValue, ITabSelectValue} from '@box/shared/ui';
import {packingSelectValues, packingTaxSelectValues, applicationModel} from '@box/entities/application';
import {createEffect, sample} from 'effector';
import {DealCreateParams, dealApi} from '@box/entities/deal';
import {notificationModel} from '@box/entities/notification';
import Router from 'next/router';

const createDealFx = createEffect<DealCreateParams, any>({
    handler: async (data) => {
        const deal = await dealApi.create(data);
        //ИЗМЕНИЛ
        Router.push(`/deals/${deal.data.id}`);
    }
});

const form = createForm({
    fields: {
        application: {
            init: null as applicationModel.IRecyclableApplication | null,
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        kipVolume: {
            init: ''
        },
        kipWeight: {
            init: ''
        },
        companySeller: {
            init: null as ISelectValue | null,
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        companyBuyer: {
            init: null as ISelectValue | null,
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        weediness: {
            init: '',
        },
        moisture: {
            init: '',
        },
        price: {
            init: '',
            rules: [
                {
                    name: '',
                    validator: (val) => val.trim().length > 0
                }
            ]
        },
        weight: {
            init: '',
            rules: [
                {
                    name: '',
                    validator: (val) => val.trim().length > 0
                }
            ]
        },
        withNds: {
            init: false
        },
        payment_term: {
            init: null as ISelectValue | null,
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => val != null
                }
            ]
        },
        other_payment_term: {
            init: '',
            rules: [
                {
                    name: '',
                    validator: (val, form) => (form.payment_term?.value === 3 ? val.trim().length > 0 : true)
                }
            ]
        },
        addressBuyer: {
            init: '',
            rules: [
                {
                    name: '',
                    validator: (val) => val.trim().length > 0
                }
            ]
        },
        addressSeller: {
            init: '',
            rules: [
                {
                    name: '',
                    validator: (val) => val.trim().length > 0
                }
            ]
        },
        sellerPay: {
            init: {
                id: 1,
                label: 'Продавец',
                value: true
            } as ITabSelectValue
        },
        comment: {
            init: ''
        },
        packing: {
            init: packingSelectValues[0],
        },
        packingTax: {
            init: packingTaxSelectValues[0],
        },
        packingTaxVolume: {
            init: '',
        },
        latitudeSeller: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => !!val
                }
            ]
        },
        longitudeSeller: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => !!val
                }
            ]
        },
        citySeller: {
            init: '',
        },
        longitudeBuyer: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => !!val
                }
            ]
        },
        latitudeBuyer: {
            init: '',
            rules: [
                {
                    name: 'not_null',
                    validator: (val) => !!val
                }
            ]
        },
        cityBuyer: {
            init: '',
        }
    }
});

sample({
    clock: form?.formValidated,
    fn: (src) => {
        const isPackingDeduction = src.packing.value === 2;
        return {
            with_nds: src.withNds,
            price: +src.price,
            is_packing_deduction: isPackingDeduction,
            ...(isPackingDeduction && {packing_deduction_type: +src.packingTax.value}),
            ...(isPackingDeduction && {packing_deduction_value: src.packing.value === 2 ? +src.packingTaxVolume : (+src.packingTaxVolume) * 1000}),
            comment: src.comment,
            weight: (+src.weight) * 1000,
            weediness: +src.weediness,
            moisture: +src.moisture,
            other_payment_term: src.other_payment_term,
            payment_term: src.payment_term?.value,
            buyer_pays_shipping: !src.sellerPay.value,
            supplier_company: src.companySeller?.value.id as any,
            buyer_company: src.companyBuyer?.value.id as any,
            application: src.application?.id as any,
            delivery_address: src.addressBuyer,
            delivery_latitude: src.latitudeBuyer,
            delivery_longitude: src.longitudeBuyer,
            delivery_city: src.cityBuyer,
            shipping_address: src.addressSeller,
            shipping_latitude: src.latitudeSeller,
            shipping_longitude: src.longitudeSeller,
            shipping_city: src.citySeller
        };
    },
    target: createDealFx
});

sample({
    clock: createDealFx.doneData,
    target: [notificationModel.showAlert.prepend(() => ({
        title: 'Успешно',
        message: 'Сделка создана'
    })), form.reset]
});

export {
    form
};
