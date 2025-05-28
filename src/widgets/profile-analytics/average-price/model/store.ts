import { createGate } from 'effector-react';
import {
  sample, attach
} from 'effector';
import { averagePriceFilterModel } from '@box/features/analitics/filters/averagePriceFilter';
import { averagePriceModel } from '@box/entities/analytics';

const gate = createGate();

const getAveragePriceFx = attach({
  source: {
    filters: averagePriceFilterModel.filters.$values,
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
      averagePriceFilterModel.filters.$values
    ],
    source: averagePriceFilterModel.filters.$values,
    target: getAveragePriceFx
  });
  
  export {
    getAveragePriceFx,
    gate
  };