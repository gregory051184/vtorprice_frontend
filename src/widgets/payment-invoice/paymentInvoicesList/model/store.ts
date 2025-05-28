import {
  attach,
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from "effector";
import { createGate } from "effector-react";
import { AxiosError } from "axios";

import { createPagination } from "@box/shared/lib/factories";
import { createLoaderStore } from "@box/shared/lib/helpers";
import { financialDataFiltersModel } from "@box/features/statistics";
import Router from "next/router";
import {
  IInvoicePayment,
  invoicePaymentsApi,
} from "@box/entities/statistics/api/invoicePaymentsApi";

const gate = createGate();
const chooseTheInvoice = createEvent<{ id: number; amount: number }>();
const blurTheInvoice = createEvent();

const getInvoicesFx = createEffect<
  Parameters<typeof invoicePaymentsApi.getAllInvoicedPayments>[0],
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.getAllInvoicedPayments>
    >["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await invoicePaymentsApi.getAllInvoicedPayments(params);

    return {
      data,
      page: params.page,
    };
  },
});

const getActFx = createEffect<
  Parameters<typeof invoicePaymentsApi.getInvoicedPaymentAct>[0],
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.getInvoicedPaymentAct>
    >["data"];
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await invoicePaymentsApi.getInvoicedPaymentAct(params);

    Router.push(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`);
    return {
      data,
    };
  },
});

const getInvoiceBillFx = createEffect<
  Parameters<typeof invoicePaymentsApi.getAllInvoicedPaymentsBill>[0] | void,
  {},
  AxiosError
>({
  handler: async (params) => {
    const { data } = await invoicePaymentsApi.getAllInvoicedPaymentsBill(
      params
    );
    Router.push(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`);
    return {};
  },
});

const getTotalPerMonthFx = createEffect<
  void,
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.getTotalPerMonth>
    >["data"];
  },
  AxiosError
>({
  handler: async () => {
    const { data } = await invoicePaymentsApi.getTotalPerMonth();

    return {
      data,
    };
  },
});

const invoicesLoading = createLoaderStore(false, getInvoicesFx);

const pagination = createPagination(
  getInvoicesFx,
  merge([gate.close, financialDataFiltersModel.filters.$values])
);

const getInvoices = attach({
  source: {
    page: pagination.$currentPage,
    size: pagination.$perPage,
  },
  mapParams: (_, { page, size }) => ({
    page,
    size,
  }),
  effect: getInvoicesFx,
});

const $invoicesList = createStore<{
  choosen: { id: number; amount: number } | null;
  total: number;
  invoices: Array<IInvoicePayment>;
}>({ total: 0, invoices: [], choosen: null })
  .on(getInvoicesFx.doneData, (store, payload) => {
    if (payload.page && payload.page > 1) {
      return {
        ...store,
        invoices: [...store.invoices, ...payload.data.results],
      };
    }
    return { ...store, invoices: [...payload.data.results] };
  })
  .on(getTotalPerMonthFx.doneData, (store, payload) => ({
    ...store,
    total: payload.data.total,
  }))
  .on(chooseTheInvoice, (store, payload) => {
    if (store.choosen?.id === payload.id) {
      return { ...store, choosen: null };
    } else {
      return { ...store, choosen: payload };
    }
  })
  .on(blurTheInvoice, (store, _) => ({ ...store, choosen: null }));

sample({
  clock: [gate.open, pagination.loadMore, pagination.setPerPage],
  target: [getInvoices, getTotalPerMonthFx],
});

export {
  $invoicesList,
  gate,
  getActFx,
  pagination,
  invoicesLoading,
  chooseTheInvoice,
  getInvoiceBillFx,
  blurTheInvoice,
};
