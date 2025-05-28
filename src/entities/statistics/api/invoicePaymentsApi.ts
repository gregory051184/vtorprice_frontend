import { $authHost } from "@box/shared/api";
import { Paginationable } from "@box/types";
import { AxiosResponse } from "axios";
import { PERIOD } from "./selects";

interface GetInvoicePaymentsParams {
  page: number;
  size: number;
}

interface GetInvoicePaymentsGraphParams {
  page: number;
  size: number;
  from_date: Date;
  to_date: Date;
  period: PERIOD;
}

export interface IInvoicePaymentNotifications {
  id: number;
  isDeleted: boolean;
  amount: number;
  createdAt: Date;
  status: { id: number; label: string };
  objectId: number;
  contentType: number;
  isRead: boolean;
  paymentOrder: Array<{
    createdAt: string;
    document: string;
    id: number;
    invoicePayment: number;
    isDeleted: boolean;
    name: string;
    total: number;
    type: { id: number; label: string };
  }>;
}

export interface IInvoicePayment {
  id: number;
  isDeleted: boolean;
  amount: number;
  createdAt: Date;
  status: number;
  objectId: number;
  contentType: number;
  isRead: boolean;
}

export interface IInvoicePaymentBill {
  id: number;
  isDeleted: boolean;
  createdAt: Date;
  document: string;
  status: number;
  objectId: number;
  contentType: number;
  type: { id: number; label: string };
}

export interface IInvoicePaymentsGraph {
  graph: {
    points: Array<{
      value: 1;
      date: Date;
    }>;
  };
  totalSumOfSells: number;
  totalVtorpriceEarnings: number;
}

class InvoicePaymentsApi {
  getTotalPerMonth(): Promise<AxiosResponse<{ total: number }>> {
    return $authHost.get("/invoice_payments/total_per_month/");
  }

  getAllInvoicedPayments(params: Partial<GetInvoicePaymentsParams>): Promise<
    AxiosResponse<
      {
        results: Array<IInvoicePayment>;
      } & Paginationable
    >
  > {
    return $authHost.get("/invoice_payments/", {
      params,
    });
  }

  getAllInvoicedPaymentsBill(
    params: {
      id: number;
    } | void
  ): Promise<AxiosResponse<IInvoicePaymentBill>> {
    return $authHost.get("/invoice_payments/get_payment_bill/", {
      params,
    });
  }

  getInvoicedPaymentAct(params: {
    id: number;
  }): Promise<AxiosResponse<IInvoicePaymentBill>> {
    return $authHost.get(`/invoice_payments/${params.id}/get_act/`, {
      params,
    });
  }

  getInvoicedPaymentsNotifications(
    params: Partial<GetInvoicePaymentsGraphParams>
  ): Promise<
    AxiosResponse<
      {
        results: Array<IInvoicePaymentNotifications>;
      } & Paginationable
    >
  > {
    return $authHost.get("/invoice_payments/manager_payments/", {
      params,
    });
  }

  postMonthOrder({
    document,
    total,
  }: {
    document: File;
    total: number;
  }): Promise<
    AxiosResponse<
      {
        results: Array<IInvoicePaymentNotifications>;
      } & Paginationable
    >
  > {
    return $authHost.post(
      "/invoice_payments/all_month_order/",
      {
        document,
        total,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  postPaymentOrder({
    id,
    document,
    total,
  }: {
    id: number;
    document: File;
    total: number;
  }): Promise<
    AxiosResponse<
      {
        results: Array<IInvoicePaymentNotifications>;
      } & Paginationable
    >
  > {
    return $authHost.post(
      `/invoice_payments/${id}/send_payment_order/`,
      {
        document,
        total,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  getInvoicedPaymentsDataGraph(
    params: Partial<GetInvoicePaymentsGraphParams>
  ): Promise<AxiosResponse<IInvoicePaymentsGraph>> {
    return $authHost.get("/invoice_payments/manager_payments_graph_data/", {
      params,
    });
  }
}

export const invoicePaymentsApi = new InvoicePaymentsApi();
