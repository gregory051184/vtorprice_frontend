import {
  ITotalEmploy,
  statisticApi,
} from "@box/entities/statistics/api/statisticApi";
import { AxiosError } from "axios";
import { createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";

const gate = createGate();

const getTotalEmployFx = createEffect<
  void,
  {
    data: Awaited<ReturnType<typeof statisticApi.getTotalEmploy>>["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async () => {
    const { data } = await statisticApi.getTotalEmploy();

    return {
      data,
    };
  },
});

sample({
  clock: gate.open,
  target: getTotalEmployFx,
});

const $totalEmploy = createStore<ITotalEmploy | null>(null).on(
  getTotalEmployFx.doneData,
  (_, date) => date.data
);

export { $totalEmploy, gate };
