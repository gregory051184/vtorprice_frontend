import { createGate } from 'effector-react';
import {
  sample, attach
} from 'effector';
import { applicationsStatsFilterModel } from '@box/features/statistics/filters/applicationsStatsFilter';
import { logisticsDealsFilterModel } from '@box/features/analitics/filters/logisticsDealsFilter';
import { logisticsDealsModel } from '@box/entities/analytics';

const gate = createGate();

const getLogisticsDealsFx = attach({
  source: {
    filters: logisticsDealsFilterModel.filters.$values,
  },
  mapParams: (_, { filters }) => {

    return {
      period: filters.period?.value,
      city: filters.city?.value.id?.toString(),
      region: filters.region?.value.id?.toString(),
    };
  },
  effect: logisticsDealsModel.getLogisticsDealsFx,
});

  sample({
    clock: [
      gate.open,
      logisticsDealsFilterModel.filters.$values,
    ],
    source: applicationsStatsFilterModel.filters.$values,
    target: getLogisticsDealsFx
  });
  
  export {
    getLogisticsDealsFx,
    gate
  };