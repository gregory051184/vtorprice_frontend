import { invoicePaymentsApi } from "@box/entities/statistics/api/invoicePaymentsApi";
import { AxiosError } from "axios";
import {createEffect, createEvent, createStore, sample} from "effector";
import {$authHost} from "@box/shared/api";


const deletePaymentOrderApi = async (id: number) => {
  await $authHost.delete(`/payment_orders/${id}`);
  return id;
};

const deleteFile = createEvent<number>();
const addFile = createEvent<File | null>();

const deleteRequiredDocumentFx = createEffect<
    number
    , number, AxiosError>({
  handler: async (id) => {
    await deletePaymentOrderApi(id);
    return id;
  },
});

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
  { id: number; document: File; total: number; invoice_payment?: number; name?: string},
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.postPaymentOrder>
    >["data"];
  },
  AxiosError
>({
  handler: async ({ id, document, total, invoice_payment, name }) => {
    const { data } = await invoicePaymentsApi.postPaymentOrder({
      id,
      document,
      total,
      invoice_payment,
      name
    });

    return {
      data,
    };
  },
});

sample({
  clock: deleteFile,
  target: deleteRequiredDocumentFx
})

export { $document, deleteFile, addFile, sendMonthOrderFx, sendPaymentOrderFx };
