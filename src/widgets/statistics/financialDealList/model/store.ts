import { attach, createEffect, createStore, merge, sample } from "effector";
import { createGate } from "effector-react";
import { AxiosError } from "axios";

import { createPagination } from "@box/shared/lib/factories";
import { createLoaderStore } from "@box/shared/lib/helpers";
import { financialDataFiltersModel } from "@box/features/statistics";
import {
  IInvoicePaymentNotifications,
  invoicePaymentsApi,
} from "@box/entities/statistics/api/invoicePaymentsApi";

const gate = createGate();

const getNotificationsFx = createEffect<
  Parameters<typeof invoicePaymentsApi.getInvoicedPaymentsNotifications>[0],
  {
    data: Awaited<
      ReturnType<typeof invoicePaymentsApi.getInvoicedPaymentsNotifications>
    >["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await invoicePaymentsApi.getInvoicedPaymentsNotifications(
      params
    );

    return {
      data,
      page: params.page,
    };
  },
});

const notificationsLoading = createLoaderStore(false, getNotificationsFx);

const pagination = createPagination(
  getNotificationsFx,
  merge([gate.close, financialDataFiltersModel.filters.$values])
);

const getNotifications = attach({
  source: {
    filters: financialDataFiltersModel.filters.$values,
    page: pagination.$currentPage,
    size: pagination.$perPage,
  },
  mapParams: (_, { filters, page, size }) => ({
    page,
    size,
    period: filters.period.value,
    ...(filters.created_at[0] && {
      from_date: filters.created_at[0],
    }),
    ...(filters.created_at[1] && {
      to_date: filters.created_at[1],
    }),
  }),
  effect: getNotificationsFx,
});

const $notificationsList = createStore<Array<IInvoicePaymentNotifications>>(
  []
).on(getNotificationsFx.doneData, (store, payload) => {
  const filterPayload = payload.data.results.filter(
    (item) => item.paymentOrder.length > 0 && item.status.id === 2
  );
  if (payload.page && payload.page > 1) {
    return [...store, ...filterPayload];
  }
  return [...filterPayload];
});

sample({
  clock: [
    gate.open,
    pagination.loadMore,
    pagination.setPerPage,
    financialDataFiltersModel.filters.$values,
  ],
  target: getNotifications,
});

export { $notificationsList, gate, pagination, notificationsLoading };
