import { IWithClass } from "@types";

interface IEquipmentDealFlowForm extends IWithClass {
  whoDelivers?: number;
  isSupplier?: boolean;
  isBuyer?: boolean;
  buyerpaysshipping?: boolean;
  disabled?: boolean;
  deliveryPrice?: number;
  contractor?: string;
}

export type { IEquipmentDealFlowForm };
