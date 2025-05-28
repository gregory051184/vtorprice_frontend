import { $usersCompany } from '@box/entities/auth';
import { validationPipe, isNotNull } from '@box/shared/effector-form-controller/validator';
import { IPillValue, ISelectValue } from '@box/shared/ui/select';
import {
  createStore, createEvent, combine, sample, createEffect,
} from 'effector';
import { AxiosError } from 'axios';
import { createField, createDynamicForm, createForm } from '@box/shared/effector-form-controller';
import { companyApi, companyModel } from '@box/entities/company';

export const createCompanyActivitiesFormState = (activity: 1 | 2 | 3, sid: string) => {
  const formActive = createField<boolean>({
    initialValue: false,
  });

  const setAllAdvantages = createEvent<Array<IPillValue>>();
  const allAdvantages = createStore<Array<IPillValue>>([], {
    sid: `${sid} FORM_ALL_ADVANTAGES`,
  }).on(setAllAdvantages, (_, data) => data);
  const getAllAdvantagesFx = createEffect(async () => {
    const { data } = await companyApi.getActivityTypeAdvantages(activity);
    return data.results;
  });

  const selectedAdvantages = createField<Array<
  IPillValue<companyModel.IActivityTypeAdvantage>
  >>({ initialValue: [] });

  const formTypeServerData = $usersCompany
    .map((state) =>{return(state?.activityTypes.find((val) => val.activity.id === activity))});

  const form = createDynamicForm<
  {
    recColType: ISelectValue | null
  }
  >({
    initialValue: {
      firstField: {
        id: 'firstField',
        recColType: null,
        removable: false,
      },
    },
    emptyValue: {
      recColType: null,
    },
    validators: {
      recColType: (val) => validationPipe(val, isNotNull()),
    },
    sid,

  });

  const updateCompanyRecColTypeFx = createEffect<{
    advantages: Array<IPillValue>
    store:any
    checked: boolean
  }, void, AxiosError>({
    handler: async ({
      advantages,
      store,
      checked,
    }) => {
      await companyApi.createUsersCompanyActivityTypes({
        activity,
        company: $usersCompany.getState()?.id || 0,
        advantages: checked ? advantages.map((el) => el.value.id) : [],
        recColTypes: checked ? Object.values(store).map((el: any) => el.recColType.value.id) : [],

      });
    },
  });

  const pillSelectForm = createForm(selectedAdvantages);

  const submitForm = createEvent();

  const sumbitFormFx = createEffect<{
    checked: boolean,
    store: any }, boolean, boolean>(async ({ checked, store }) => {
    if (checked) {
      try {
        await form.validateFx(store);
        return true;
      } catch {
        throw false;
      }
    }

    return true;
  });

  sample({
    clock: submitForm,
    target: pillSelectForm.submit,
  });

  sample({
    clock: pillSelectForm.formValid,
    source: combine({
      checked: formActive.$value,
      store: form.$fields,
    }),
    target: sumbitFormFx,
  });

  sample({
    clock: sumbitFormFx.done,
    source: combine({
      advantages: selectedAdvantages.$value,
      store: form.$fields,
      checked: formActive.$value,
    }),
    target: updateCompanyRecColTypeFx,
  });

  sample({
    source: formTypeServerData,
    fn: (source) => {
      if (source) {
        return source.recColTypes.reduce((acc, el, num) => ({
          ...acc,
          [el.id]: {
            id: el.id,
            recColType: {
              id: el.id,
              label: el.name,
              value: el,
            },
            removable: num !== 0,
          },
        }), {});
      }
      return [];
    },
    filter: formTypeServerData.map((val) => (val ? val.recColTypes.length > 0 : false)),
    target: [form.setValues, formActive.setValue.prepend(() => true)],
  });
  sample({
    source: formTypeServerData,
    fn: (source) => {
      if (source) {
        return source.advantages.map((el) => ({
          id: el.id,
          label: el.name,
          value: el,
        }));
      }
      return [];
    },
    target: selectedAdvantages.setValue,
  });

  sample({
    clock: formActive.$value,
    filter: allAdvantages.map((val) => val.length === 0),
    target: getAllAdvantagesFx,
  });

  sample({
    source: getAllAdvantagesFx.doneData,
    fn: (source) => source.map((el:any) => ({
      id: el.id,
      label: el.name,
      value: el,
    })),
    target: setAllAdvantages,
  });

  return {
    form,
    selectedAdvantages,
    formActive,
    updateCompanyRecColTypeFx,
    submitForm,
    sumbitFormFx,
    allAdvantages,
  };
};
