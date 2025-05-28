import {
  createEffect, sample, Store, combine, createEvent,
} from 'effector';
import { createGate } from 'effector-react';
import { MutableRefObject } from 'react';
import { Form, FormField } from './types';

const eachValid = (fields: Array<FormField>): Store<boolean> => {
  let shape: Array<Store<any>> = [];
  shape = fields.map((field) => field.store.map((store) => store.$error));
  return combine(shape).map((val) => val.every((el) => el == null));
};

export const createForm = (...fields: Array<FormField>): Form => {
  const submit = createEvent();
  const formValid = createEvent();
  const formGate = createGate<MutableRefObject<HTMLFormElement | null> | null>({
    defaultState: null,
  });

  const scrollIntoViewFx = createEffect<
  MutableRefObject<HTMLFormElement | null> | null,
  void, void>({
    handler: (ref) => {
      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    },
  });

  const isFormValid = eachValid(fields);

  // eslint-disable-next-line no-restricted-syntax
  for (const field of fields) {
    sample({
      clock: submit,
      target: field.validate,
    });
  }

  sample({
    clock: submit,
    filter: isFormValid,
    target: formValid,
  });

  sample({
    clock: submit,
    filter: isFormValid.map((val) => !val),
    source: formGate.state,
    target: scrollIntoViewFx,
  });

  return {
    isFormValid,
    formValid,
    formGate,
    submit,
  };
};
