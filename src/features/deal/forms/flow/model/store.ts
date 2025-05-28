import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { packingSelectValues, packingTaxSelectValues } from '@box/entities/application';
import { createEffect, createStore, sample } from 'effector';
import { dealApi, DealCreateParams, dealModel } from '@box/entities/deal';
import { notificationModel } from '@box/entities/notification';
import { DealStatus, DealType } from '@box/entities/deal/model';
import { loadingFormatSelectValues } from '@box/entities/logistics/lib';
import { createGate } from 'effector-react';
import dayjs from 'dayjs';

const $id = createStore(1);

const updateDealFx = createEffect<{
  id: number,
  data: Partial<DealCreateParams> &
    { delivery_latitude: number, delivery_longitude: number, shipping_latitude: number, shipping_longitude: number }
}, dealModel.IDeal>( {

  handler: async ({ id, data }) => {
    const { data: deal } = await dealApi.update(id, data);
    return deal;
  }
});

const gate = createGate();

const form = createForm({
  fields: {
    status: {
      init: 0 as DealStatus
    },
    // ---- transport
    cargoType: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    loading_hours: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val, state) => (state.status >= DealStatus.LOADED ? val.length > 0 : true)
        }
      ]
    },
    deliveryAddress: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => {try {return(val.trim().length > 0)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    deliveryCity: {
      init: ''
    },
    shippingCity: {
      init: ''
    },
    shippingAddress: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => {try {return(val.trim().length > 0)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    deliveryLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    deliveryLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    shippingLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    shippingLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    loadingHours: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    sender: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    recipient: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    loadingFormat: {
      init: loadingFormatSelectValues[0],
      rules: [
        {
          name: '',
          validator: (val, state) => (state.type === DealType.TRANSPORT ? val !== null : true)
        }
      ]
    },
    weekendWork: {
      init: false
    },
    // -----
    type: {
      init: DealType.RECYCLABLES as DealType
    },
    whoDelivers: {
      init: null as ITabSelectValue | null,
      rules: [
        {
          name: '',
          validator: (val, state) => (state.type === DealType.RECYCLABLES ? val !== null : true)
        }
      ]

    },
    loaded_weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.status >= DealStatus.LOADED ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    accepted_weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.status >= DealStatus.UNLOADED ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    shipping_date: {
      init: null as Date | null,
      rules: [
        {
          name: '',
          validator: (val, state) => (state.status >= DealStatus.LOADED ? val !== null : true) 
        }
      ]
    },
    delivery_date: {
      init: null as Date | null,
      rules: [
        {
          name: '',
          validator: (val, state) => (state.status >= DealStatus.LOADED ? val !== null : true) 
        }
      ]
    },
    weediness: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return((state.type === DealType.RECYCLABLES ? val.trim().length > 0 : true))} catch (e) {console.log(e); return false}}
        }
      ]
    },
    moisture: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return((state.type === DealType.RECYCLABLES ? val.trim().length > 0 : true))} catch (e) {console.log(e); return false}}
        }
      ]
    },
    price: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return(state.type === DealType.RECYCLABLES ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => {try {return(val.trim().length > 0)} catch (e) {console.log(e); return false}}
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
          validator: (val, state) => (state.type === DealType.RECYCLABLES ? val != null : true)
        }
      ]
    },
    other_payment_term: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => {try {return((state.type === DealType.RECYCLABLES && state.payment_term.value === 3) ? val.trim().length > 0 : true)} catch (e) {console.log(e); return false}}
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
      rules: [
        {
          name: 'not_null',
          validator: (val, state) => {try {return(state.type === DealType.RECYCLABLES ? val != null : true)} catch (e) {console.log(e); return false}}
        }
      ]
    },
    packingTax: {
      init: packingTaxSelectValues[0],
    },
    packingTaxVolume: {
      init: '',
    },

    phone: {
      init: ''
    }
  }
});

sample({
  // @ts-ignore
  clock: form?.formValidated,
  source: $id,
  fn: (id, src) => {
    if (src.type === DealType.RECYCLABLES) {
      const isPackingDeduction = src.packing.value === 2;
      return {
        id,
        data: {
          with_nds: src.withNds,
          price: +src.price,
          is_packing_deduction: isPackingDeduction,
          ...(isPackingDeduction && { packing_deduction_value: src.packingTax.value === 2 ? +src.packingTaxVolume : (+src.packingTaxVolume) * 1000 }),
          ...(isPackingDeduction && { packing_deduction_value: +src.packingTaxVolume }),
          comment: src.comment,
          who_delivers: src.whoDelivers?.value,
          weight: (+src.weight) * 1000,
          //weight: +src.weight,
          weediness: +src.weediness,
          moisture: +src.moisture,
          other_payment_term: src.other_payment_term,
          payment_term: src.payment_term?.value,
          buyer_pays_shipping: !src.sellerPay.value,
          delivery_address: src.deliveryAddress,
          delivery_latitude: src.deliveryLatitude,
          delivery_longitude: src.deliveryLongitude,
          shipping_address: src.shippingAddress,
          shipping_latitude : src.shippingLatitude,
          shipping_longitude: src.shippingLongitude,
          delivery_city: src.deliveryCity,
          shipping_city: src.shippingCity,
          //...(src.loaded_weight.length > 0 && { loaded_weight: src.loaded_weight }),
          ...(src.loaded_weight.length > 0 && { loaded_weight: ((+src.loaded_weight) * 1000).toFixed(1) }),
          //...(src.accepted_weight.length > 0 && { accepted_weight: src.accepted_weight }),
          ...(src.accepted_weight.length > 0 && { accepted_weight: ((+src.accepted_weight) * 1000).toFixed(1) }),           
          ...(src.delivery_date && { delivery_date: dayjs(src.delivery_date).format("YYYY-MM-DD") }),
          ...(src.shipping_date && { shipping_date: src.shipping_date }),
          ...(src.loading_hours && {loading_hours: src.loading_hours})
        }
      };
    }

    return {
      id,
      data: {
        ...(src.loaded_weight.length > 0 && { loaded_weight: ((+src.loaded_weight) * 1000).toFixed(1) }),
        ...(src.accepted_weight.length > 0 && { accepted_weight: ((+src.accepted_weight) * 1000).toFixed(1) }),
        ...(src.delivery_date && { delivery_date: dayjs(src.delivery_date).format("YYYY-MM-DD") }),
        ...(src.shipping_date && { shipping_date: src.shipping_date }),
        ...(src.loading_hours && {loading_hours: src.loading_hours}),
        shipping_address: src.shippingAddress,
        delivery_latitude: src.deliveryLatitude,
        delivery_longitude: src.deliveryLongitude,
        delivery_address: src.deliveryAddress,
        shipping_latitude : src.shippingLatitude,
        shipping_longitude: src.shippingLongitude,
        delivery_city: src.deliveryCity,
        shipping_city: src.shippingCity,
        weight: (+src.weight) * 1000,
        comment: src.comment,
        //phone: src.phone
      }
    };
  },
  target: updateDealFx
});

sample({
  clock: updateDealFx.doneData,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Данные сохранены'
  }))
});

export {
  form,
  $id,
  updateDealFx,
  gate
}
