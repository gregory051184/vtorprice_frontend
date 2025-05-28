import { createForm } from "@box/shared/effector-forms";
import { ISelectValue, ITabSelectValue } from "@box/shared/ui";
import { createEffect, sample } from "effector";
import Router from "next/router";
import { equipmentDealsApi } from "@box/entities/application/api/equipmentDealsApi";
import { IEquipmentApplication } from "@box/entities/application/model";
import { notificationModel } from '@box/entities/notification';

const createEquipmentDealFx = createEffect<any, any>({
  // @ts-ignore
  handler: async (data) => {
    await equipmentDealsApi.create(data);
    Router.back();
  }
});

const form = createForm({
  fields: {
    application: {
      init: null as IEquipmentApplication | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
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
    type: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => val.trim().length > 0
        }
      ]
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
          validator: (val, state) => ((state.payment_term.value === 3) ? val.trim().length > 0 : true)
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
    return {
      sale_by_parts: src.saleByParts,
      was_in_use: src.wasInUse.value,
      manufacture_date: src.manufactureDate,
      application: src.application?.id as any,
      buyer_pays_shipping: !src.sellerPay.value,
      comment: src.comment,
      supplier_company: src.companySeller?.value.id as any,
      buyer_company: src.companyBuyer?.value.id as any,
      payment_term: src.payment_term?.value,
      with_nds: src.withNds,
      count: src.count,
      price: +src.price,
      delivery_address: src.addressBuyer,
      delivery_latitude: src.latitudeBuyer,
      delivery_longitude: src.longitudeBuyer,
      delivery_city: src.cityBuyer,
      shipping_address: src.addressSeller,
      shipping_latitude: src.latitudeSeller,
      shipping_longitude: src.longitudeSeller,
      shipping_city: src.citySeller,
      other_payment_term: src.other_payment_term,
    };
  },
  target: createEquipmentDealFx
});

sample({
  clock: createEquipmentDealFx.doneData,
  target: [notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Сделка создана'
  })), form.reset]
});

export { form };
