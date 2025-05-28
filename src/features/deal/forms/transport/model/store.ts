import { createForm } from '@box/shared/effector-forms';
import { ITabSelectValue } from '@box/shared/ui';
import { createEffect, createStore, sample } from 'effector';
import { notificationModel } from '@box/entities/notification';
import { DealStatus, DealType } from '@box/entities/deal/model';
import { loadingFormatSelectValues } from '@box/entities/logistics/lib';
import { createGate } from 'effector-react';
import { logisticsApplicationsApi } from "@box/entities/logistics/api";
import { ITransportApplicationModel, IUpdateTransportApplicationParams } from "@box/entities/logistics/model";
import dayjs from 'dayjs';

const $id = createStore(1);

const updateTransportFx = createEffect<{
  id: number,
  data: IUpdateTransportApplicationParams
}, ITransportApplicationModel>({
  handler: async ({ id, data }) => {
    const { data: deal } = await logisticsApplicationsApi.updateTransportApplication(id, data);
    return deal;
  }
});

const gate = createGate();

const transportForm = createForm({
  fields: {
    status: {
      init: 0 as DealStatus
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
    phone: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 1
        }
      ]
    },
    cargoType: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)
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
    shippingCity: {
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
    sender: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)
        }
      ]
    },
    recipient: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.type === DealType.TRANSPORT ? val.trim().length > 0 : true)
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
      init: DealType.TRANSPORT as DealType
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
          validator: (val, state) => (state.status >= DealStatus.LOADED ? val.trim().length > 0 : true)
        }
      ]
    },
    accepted_weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val, state) => (state.status >= DealStatus.UNLOADED ? val.trim().length > 0 : true)
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
    weight: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => val.trim().length > 0
        }
      ]
    },
    comment: {
      init: ''
    },
  }
});

sample({
  // @ts-ignore
  clock: transportForm?.formValidated,
  source: $id,
  fn: (id, src) => {
    return {
      id,
      data: {
        deal: {},
        ...(src.loaded_weight.length > 0 && { loaded_weight: +((+src.loaded_weight) * 1000) }),
        ...(src.accepted_weight.length > 0 && { accepted_weight: +((+src.accepted_weight) * 1000) }),
        ...(src.delivery_date && { delivery_date: dayjs(src.delivery_date).format("YYYY-MM-DD") }),
        ...(src.shipping_date && { shipping_date: src.shipping_date }),
        shippingAddress: src.shippingAddress,
        delivery_latitude: src.deliveryLatitude,
        senderPhone: src.phone,
        delivery_longitude: src.deliveryLongitude,
        delivery_address: src.deliveryAddress,
        shipping_latitude : src.shippingLatitude,
        shipping_longitude: src.shippingLongitude,
        delivery_city: src.deliveryCity,
        shipping_city: src.shippingCity,
        weight: +((+src.weight) * 1000),
        comment: src.comment,
        loading_format: src.loadingFormat,
        weekend_work: src.weekendWork,
        ...(src.loading_hours && {loading_hours: src.loading_hours})
      }
    };
  },
  target: updateTransportFx
});

sample({
  clock: updateTransportFx.doneData,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Данные сохранены'
  }))
});

export {
  transportForm,
  $id,
  updateTransportFx,
  gate
}
