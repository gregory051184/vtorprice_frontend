import { Store } from 'effector';
import { IWithClass } from '@types';
import { equipmentForm } from '@box/features/application/forms/create/equipment';

export interface IEquipmentForm extends IWithClass {
  form: typeof equipmentForm,
  totalPrice: Store<number[]>,
  buttonText?: string,
  isUpdate?: boolean,
}
