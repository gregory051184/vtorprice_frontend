import {useGate, useStore} from "effector-react";
import {
    $invoicesList,
    gate,
    headers,
    invoicesLoading,
    pagination, ordering, $invoicesCount
} from "@box/widgets/payment-invoice";
import {Pagination, Table} from "@box/shared/ui";
import s from "@box/widgets/payment-invoice/paymentInvoicesList/ui/style.module.scss";
import React, {useEffect} from "react";
import {PaymentInvoiceRowForStaff} from "@box/entities/statistics/ui/rows/paymentInvoiceRowForStaff";
import {useOrdering, usePagination} from "@box/shared/lib/factories";


export const PaymentInvoicesListForStaff = () => {
    useGate(gate);
    const {invoices} = useStore($invoicesList);
    const invoicesCount = useStore($invoicesCount);
    const loading = useStore(invoicesLoading.$loaderStore);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);

    const firstPageHandler = () => {
        pag.setFirstPage()
    };
    useEffect(() => {
    }, [invoices]);
    return (
        <div>
            <Table
                separate
                //loading={loading && pag.currentPage === 1}
                pagination={<Pagination pagination={pagination}/>}
                empty={invoices.length === 0}
                className={s.table_view}
            >
                <Table.Head
                    ordering={ord.ordering}
                    onOrderingChange={(e) => {
                        firstPageHandler()
                        ord.setOrdering(e)
                    }}
                    className={s.head} headers={headers}/>
                <Table.Body>
                    {invoices.map((invoice) => (
                        <PaymentInvoiceRowForStaff
                            invoice={invoice}
                            key={invoice.id}/>
                    ))}
                </Table.Body>
            </Table>
            {
                invoicesCount > 0 &&
                <div className="flex gap-4 cursor-pointer items-center float-right">
                    <p className="text-grey-50 text-sm whitespace-nowrap">Счетов</p>
                    <p>{invoicesCount}</p>
                </div>
            }
        </div>
    )
}