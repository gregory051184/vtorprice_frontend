import React, {useEffect} from "react";
import classNames from "classnames";
import {Button, Table} from "@box/shared/ui";
import {IPaymentInvoiceRow} from "./types";
import IconDownload from "@assets/icons/16_download.svg";

import s from "./style.module.scss";
import {formatAmount} from "@box/shared/lib/helpers/formaters";
import {InvoicePaymentStatus} from "@box/entities/statistics/ui/rows/paymentInvoiceRowForStaff/types";

export const PaymentInvoiceRow: React.FC<IPaymentInvoiceRow> = ({
                                                                    invoice,
                                                                    onClick,
                                                                    chooseInvoice,
                                                                    onDownload,
                                                                }) => {
    useEffect(() => {
    }, [invoice]);
    return (
        <Table.Row
            onClick={onClick}
            isHover={false}
            className={classNames(
                {"bg-green-light": chooseInvoice},
                "h-[69px] cursor-pointer",
                s.row
            )}
        >
            <Table.Cell className="font-medium">
                <p>Платеж за сделку №{invoice.id}</p>
            </Table.Cell>
            <Table.Cell className="font-medium">
                <p>{formatAmount(invoice.amount)} ₽</p>
            </Table.Cell>
            <Table.Cell
                className={invoice.status.id === InvoicePaymentStatus.PENDING
                    ? "text-orange-dark w-[180px] cursor-pointer font-medium" :
                    invoice.status.id === InvoicePaymentStatus.PAID ?
                        "text-green-dark w-[180px] cursor-pointer font-medium" :
                        invoice.status.id === InvoicePaymentStatus.CANCELED ?
                            "w-[180px] text-blue-2x-dark cursor-pointer font-medium" :
                            invoice.status.id === InvoicePaymentStatus.REFUNDED ?
                                "w-[180px] text-red-dark cursor-pointer font-medium"
                                : "w-[180px] cursor-pointer font-medium"}>
                <p>{invoice.status.label}</p>
            </Table.Cell>
            <Table.Cell className={invoice.paymentOrder.length > 0 ? "font-medium text-green-dark cursor-pointer" :
                "font-medium text-red-dark cursor-pointer"}>
                <p>{invoice.paymentOrder.length > 0 ? 'ПП' : 'Нет ПП'}</p>
            </Table.Cell>
            <Table.Cell align="right">
                <Button
                    type="mini"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDownload();
                    }}
                    iconRight={<IconDownload/>}
                    mode="notFilled"
                >
                    Акт
                </Button>
            </Table.Cell>

        </Table.Row>
    );
};
