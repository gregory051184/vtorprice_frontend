import { IInvoicePayment } from "@box/entities/statistics/api/invoicePaymentsApi";

export interface IPaymentInvoiceRow {
  invoice: IInvoicePayment;
  onClick: () => void;
  chooseInvoice: boolean;
  onDownload: () => void;
}
