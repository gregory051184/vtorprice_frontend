import {ISelectValue, ITabSelectValue} from '@box/shared/ui';
import { sample, createEffect, combine } from 'effector';
import { AxiosError } from 'axios';

import { createForm } from '@box/shared/effector-forms';
import { loadingFormatSelectValues } from '@box/entities/logistics/lib/selects';
import { logisticsApplicationsApi } from '@box/entities/logistics/api/logistApi';
import Router from 'next/router';
import { createGate } from 'effector-react';
import { dealApi, dealModel } from '@box/entities/deal';
import { equipmentDealsApi } from "@box/entities/application/api/equipmentDealsApi";

const getDealFx = createEffect<number, dealModel.IDeal>({
  handler: async (id) => {
    const { data } = await dealApi.get(id);

    return data;
  }
});

const getEquipmentDealFx = createEffect<number, any>({
  handler: async (id) => {
    const { data } = await equipmentDealsApi.get(id);

    return data;
  }
});

const form = createForm({
  fields: {
    loadingFormat: {
      init: loadingFormatSelectValues[0],
     
    },
    weight: {
      init: 0,
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
    sender: {
      init: null as ISelectValue | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    getter: {
      init: null as ISelectValue | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    loadingAddress: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    loadingLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    loadingLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    loadingCity: {
      init: ''
    },
    unloadingAddress: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    unloadingLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    unloadingLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    unloadingCity: {
      init: ''
    },
    cargoType: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    hoursLoading: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    comment: {
      init: '',
    },
    weekendWork: {
      init: false
    }
  },
  validateOn: ['submit']
});

const equipmentForm = createForm({
  fields: {
    loadingFormat: {
      init: loadingFormatSelectValues[0],
    },
    weight: {
      init: 0,
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
    sender: {
      init: null as ISelectValue | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    getter: {
      init: null as ISelectValue | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    loadingAddress: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    loadingLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    loadingLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    loadingCity: {
      init: ''
    },
    unloadingAddress: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    unloadingLatitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    unloadingLongitude: {
      init: '',
      rules: [
        {
          name: '',
          validator: (val) => !!val
        }
      ]
    },
    unloadingCity: {
      init: ''
    },
    cargoType: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    hoursLoading: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    comment: {
      init: '',
    },
    weekendWork: {
      init: false
    }
  },
  validateOn: ['submit']
});

const gate = createGate<{
  dealId: string | null
}>();

const equipmentGate = createGate<{
  equipmentDealId: string | null
}>();

sample({
  source: gate.open,
  filter: (src) => src.dealId !== null,
  target: getDealFx.prepend((src: any) => parseInt(src.dealId, 10))
});

sample({
  source: equipmentGate.open,
  filter: (src) => src.equipmentDealId !== null,
  target: getEquipmentDealFx.prepend((src: any) => parseInt(src.equipmentDealId, 10))
});

sample({
  // @ts-ignore
  source: getDealFx.doneData,
  fn: (src) => ({
    sender: { id: src.supplierCompany.id, label: src.supplierCompany.name, value: src.supplierCompany },
    getter: { id: src.buyerCompany.id, label: src.buyerCompany.name, value: src.buyerCompany },
    loadingAddress: src.shippingAddress,
    loadingLongitude: src.shippingLongitude,
    loadingLatitude: src.shippingLatitude,
    unloadingAddress: src.deliveryAddress,
    unloadingLongitude: src.deliveryLongitude,
    unloadingLatitude: src.deliveryLatitude,
    weight: ((+src.weight) / 1000).toFixed(1),
    phone: src.supplierCompany.phone,
    cargoType: src.application.recyclables.name,
  }),
  target: form.set
});

sample({
  // @ts-ignore
  source: getEquipmentDealFx.doneData,
  fn: (src) => ({
    sender: { id: src.supplierCompany.id, label: src.supplierCompany.name, value: src.supplierCompany },
    getter: { id: src.buyerCompany.id, label: src.buyerCompany.name, value: src.buyerCompany },
    loadingAddress: src.shippingAddress,
    loadingLongitude: src.shippingLongitude,
    loadingLatitude: src.shippingLatitude,
    unloadingAddress: src.deliveryAddress,
    unloadingLongitude: src.deliveryLongitude,
    unloadingLatitude: src.deliveryLatitude,
    weight: src.weight,
    phone: src.supplierCompany.phone,
    cargoType: src.application.equipment.name,
  }),
  target: equipmentForm.set
});

const createReadyForShipmentApplicationFx = createEffect<{
  loadingFormat: ITabSelectValue<number>,
  weight: number,
  phone: string,
  sender: ISelectValue,
  getter: ISelectValue,
  loadingAddress: string,
  loadingLatitude: number,
  loadingLongitude: number,
  loadingCity: number,
  unloadingAddress: string,
  unloadingLatitude: number,
  unloadingLongitude: number,
  unloadingCity: number,
  cargoType: string,
  address: string,
  hoursLoading: string,
  comment: string
  weekendWork: boolean,
  dealType?: string,
  objectId?: string
}, void, AxiosError>({
  handler: async (data) => {
    await logisticsApplicationsApi.createApplication({
      sender: data.sender.label,
      recipient: data.getter.label,
      loadingType: data.loadingFormat.value,
      weight: data.weight,
      shippingAddress: data.loadingAddress,
      shippingLatitude: data.loadingLatitude,
      shippingLongitude: data.loadingLongitude,
      shippingCity: data.loadingCity,
      deliveryAddress: data.unloadingAddress,
      deliveryLatitude: data.unloadingLatitude,
      deliveryLongitude:data.unloadingLongitude,
      deliveryCity: data.unloadingCity,
      weekendWork: data.weekendWork,
      cargoType: data.cargoType,
      status: 1,
      senderPhone: data.phone,
      loadingHours: data.hoursLoading,
      ...(data.dealType && { dealType: data.dealType as any }),
      ...(data.objectId && { objectId: data.objectId as any }),
    });

    if (data.objectId && data.dealType === 'recyclables') {
      Router.replace(`/deals/${data.objectId}`);
      return;
    }
    Router.push('/');
  }
});

const createReadyForShipmentEquipmentApplicationFx = createEffect<{
  loadingFormat: ITabSelectValue<number>,
  weight: number,
  phone: string,
  sender: ISelectValue,
  getter: ISelectValue,
  loadingAddress: string,
  loadingLatitude: number,
  loadingLongitude: number,
  loadingCity: number,
  unloadingAddress: string,
  unloadingLatitude: number,
  unloadingLongitude: number,
  unloadingCity: number,
  cargoType: string,
  address: string,
  hoursLoading: string,
  comment: string
  weekendWork: boolean,
  dealType?: string,
  objectId?: string,
}, void, AxiosError>({
  handler: async (data) => {
    await logisticsApplicationsApi.createApplication({
      sender: data.sender.label,
      recipient: data.getter.label,
      loadingType: data.loadingFormat.value,
      weight: +((+data.weight) / 1000).toFixed(1),
      shippingAddress: data.loadingAddress,
      shippingLatitude: data.loadingLatitude,
      shippingLongitude: data.loadingLongitude,
      shippingCity: data.loadingCity,
      deliveryAddress: data.unloadingAddress,
      deliveryLatitude: data.unloadingLatitude,
      deliveryLongitude:data.unloadingLongitude,
      deliveryCity: data.unloadingCity,
      weekendWork: data.weekendWork,
      cargoType: data.cargoType,
      status: 1,
      senderPhone: data.phone,
      loadingHours: data.hoursLoading,
      ...(data.dealType && { dealType: data.dealType as any }),
      ...(data.objectId && { objectId: data.objectId as any }),
    });

    if (data.objectId && data.dealType === 'equipment') {
      Router.replace(`/equipment-deals/${data.objectId}`);
      return;
    }
    Router.push('/');
  }
});

sample({
  clock: form?.formValidated,
  source: combine([form.$values, gate.state]),
  fn: ([form, gate]) => {
    const data: any = form;

    if (!!gate.dealId) {
      data.objectId = gate.dealId;
      data.dealType = 'recyclables';
    }
    return data;
  },
  target: [createReadyForShipmentApplicationFx, form.reset]
});

sample({
  clock: equipmentForm?.formValidated,
  source: combine([equipmentForm.$values, equipmentGate.state]),
  fn: ([form, gate]) => {
    const data: any = form;
    if (!!gate.equipmentDealId) {
      data.objectId = gate.equipmentDealId;
      data.dealType = 'equipment';
    }
    return data;
  },
  target: [createReadyForShipmentEquipmentApplicationFx, equipmentForm.reset]
});

export { form, gate, equipmentGate, equipmentForm };
