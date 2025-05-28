import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { createEffect, createStore, sample } from 'effector';
import { notificationModel } from '@box/entities/notification';
import { DealStatus, DealType } from '@box/entities/deal/model';
import { createGate } from 'effector-react';
import { equipmentDealsApi } from "@box/entities/application/api/equipmentDealsApi";
import { loadingFormatSelectValues } from "@box/entities/logistics/lib";
import dayjs from 'dayjs';

const $id = createStore(1);

const updateEquipmentDealFx = createEffect<{
  id: number,
  data: any
}, any>({
  handler: async ({ id, data }) => {
    const { data: deal } = await equipmentDealsApi.update(id, data);

    return deal;
  }
});

const gate = createGate();
const form = createForm({
  fields: {
    dealType: {
      init: DealType.EQUIPMENT as DealType
    },
    paymentTerm: {
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
          validator: (val, state) => ((state.type === DealType.EQUIPMENT && state.paymentTerm.value === 3) ? val.trim().length > 0 : true)
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
    shippingCity: {
      init: ''
    },
    type: {
      init: ''
    },
    shippingAddress: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => val.trim().length > 0
        }
      ]
    },
    deliveryAddress: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => val.trim().length > 0
        }
      ]
    },
    deliveryCity: {
      init: ''
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
    status: {
      init: 0 as DealStatus
    },
    count: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => !!val
        }
      ]
    },
    manufactureDate: {
      init: null as Date | null | string,
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
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    saleByParts: {
      init: false
    },
    withNds: {
      init: false
    },
    sellerPay: {
      init: {
        id: 1,
        label: 'Продавец',
        value: true
      } as ITabSelectValue
    },
    wasInUse: {
      init: {
        id: 1,
        label: 'Новое',
        value: false
      } as ITabSelectValue
    },
    comment: {
      init: ''
    },
    whoDelivers: {
      init: null as ITabSelectValue | null,
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.EQUIPMENT ? val !== null : true)
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
    loaded_weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.status >= DealStatus.LOADED ? !!val : true)
        }
      ]
    },
    accepted_weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.status >= DealStatus.UNLOADED ? !!val : true)
        }
      ]
    },
    sender: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.TRANSPORT ? val.trim().length > 0 : true)
        }
      ]
    },
    recipient: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.TRANSPORT ? val.trim().length > 0 : true)
        }
      ]
    },
    weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    cargoType: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.TRANSPORT ? val.trim().length > 0 : true)
        }
      ]
    },
    weekendWork: {
      init: false
    },
    loadingFormat: {
      init: loadingFormatSelectValues[0],
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.TRANSPORT ? val !== null : true)
        }
      ]
    },
    loadingHours: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.dealType === DealType.TRANSPORT ? val.trim().length > 0 : true)
        }
      ]
    },
    phone: {
      init: ''
    }
  }
});

sample({
  clock: form.formValidated,
  source: $id,
  fn: (id, src) => {
    if (src.dealType === DealType.EQUIPMENT) {
      // @ts-ignore
      return {
        id,
        data: {
          paymentTerm: src.paymentTerm?.value,
          count: src.count,
          manufactureDate: src.manufactureDate,
          saleByParts: src.saleByParts,
          withNds: src.withNds,
          price: +src.price,
          wasInUse: src.wasInUse.value,
          comment: src.comment,
          whoDelivers: src.whoDelivers?.value,
          buyerPaysShipping: !src.sellerPay.value,
          deliveryAddress: src.deliveryAddress,
          deliveryLatitude: src.deliveryLatitude,
          deliveryLongitude: src.deliveryLongitude,
          shippingAddress: src.shippingAddress,
          shippingLatitude: src.shippingLatitude,
          shippingLongitude: src.shippingLongitude,
          deliveryCity: src.deliveryCity,
          shippingCity: src.shippingCity,
          other_payment_term: src.other_payment_term,
          ...(src.loaded_weight.length > 0 && { loadedWeight: ((+src.loaded_weight) * 1000).toFixed(1) }),
          ...(src.accepted_weight.length > 0 && { acceptedWeight: ((+src.accepted_weight) * 1000).toFixed(1) }),
          ...(src.delivery_date && {deliveryDate: dayjs(src.delivery_date).format("YYYY-MM-DD")}),
          ...(src.shipping_date && {shippingDate: src.shipping_date}),
          ...(src.loading_hours && {loading_hours: src.loading_hours})
        }
      };
    }
    return {
      id,
      data: {
        ...(src.loadingHours && { loading_hours: src.loadingHours }),
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
        weight: ((+src.weight) * 1000),
        comment: src.comment,
        weekend_work: src.weekendWork,
        //phone: src.phone
      }
    }
  },
  target: updateEquipmentDealFx
});

sample({
  clock: updateEquipmentDealFx.doneData,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Данные сохранены'
  }))
});

export {
  form,
  $id,
  updateEquipmentDealFx,
  gate,
}
