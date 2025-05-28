import { Form } from '@box/shared/effector-forms';
import { IWithClass } from '@types';

export interface ICreateTransportApplicationForm extends IWithClass {
  form: Form<any>,
  buttonText?: string
}
