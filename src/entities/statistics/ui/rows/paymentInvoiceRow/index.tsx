import React from "react";
import classNames from "classnames";
import { Button, Table } from "@box/shared/ui";
import { IPaymentInvoiceRow } from "./types";
import IconDownload from "@assets/icons/16_download.svg";

import s from "./style.module.scss";
import { formatAmount } from "@box/shared/lib/helpers/formaters";

export const PaymentInvoiceRow: React.FC<IPaymentInvoiceRow> = ({
  invoice,
  onClick,
  chooseInvoice,
  onDownload,
}) => {
  return (
    <Table.Row
      onClick={onClick}
      isHover={false}
      className={classNames(
        { "bg-green-light": chooseInvoice },
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
      <Table.Cell align="right">
        <Button
          type="mini"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          iconRight={<IconDownload />}
          mode="notFilled"
        >
          Акт
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};
