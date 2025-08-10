import { $host } from '@box/shared/api';
import { ITabSelectValue } from '@box/shared/ui';
import { createEffect, createEvent, createStore } from 'effector';
import Router from "next/router";

enum PERIOD {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all'
}

export type GraphData = Array<[number, string]>;

const selectValues: Array<ITabSelectValue<PERIOD>> = [
  {
    id: 1,
    label: 'Неделя',
    value: PERIOD.WEEK
  },
  {
    id: 2,
    label: 'Месяц',
    value: PERIOD.MONTH
  },
  {
    id: 3,
    label: 'Год',
    value: PERIOD.YEAR
  },
  {
    id: 4,
    label: 'За все время',
    value: PERIOD.ALL
  },
];

const getGraphDataFx = createEffect<{
  period?: PERIOD,
  id: number,
  deal_type?: number
}, GraphData>({
  handler: async ({ id, period, deal_type }) => {
    const router = Router
    const { data } = await $host.get(`/exchange_recyclables/${id}/graph/`, {
      params: {
        period: period || PERIOD.ALL,
        urgency_type: router.query.type ? router.query.type : "",
        deal_type: deal_type || ""
      }
    });
    return data;
  }
});

const setPeriod = createEvent<ITabSelectValue<PERIOD>>();
const $period = createStore<ITabSelectValue<PERIOD>>(selectValues[3])
  .on(setPeriod, (_, data) => data);

const $graphData = createStore<GraphData>([])
    .on(getGraphDataFx.doneData, (_, data) => data);

export {
  getGraphDataFx,
  PERIOD,
  $graphData,
  $period,
  setPeriod,
  selectValues,
};
