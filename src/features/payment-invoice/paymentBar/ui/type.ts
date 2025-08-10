export interface IPaymentBar {
  total: number;
  getBill: () => void;
  choosen: { id: number; amount: number; paymentOrderId: number } | null;
}
