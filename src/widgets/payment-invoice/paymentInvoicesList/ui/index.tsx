import React, {useEffect} from "react";
import classNames from "classnames";

import {Pagination, Table, Tip} from "@box/shared/ui";
import {IWithClass} from "@box/types";
import {useGate, useStore, useUnit} from "effector-react";

import {headers} from "../lib";
import {
    $invoicesList,
    chooseTheInvoice,
    gate,
    getActFx,
    getInvoiceBillFx,
    invoicesLoading,
    pagination,
    ordering, $invoicesCount
} from "../model";

import {PaymentInvoiceRow} from "@box/entities/statistics/ui/rows/paymentInvoiceRow";
import {PaymentBar} from "@box/features/payment-invoice/paymentBar";
import {useScreenSize} from "@box/shared/hooks";
import {PaymentInvoiceCard} from "@box/entities/statistics/ui/rows/paymentInvoiceCard";

import s from "./style.module.scss";
import {useOrdering} from "@box/shared/lib/factories";

export const PaymentInvoicesList: React.FC<IWithClass> = ({className}) => {
    useGate(gate);
    const {invoices, total, choosen} = useStore($invoicesList);
    const invoicesCount = useStore($invoicesCount);
    const loading = useStore(invoicesLoading.$loaderStore);
    const ord = useOrdering(ordering);
    const chooseTheInvoicePayment = useUnit(chooseTheInvoice);
    const getInvoiceBill = useUnit(getInvoiceBillFx);
    const getAct = useUnit(getActFx);
    const [, satisfies] = useScreenSize();

    const handleGetBill = (id?: number) => {
        if (id) {
            return getInvoiceBill({id});
        }
        if (choosen) {
            return getInvoiceBill({id: choosen.id});
        } else {
            getInvoiceBillFx();
        }
    };
    useEffect(() => {
    }, [invoices, choosen]);
    return (
        <div className={classNames("flex gap-8 items-start", s.box, className)}>
            <div className="flex-grow">
                <Tip>
                    <p>
                        Выберите счёт для оплаты. Появится возможность скачать данный счёт.
                        Оплатив счёт, прикрепите платёжку и сохраните. После проверки,
                        Ваш счёт получит статус "Оплачен".
                    </p>
                </Tip>
                {satisfies("md") ? (
                    <div>
                        <Table
                            separate
                            loading={loading}
                            pagination={<Pagination pagination={pagination}/>}
                            empty={invoices.length === 0}
                            className={s.table_view}
                        >
                            <Table.Head
                                ordering={ord.ordering}
                                onOrderingChange={ord.setOrdering}
                                className={s.head} headers={headers}/>
                            <Table.Body>
                                {invoices.map((invoice) => (
                                    <PaymentInvoiceRow
                                        invoice={invoice}
                                        key={invoice.id}
                                        chooseInvoice={invoice.id === choosen?.id}
                                        onClick={() =>
                                            chooseTheInvoicePayment({
                                                id: invoice.id,
                                                amount: invoice.amount,
                                                paymentOrderId: invoice.paymentOrder.length > 0 ? invoice.paymentOrder[0].id : 0
                                            })
                                        }
                                        onDownload={() => getAct({id: invoice.id})}
                                    />
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
                ) : (
                    <div className={s.card_view}>
                        <div className={classNames(s.card_view_block)}>
                            {invoices.map((invoice) => (
                                <PaymentInvoiceCard
                                    className={s.card_view_card}
                                    invoice={invoice}
                                    key={invoice.id}
                                    chooseInvoice={invoice.id === choosen?.id}
                                    onClick={() =>
                                        chooseTheInvoicePayment({
                                            id: invoice.id,
                                            amount: invoice.amount,
                                            paymentOrderId: invoice.paymentOrder.length > 0 ? invoice.paymentOrder[0].id : 0
                                        })
                                    }
                                    onDownload={() => getAct({id: invoice.id})}
                                />
                            ))}
                        </div>
                        <Pagination pagination={pagination}/>
                        {
                            invoicesCount > 0 &&
                            <div className="flex gap-4 cursor-pointer items-center float-right">
                                <p className="text-grey-50 text-sm whitespace-nowrap">Счетов</p>
                                <p>{invoicesCount}</p>
                            </div>
                        }
                    </div>
                )}
            </div>

            <PaymentBar
                //total={choosen?.amount ?? total}
                total={total}
                getBill={() => handleGetBill()}
                choosen={choosen}
            />
        </div>
    );
};
