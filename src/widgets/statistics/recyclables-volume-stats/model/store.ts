import { createGate } from 'effector-react';
import {
  sample, attach
} from 'effector';
import { recyclablesVolumeStatsModel } from '@box/entities/statistics';
import { recyclablesVolumeStatsFilterModel } from '@box/features/statistics/filters/recyclablesVolumeStatsFilter';

const gate = createGate();

const getRecyclablesVolumeStatsFx = attach({
  source: {
    filters: recyclablesVolumeStatsFilterModel.filters.$values,
  },
  mapParams: (_, { filters }) => {

    return {
      deal_type: filters.deal_type?.value,
      urgency_type: filters.urgency_type?.value,
      recyclables__category: filters.category?.value.id?.toString(),
      city: filters.city?.value.id?.toString(),
      period: filters.period?.value
    };
  },
  effect: recyclablesVolumeStatsModel.getRecyclablesVolumeStatsFx,
});



  sample({
    clock: [
      gate.open,
      recyclablesVolumeStatsFilterModel.filters.$values,
    ],
    source: recyclablesVolumeStatsFilterModel.filters.$values,
    target: getRecyclablesVolumeStatsFx
  });
  
  export {
    getRecyclablesVolumeStatsFx,
    gate
  };