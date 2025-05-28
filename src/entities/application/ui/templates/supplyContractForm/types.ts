import { Form } from '@box/shared/effector-forms';
import { Store } from 'effector';
import { IWithClass } from '@types';

export interface ISupplyContractForm extends IWithClass {
  form: Form<any>,
  totalPrice: Store<number[]>,
  isUpdate?: boolean
}
