// @ts-ignore
import {
  Event,
  Store,
  combine,
  sample,
  guard,
  // @ts-ignore
  withFactory
} from 'effector';
import {
  AnyFields,
  AnyFormValues,
  FormConfig,
  Form,
} from './types';
import { eachValid } from './validation';
import {
  createField,
  bindValidation,
  bindChangeEvent,
} from './field';
import { createFormUnit } from './create-form-unit';

function createFormValuesStore(
  fields: AnyFields
): Store<AnyFormValues> {
  const shape: { [key: string]: Store<any> } = {};

  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue;
    shape[fieldName] = fields[fieldName].$value;
  }

  return combine(shape);
}

export function createForm<Values extends AnyFormValues>(
  config: FormConfig<Values>
) {
  const {
    filter: $filter,
    domain,
    fields: fieldsConfigs,
    validateOn,
    units,
  } = config;

  const fields: AnyFields = {};

  const dirtyFlagsArr: Store<boolean>[] = [];
  const touchedFlagsArr: Store<boolean>[] = [];

  // create units
  for (const fieldName in fieldsConfigs) {
    if (!fieldsConfigs.hasOwnProperty(fieldName)) continue;

    const fieldConfig = fieldsConfigs[fieldName];

    const field = withFactory({
      sid: fieldName,
      fn: ()=>createField(fieldName, fieldConfig, domain)
    });

    fields[fieldName] = field;
    dirtyFlagsArr.push(field.$isDirty);
    touchedFlagsArr.push(field.$touched);
  }


  const $form = createFormValuesStore(fields);
  const $eachValid = eachValid(fields);
  const $isFormValid = $filter
    ? combine($eachValid, $filter, (valid, filter) => valid && filter)
    : $eachValid;
  const $isDirty = combine(dirtyFlagsArr).map(
    (dirtyFlags) => dirtyFlags.some(Boolean)
  );
  const $touched = combine(touchedFlagsArr).map(
    (touchedFlags) => touchedFlags.some(Boolean)
  );

  const $meta = combine({
    isValid: $eachValid,
    isDirty: $isDirty,
    touched: $touched,
  });

  const validate =  createFormUnit.event<void>({});

  const submitForm = createFormUnit.event<void>({});

  const formValidated = createFormUnit.event<Values>({});

  const setForm = createFormUnit.event<Partial<AnyFormValues>>({});

  const resetForm = createFormUnit.event<void>({});

  const resetValues = createFormUnit.event<void>({});

  const resetErrors = createFormUnit.event<void>({});

  const resetTouched = createFormUnit.event<void>({});

  const submitWithFormData = sample({
    source: $form,
    clock: submitForm,
  });
  const validateWithFormData = sample({
    source: $form,
    clock: validate
  });

  // bind units
  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue;

    const fieldConfig = fieldsConfigs[fieldName];
    const field = fields[fieldName];

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues);

    if (!fieldConfig.rules) continue;

    bindValidation({
      $form,
      rules: fieldConfig.rules,
      submitEvent: submitForm,
      resetFormEvent: resetForm,
      resetValues,
      resetErrors,
      validateFormEvent: validate,
      field,
      formValidationEvents: validateOn || ['submit'],
      fieldValidationEvents: fieldConfig.validateOn
        ? fieldConfig.validateOn
        : [],
    }, { sid: fieldName });
  }

  guard({
    source: submitWithFormData as unknown as Event<Values>,
    filter: $isFormValid,
    // TODO: fix
    target: formValidated,
  });


  return {
    fields,
    $values: $form,
    $eachValid,
    $isValid: $eachValid,
    $isDirty,
    $touched,
    $meta,
    submit: submitForm,
    validate,
    resetTouched,
    reset: resetForm,
    resetValues,
    resetErrors,
    setForm,
    set: setForm,
    formValidated,
  } as unknown as Form<Values>;
}
