import React from "react";
import classNames from "classnames";

import { Pagination, Table } from "@box/shared/ui";
import { IWithClass } from "@box/types";
import { useGate, useStore, useUnit } from "effector-react";

import { headers } from "../lib";
import {
  $invoicesList,
  chooseTheInvoice,
  gate,
  getActFx,
  getInvoiceBillFx,
  invoicesLoading,
  pagination,
} from "../model";

import { PaymentInvoiceRow } from "@box/entities/statistics/ui/rows/paymentInvoiceRow";
import { PaymentBar } from "@box/features/payment-invoice/paymentBar";
import { useScreenSize } from "@box/shared/hooks";
import { PaymentInvoiceCard } from "@box/entities/statistics/ui/rows/paymentInvoiceCard";

import s from "./style.module.scss";

export const PaymentInvoicesList: React.FC<IWithClass> = ({ className }) => {
  useGate(gate);
  const { invoices, total, choosen } = useStore($invoicesList);
  const loading = useStore(invoicesLoading.$loaderStore);
  const chooseTheInvoicePayment = useUnit(chooseTheInvoice);
  const getInvoiceBill = useUnit(getInvoiceBillFx);
  const getAct = useUnit(getActFx);
  const [, satisfies] = useScreenSize();

  const handleGetBill = (id?: number) => {
    if (id) {
      return getInvoiceBill({ id });
    }
    if (choosen) {
      return getInvoiceBill({ id: choosen.id });
    } else {
      getInvoiceBillFx();
    }
  };

  return (
    <div className={classNames("flex gap-8 items-start", s.box, className)}>
      <div className="flex-grow">
        {satisfies("md") ? (
          <Table
            separate
            loading={loading}
            pagination={<Pagination pagination={pagination} />}
            empty={invoices.length === 0}
            className={s.table_view}
          >
            <Table.Head className={s.head} headers={headers} />
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
                    })
                  }
                  onDownload={() => getAct({ id: invoice.id })}
                />
              ))}
            </Table.Body>
          </Table>
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
                    })
                  }
                  onDownload={() => getAct({ id: invoice.id })}
                />
              ))}
            </div>
            <Pagination pagination={pagination} />
          </div>
        )}
      </div>

      <PaymentBar
        total={choosen?.amount ?? total}
        getBill={()=>handleGetBill()}
        choosen={choosen}
      />
    </div>
  );
};
