import { useStore, useEvent, useGate } from 'effector-react';
import { MutableRefObject } from 'react';
import { FormField, DynamicForm, Form } from '../types';

export const useField = (field: FormField) => {
  const store = useStore(field.store);

  return {
    store,
    setValue: useEvent(field.setValue),
    onFocus: useEvent(field.onFocus),
    onChange: useEvent(field.onChange),
    onBlur: useEvent(field.onBlur),
  };
};

// eslint-disable-next-line max-len
export const useForm = (form: Form, formRef: MutableRefObject<HTMLFormElement | null> = { current: null }) => {
  useGate(form.formGate, formRef);
  return {
    submit: useEvent(form.submit),
    isFormValid: useStore(form.isFormValid),
  };
};

// eslint-disable-next-line max-len
export const useDynamicForm = (form: DynamicForm<any>, formRef: MutableRefObject<HTMLFormElement | null> = { current: null }) => {
  useGate(form.formGate, formRef);
  const fields = useStore(form.$fields);
  const errors = useStore(form.$errors);

  return {
    fields: Object.values(fields),
    errors,
    addField: useEvent(form.addField),
    deleteField: useEvent(form.deleteField),
    setValue: useEvent(form.setValue),
    submit: useEvent(form.submit),
  };
};
