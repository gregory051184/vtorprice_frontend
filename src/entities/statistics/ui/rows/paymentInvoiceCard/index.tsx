import React from "react";
import classNames from "classnames";
import { Button, Separator} from "@box/shared/ui";
import { IPaymentInvoiceCard } from "./types";
import IconDownload from "@assets/icons/16_download.svg";

export const PaymentInvoiceCard: React.FC<IPaymentInvoiceCard> = ({
  invoice,
  className,
  onClick,
  chooseInvoice,
  onDownload,
}) => (
  <div
    className={classNames(
      "p-[16px] rounded-[10px]",
      { "bg-green-light": chooseInvoice, "bg-grey-10": !chooseInvoice },
      className
    )}
    onClick={onClick}
  >
    <div className="flex justify-between">
      <div>
        <p>Название</p>
        <p className='font-medium'>Платеж за сделку №{invoice.id}</p>
      </div>
      <p>{invoice.amount} ₽</p>
    </div>
    <Separator h={10} />
    <div>
      <Button
        type="mini"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        iconRight={<IconDownload />}
        mode="notFilled"
        className="mx-auto"
      >
        Акт
      </Button>
    </div>
  </div>
);
