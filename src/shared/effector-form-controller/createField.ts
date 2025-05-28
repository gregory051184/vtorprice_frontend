import {
  sample, combine, createStore, createEvent, Event,
} from 'effector';
import { FormField, FieldError } from './types';

type Config<T> = {
  initialValue: T,
  validateFn?: (value: T)=>FieldError | null,
  options?: {
    validateOn: Array<'onChange' | 'onFocus' | 'onBlur'>
  }
};

const defaultConfig = {
  validateFn: () => null,
  options: {
    validateOn: [],
  },
};

export const createField = <T>(config: Config<T>): FormField<T> => {
  const {
    validateFn,
    options,
  } = {
    ...defaultConfig,
    ...config,
  };

  const onFocus = createEvent();
  const onBlur = createEvent();
  const onChange = createEvent<T>();
  const validate = createEvent();

  const setValue = createEvent<T>();
  const setIsValid = createEvent<boolean>();

  const $value = createStore<T >(config.initialValue)
    .on(setValue, (_, value) => value)
    .on(onChange, (_, value) => value);

  const validateEvents: Array<Event<any>> = [validate];

  if (options.validateOn.includes('onChange')) {
    validateEvents.push(onChange);
  }

  if (options.validateOn.includes('onFocus')) {
    validateEvents.push(onFocus);
  }

  if (options.validateOn.includes('onBlur')) {
    validateEvents.push(onBlur);
  }

  const validationEvents = sample({
    source: $value,
    clock: validateEvents,
  });

  const $error = createStore<
  null | FieldError
  >(null).on(validationEvents, (_, value) => validateFn(value));

  return {
    store: combine({
      $value,
      $error,
    }),
    onBlur,
    onFocus,
    onChange,
    setIsValid,
    validate,
    setValue,
    $value,
  };
};
