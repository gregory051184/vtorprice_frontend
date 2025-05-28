import {
  createStore,
  Domain,
  Event,
  Store,
  combine,
  sample,
  guard,
  merge,
} from 'effector';
import {
  ValidationError,
  Field,
  FieldData,
  FieldConfig,
  AnyFormValues,
  ValidationEvent,
  Rule,
  RuleResolver,
} from './types';
import { createCombineValidator } from './validation';
import { createFormUnit } from './create-form-unit';

export function createField(
  fieldName: string,
  fieldConfig: FieldConfig<any>,
  domain?: Domain,
): Field<any> {
  const initValue = typeof fieldConfig.init === 'function'
    ? fieldConfig.init()
    : fieldConfig.init;

  const $value = createFormUnit.store({
    domain,
    existing: fieldConfig.units?.$value,
    init: initValue,
  });

  const $errors = createFormUnit.store<ValidationError[]>({
    domain,
    existing: fieldConfig.units?.$errors,
    init: [],
  });

  const $firstError = $errors.map(
    (errors) => (errors[0] ? errors[0] : null)
  );

  const $isDirty = $value.map((value) => value !== initValue);

  const $touched = createFormUnit.store({
    domain,
    existing: fieldConfig.units?.$isTouched,
    init: false,
  });

  const onChange = createFormUnit.event<void>({});
  const onBlur = createFormUnit.event<void>({});
  const changed = createFormUnit.event<void>({});
  const addError = createFormUnit.event<{
    rule: string
    errorText?: string
  }>({});
  const validate = createFormUnit.event<void>({});
  const resetErrors = createFormUnit.event<void>({});
  const resetValue = createFormUnit.event<void>({});
  const reset = createFormUnit.event<void>({});

  const $isValid = $firstError.map((firstError) => firstError === null);

  const $field = combine({
    value: $value,
    errors: $errors,
    firstError: $firstError,
    isValid: $isValid,
    isDirty: $isDirty,
    isTouched: $touched,
  });

  return {
    changed,
    name: fieldName,
    $value,
    $errors,
    $firstError,
    $isValid,
    $isDirty,
    $isTouched: $touched,
    $touched,
    $field: $field as Store<FieldData<any>>,
    onChange,
    onBlur,
    addError,
    validate,
    set: onChange,
    reset,
    resetErrors,
    resetValue,
    filter: fieldConfig.filter,
  };
}

type BindValidationParams = {
  $form: Store<AnyFormValues>
  validateFormEvent: Event<void>
  submitEvent: Event<void>
  resetFormEvent: Event<void>
  resetValues: Event<void>
  resetErrors: Event<void>
  field: Field<any>
  rules: Rule<any, any>[] | RuleResolver<any, any>
  formValidationEvents: ValidationEvent[]
  fieldValidationEvents: ValidationEvent[]
};

export function bindValidation(
  {
    $form,
    validateFormEvent,
    submitEvent,
    resetFormEvent,
    resetValues,
    field,
    rules,
    resetErrors: resetErrorsFormEvent,
    formValidationEvents,
    fieldValidationEvents,
  }: BindValidationParams,
  effectorData?: any
): void {
  const {
    $value,
    $errors,
    onBlur,
    changed,
    addError,
    validate,
    resetErrors,
    resetValue,
    reset,
  } = field;

  const rulesSources = typeof rules === 'function'
    ? createStore<any[]>([], effectorData)
    : combine(
      rules.map(({ source }) => source || createStore(null, effectorData))
    );

  const validator = createCombineValidator(rules);
  const eventsNames = [...formValidationEvents, ...fieldValidationEvents];
  const validationEvents: Event<{
    fieldValue: any
    form: AnyFormValues
    rulesSources: any[]
  }>[] = [];

  if (eventsNames.includes('submit')) {
    const validationTrigger = sample({
      source: combine({
        fieldValue: $value,
        form: $form,
        rulesSources,
      }),
      clock: submitEvent,
    });

    validationEvents.push(validationTrigger);
  }

  if (eventsNames.includes('blur')) {
    validationEvents.push(sample({
      source: combine({
        fieldValue: $value,
        form: $form,
        rulesSources,
      }),
      clock: onBlur,
    }));
  }

  if (eventsNames.includes('change')) {
    validationEvents.push(sample({
      source: combine({
        fieldValue: $value,
        form: $form,
        rulesSources,
      }),
      clock: merge(
        [changed, resetValue, resetValues]
      ),
    }));
  }

  validationEvents.push(sample({
    source: combine({
      fieldValue: $value,
      form: $form,
      rulesSources,
    }),
    clock: validate,
  }));

  validationEvents.push(sample({
    source: combine({
      fieldValue: $value,
      form: $form,
      rulesSources,
    }),
    clock: validateFormEvent,
  }));

  const addErrorWithValue = sample({
    source: $value,
    clock: addError,
    fn: (value, { rule, errorText }): ValidationError => ({
      rule,
      value,
      errorText,
    }),
  });

  $errors
    .on(
      validationEvents,
      (_, { form, fieldValue, rulesSources }) => {
        return validator(
            fieldValue,
            form,
            rulesSources,
        )
      }
    )
    .on(addErrorWithValue, (errors, newError) => [newError, ...errors])
    .reset(resetErrors, resetFormEvent, reset, resetErrorsFormEvent);

  if (!eventsNames.includes('change')) {
    $errors.reset(changed);
  }
}

export function bindChangeEvent(
  {
    $value,
    $touched,
    onChange,
    changed,
    name,
    reset,
    resetValue,
    filter
  }: Field<any>,
  setForm: Event<Partial<AnyFormValues>>,
  resetForm: Event<void>,
  resetTouched: Event<void>,
  resetValues: Event<void>,
): void {
  $touched
    .on(changed, () => true)
    .reset(reset, resetForm, resetTouched);

  guard({
    source: onChange,
    filter: filter || (() => true),
    target: changed,
  });

  $value
    .on(changed, (_, value) => value)
    .on(
      setForm,
      (curr, updateSet) => (updateSet.hasOwnProperty(name)
        ? updateSet[name]
        : curr)
    )
    .reset(reset, resetValue, resetValues, resetForm);
}
