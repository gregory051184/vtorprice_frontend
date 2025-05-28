import { attach, createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { AxiosError } from "axios";

import { financialDataFiltersModel } from "@box/features/statistics";
import { IInvoicePaymentsGraph, invoicePaymentsApi } from "@box/entities/statistics/api/invoicePaymentsApi";

const gate = createGate();

export type GraphData = Array<[number, string]>;

const getGraphDataFx = createEffect<
  Parameters<typeof invoicePaymentsApi.getInvoicedPaymentsDataGraph>[0],
  IInvoicePaymentsGraph,
  AxiosError
>({
  handler: async (params) => {
    const { data } = await invoicePaymentsApi.getInvoicedPaymentsDataGraph(
      params
    );

    return data;
  },
});

const getGraphData = attach({
  source: {
    filters: financialDataFiltersModel.filters.$values,
  },
  mapParams: (_, { filters }) => ({
    period: filters.period.value,
    ...(filters.createdAt[0] && {
      from_date: filters.createdAt[0],
    }),
    ...(filters.createdAt[1] && {
      to_date: filters.createdAt[1],
    }),
  }),

  effect: getGraphDataFx,
});

const $graphData = createStore<IInvoicePaymentsGraph | null>(null).on(
  getGraphDataFx.doneData,
  (_, data) => data
);

sample({
  clock: [gate.open, financialDataFiltersModel.filters.$values],
  target: getGraphData,
});

export { getGraphDataFx, $graphData, gate };
