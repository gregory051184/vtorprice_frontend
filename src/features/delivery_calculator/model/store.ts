import { createGate } from 'effector-react';
import {
  sample, attach, createStore, createEvent
} from 'effector';
import { averagePriceModel } from '@box/entities/analytics';

import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    shipping_city: {
      init: null as ISelectValue | null
    },
    delivery_city: {
      init: null as ISelectValue | null
    },
  }
});

export {
  filters
};

const gate = createGate();

const getAveragePriceFx = attach({
  source: {
    filters: filters.$values,
  },
  mapParams: (_, { filters }) => {

    return {
      shipping_city: filters.shipping_city?.value.id?.toString(),
      delivery_city: filters.delivery_city?.value.id?.toString(),
    };
  },
  effect: averagePriceModel.getAveragePriceFx,
});

  sample({
    clock: [
      gate.open,
      filters.$values,
    ],
    source: filters.$values,
    target: getAveragePriceFx
  });

  const setTotalPrice = createEvent<number>();

  const $totalPrice = createStore<number>(0).on(setTotalPrice, (_, price) => price)
  
  export {
    getAveragePriceFx,
    gate,
    $totalPrice,
    setTotalPrice
  };