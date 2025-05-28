import React from "react";
import classNames from "classnames";

import IconDownload from "@assets/icons/16_download.svg";
import IconUpload from "@assets/icons/16_upload.svg";

import { Button, Drawer } from "@box/shared/ui";
import { useBoolean } from "@box/shared/hooks";
import { useStore, useUnit } from "effector-react";
import { FileForPayments } from "@box/entities/statistics/ui/file";

import { IPaymentBar } from "./type";
import {
  $document,
  addFile,
  deleteFile,
  sendMonthOrderFx,
  sendPaymentOrderFx,
} from "../model";

import s from "./style.module.scss";
import { formatAmount } from "@box/shared/lib/helpers/formaters";

export const PaymentBar: React.FC<IPaymentBar> = ({
  total,
  getBill,
  choosen,
}) => {
  const { value, toggle } = useBoolean(false);
  const documentFile = useStore($document);
  const addDocument = useUnit(addFile);
  const deleteDocument = useUnit(deleteFile);
  const sendDocumentMonth = useUnit(sendMonthOrderFx);
  const sendDocumentPayment = useUnit(sendPaymentOrderFx);

  const handleSendDocument = () => {
    if (documentFile && choosen) {
      sendDocumentPayment({
        id: choosen.id,
        document: documentFile,
        total,
      });
      toggle();
      return;
    }
    if (documentFile) {
      sendDocumentMonth({ document: documentFile, total });
      toggle();
      return;
    }
  };

  return (
    <div className={s.box}>
      <Drawer
        bottomActions={
          <div className="flex gap-[15px]">
            <Button
              disabled={!documentFile}
              onClick={handleSendDocument}
              className="grow"
            >
              Отправить
            </Button>
          </div>
        }
        title="Платежное поручение"
        visible={value}
        close={() => {
          toggle();
          deleteDocument();
        }}
      >
        <div className="grid grid-cols-1 auto-rows-auto gap-[25px]">
          <FileForPayments
            name="Прикрепить документ"
            file={documentFile?.name}
            onSelect={addDocument}
            onDelete={deleteDocument}
          />
        </div>
      </Drawer>
      <div
        className={classNames(
          "border border-grey-20 border-solid rounded-2xl px-5 py-6 grow "
        )}
      >
        <p className="text-grey-50 text-sm mb-2">{choosen ? `К оплате за сделку №${choosen.id}` :'К оплате'}</p>
        <h3 className="text-2xl font-medium mb-6">{formatAmount(total)} ₽</h3>
        <Button
          className="w-full mb-3"
          iconLeft={<IconDownload />}
          mode="stroke"
          type="mini"
          onClick={getBill}
        >
          Счет на оплату
        </Button>
        <Button
          onClick={toggle}
          className="w-full"
          iconLeft={<IconUpload />}
          type="mini"
        >
          Платежное поручение
        </Button>
      </div>
    </div>
  );
};
