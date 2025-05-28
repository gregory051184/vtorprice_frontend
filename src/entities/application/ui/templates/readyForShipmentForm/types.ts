import { Form } from '@box/shared/effector-forms';
import { Store } from 'effector';
import { IWithClass } from '@types';

export interface IReadyForShipmentForm extends IWithClass {
  form: Form<any>,
  totalWeight: Store<number>,

  totalPrice: Store<number[]>,
  buttonText?: string
}
