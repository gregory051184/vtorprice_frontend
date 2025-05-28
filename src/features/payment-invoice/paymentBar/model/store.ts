import { invoicePaymentsApi } from "@box/entities/statistics/api/invoicePaymentsApi";
import { AxiosError } from "axios";
import { createEffect, createEvent, createStore } from "effector";

const deleteFile = createEvent();
const addFile = createEvent<File | null>();

const $document = createStore<File | null>(null)
  .on(addFile, (_, payload) => payload)
  .on(deleteFile, () => null);

const sendMonthOrderFx = createEffect<
  { document: File; total: number },
  {
    data: Awaited<ReturnType<typeof invoicePaymentsApi.postMonthOrder>>["data"];
  },
  AxiosError
>({
  handler: async ({ document, total }) => {
    const { data } = await invoicePaymentsApi.postMonthOrder({
      document,
      total,
    });

    return {
      data,
    };
  },
});

const sendPaymentOrderFx = createEffect<
  { id: number; document: File; total: number },
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.postPaymentOrder>
    >["data"];
  },
  AxiosError
>({
  handler: async ({ id, document, total }) => {
    const { data } = await invoicePaymentsApi.postPaymentOrder({
      id,
      document,
      total,
    });

    return {
      data,
    };
  },
});

export { $document, deleteFile, addFile, sendMonthOrderFx, sendPaymentOrderFx };
