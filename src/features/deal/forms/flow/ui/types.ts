import { IWithClass } from "@types";

interface IDealFlowForm extends IWithClass {
  totalPrice?: number;
  deliveryPrice?: number;
  contractor?: string;
  whoDelivers?: number;
  isSupplier?: boolean;
  isBuyer?: boolean;
  buyerpaysshipping?: boolean;
  disabled?: boolean;
}

interface IRecyclablesDealForm {
  disabled?: boolean;
  totalPrice?: number;
}

export type { IDealFlowForm, IRecyclablesDealForm };
