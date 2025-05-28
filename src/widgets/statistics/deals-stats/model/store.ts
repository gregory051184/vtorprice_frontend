import { createGate } from "effector-react";
import { sample, attach } from "effector";
import { dealsStatsModel } from "@box/entities/statistics";
import { dealsStatsFilterModel } from "@box/features/statistics/filters/dealsStatsFilter";

const gate = createGate();

const getDealsStatsFx = attach({
  source: {
    filters: dealsStatsFilterModel.filters.$values,
  },
  mapParams: (_, { filters }) => {
    return {
      application__recyclables:
        filters.application__recyclables?.value.id?.toString(),
      period: filters.period?.value,
    };
  },
  effect: dealsStatsModel.getDealsStatsFx,
});

sample({
  clock: [gate.open, dealsStatsFilterModel.filters.$values],
  source: dealsStatsFilterModel.filters.$values,
  target: getDealsStatsFx,
});

export { getDealsStatsFx, gate };
