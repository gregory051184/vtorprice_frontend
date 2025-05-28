import { Effect, Event, Store } from 'effector';
import { Gate } from 'effector-react';
import { MutableRefObject } from 'react';

export type FieldError = {
  message: string
};

export type FormField<T = any> = {
  store: Store<{
    $value: T,
    $error: null | FieldError
  }>,
  onBlur: Event<void>,
  onFocus: Event<void>,
  onChange: Event<T>,
  setValue: Event<T>,
  setIsValid: Event<boolean>
  validate: Event<void>
  $value: Store<T>,
};

export type DynamicField = {
  id: string
  removable: boolean
};

export type DynamicForm<T=any> = {
  $fields: Store<{ [key: string]: T & DynamicField }>,
  addField: Event<void>,
  deleteField: Event<string>,
  setValue: Event<{ id: string, name: any, value: any }>,
  setValues: Event<{ [key: string]: T & DynamicField }>,
  formValid: Event<any>,
  $errors: Store<{ [key: string]: {
    [key: string]: boolean
  } }>,
  isFormValid: Store<boolean>
  formGate: Gate<MutableRefObject<HTMLFormElement | null> | null>
  submit: Event<void>,
  validateFx: Effect<any, any, any>
};

export type Form = {
  isFormValid: Store<boolean>
  formValid: Event<void>
  submit: Event<void>
  formGate: Gate<MutableRefObject<HTMLFormElement | null> | null>
};
