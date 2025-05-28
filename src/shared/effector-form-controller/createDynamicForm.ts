import { createGate } from 'effector-react';
import {
  createEffect, sample, createStore, createEvent,
} from 'effector';
import { v4 as uuidv4 } from 'uuid';
import { MutableRefObject } from 'react';
import { DynamicField, DynamicForm, FieldError } from './types';

type Config<T> = {
  initialValue: { [key: string]: T & DynamicField },
  validators: {
    [key: string]:(val: any)=> FieldError | null
  },
  emptyValue: T,
  sid: string
};

export const createDynamicForm = <T>({
  initialValue, validators, emptyValue, sid,
}: Config<T>): DynamicForm<T> => {
    type DynamicFieldValues = T & DynamicField;
    type Keys = keyof T;

    const submit = createEvent();
    const formValid = createEvent();
    const setErrors = createEvent();
    const resetErrors = createEvent();

    const addField = createEvent();
    const deleteField = createEvent<string>();
    const setValue = createEvent<{ id: string, name: Keys, value: T[Keys] }>();
    const setValues = createEvent< { [key: string]: DynamicFieldValues }>();

    const $errors = createStore<{ [key: string]: any }>({}, {
      sid: `${sid}_FORM_ERRORS`,
    }).on(setErrors, (_, val) => val).reset(resetErrors);

    const isFormValid = $errors.map((val) => Object.keys(val).length === 0);

    const formGate = createGate<MutableRefObject<HTMLFormElement | null> | null>({
      defaultState: null,
    });

    const $fields = createStore<{
      [key: string]: DynamicFieldValues
    }>(initialValue, {
      sid: `${sid}_FORM_FIELDS`,
    })
      .on(addField, (store) => {
        const id = uuidv4();
        return {
          ...store,
          [id]: {
            id,
            ...emptyValue,
            removable: true,
          },
        };
      })
      .on(deleteField, (store, id) => {
        const copy = { ...store };
        delete copy[id];

        return copy;
      })
      .on(setValue, (store, params) => {
        const copy = { ...store };
        if (copy[params.id]) {
          // TODO fix
          // @ts-ignore
          copy[params.id][params.name] = params.value;
        }

        return copy;
      })
      .on(setValues, (store, values) => values);

    const validateFx = createEffect<{
      [key: string]: DynamicFieldValues
    }, any, any>({
      handler: (form) => {
        const errors:{ [key:string]: any } = {};
        const fields = Object.values(form);

        // eslint-disable-next-line no-restricted-syntax
        for (const field of fields) {
          const entries = Object.entries(field);
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, fieldValue] of entries) {
            try {
              if (!['id', 'removable'].includes((key))) {
                if (validators[key]) {
                  const hasError = validators[key](fieldValue);
                  if (hasError) {
                    if (!errors[field.id]) {
                      errors[field.id] = {};
                    }
                    errors[field.id][key] = hasError.message;
                  }
                }
              }
            } catch { /* empty */ }
          }
        }
        const formValid = Object.keys(errors).length === 0;

        if (formValid) return true;

        throw errors;
      },
    });

    const scrollIntoViewFx = createEffect<
    MutableRefObject<HTMLFormElement | null>
    | null, void, void>({
      handler: (ref) => {
        if (ref && ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
          });
        }
      },
    });

    sample({
      clock: validateFx.fail,
      source: formGate.state,
      target: scrollIntoViewFx,
    });

    sample({
      clock: submit,
      source: $fields,
      target: validateFx,
    });

    sample({
      source: validateFx.doneData,
      target: [resetErrors, formValid],
    });

    sample({
      source: validateFx.failData,
      target: setErrors,
    });

    return {
      $fields,
      formGate,
      addField,
      deleteField,
      setValue,
      setValues,
      formValid,
      isFormValid,
      $errors,
      submit,
      validateFx,
    };
};
