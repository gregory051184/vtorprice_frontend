import {$authHost} from "@box/shared/api";
import {Paginationable} from "@box/types";
import {AxiosResponse} from "axios";
import {PERIOD} from "./selects";
import {ICompany} from "@box/entities/company/model";
import {IStatus} from "@box/entities/logistics/model";

interface GetInvoicePaymentsParams {
    page: number;
    size: number;
    ordering?: string | null,
    period?: string,
    created_at__gte: Date | null,
    created_at__lte: Date | null,
    search?: string,
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
    status: IStatus;
    objectId: number;
    contentType: number;
    isRead: boolean;
    company: ICompany;
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

type UpdateInvoiceStatusParams = {
    id: number,
    status: string,
};

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
                         invoice_payment,
                         name
                     }: {
        id: number;
        document: File;
        total: number;
        invoice_payment?: number;
        name?: string
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
                invoice_payment,
                name
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

    patchInvoiceStatus(data: UpdateInvoiceStatusParams): Promise<AxiosResponse<IInvoicePayment>> {
        const {id, ...params} = data;
        return $authHost.patch(`/invoice_payments/${id}/`, {
                ...params
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    };
}

export const invoicePaymentsApi = new InvoicePaymentsApi();
