import { IInvoicePayment } from "@box/entities/statistics/api/invoicePaymentsApi";
import { IWithClass } from "@box/types";

export interface IPaymentInvoiceCard extends IWithClass {
  invoice: IInvoicePayment;
  onClick: () => void;
  chooseInvoice: boolean;
  onDownload: () => void;
}
