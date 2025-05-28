import { createGate } from 'effector-react';
import {
  sample, attach
} from 'effector';
import { applicationsStatsModel } from '@box/entities/statistics';
import { applicationsStatsFilterModel } from '@box/features/statistics/filters/applicationsStatsFilter';

const gate = createGate();

const getApplicationsStatsFx = attach({
  source: {
    filters: applicationsStatsFilterModel.filters.$values,
  },
  mapParams: (_, { filters }) => {

    return {
      deal_type: filters.deal_type?.value,
      application_recyclable_status: filters.application_recyclable_status?.value,
      urgency_type: filters.urgency_type?.value,
      recyclables: filters.recyclables?.value.id?.toString(),
      city: filters.city?.value.id?.toString(),
      period: filters.period?.value
    };
  },
  effect: applicationsStatsModel.getApplicationsStatsFx,
});

  sample({
    clock: [
      gate.open,
      applicationsStatsFilterModel.filters.$values,
    ],
    source: applicationsStatsFilterModel.filters.$values,
    target: getApplicationsStatsFx
  });
  
  export {
    getApplicationsStatsFx,
    gate
  };