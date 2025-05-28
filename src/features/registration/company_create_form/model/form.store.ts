import { companyModel, companyApi } from '@box/entities/company';
import { getMeFx, authApi } from '@box/entities/auth';
import { ISelectValue } from '@box/shared/ui';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { AxiosError } from 'axios';
import {
  sample, createEffect, createStore, createEvent, split, Event, attach
} from 'effector';
import { createForm } from '@box/shared/effector-forms';
import {router} from "@router"

const registerCompanyFx = createEffect<ISelectValue<companyModel.ICompany>, boolean, AxiosError>({
  handler: async (company) => {
    if (Object.prototype.hasOwnProperty.call(company.value, 'id')) {
      await companyApi.setCompanyOwner(company.value.id);
      return true
    } else {
      await companyApi.createCompany(company.value);
      return false
    }
  },
});

const updateUserInfoFx = createEffect<
{
  name: string,
  position: string,
}, void, AxiosError>({
  handler: async ({
    name,
    position,
  }) => {
    const fio = name.split(' ');
    await authApi.updateUser({
      last_name: fio[0],
      middle_name: fio[2],
      first_name: fio[1],
      position,
    });
  },
});

const setErrorCode = createEvent<number | null>();
const resetErrorCode = createEvent();

const $axiosErrorCode = createStore<number | null>(null)
  .on(setErrorCode, (_, code) => code).reset(resetErrorCode);

const loading = createLoaderStore(false);

const registerForm = createForm({
  fields: {
    name: {
      init: '',
      rules: [
        {
          name: '',
          validator: (v) => v.length > 0 && /\D+\s\D+\s\D+/.test(v)
        }
      ]
    },
    position: {
      init: '',
      rules: [
        {
          name: '',
          validator: (v) => v.length > 0
        }
      ]
    },
    company: {
      init: null as ISelectValue<companyModel.ICompany> | null,
      rules: [
        {
          name: '',
          validator: (v) => v !== null
        }
      ]
    }
  }
});

const localGetMeFx = attach({effect: getMeFx})

sample({
  clock: registerCompanyFx.doneData,
  greedy: true,
  target: [resetErrorCode, localGetMeFx],
});

sample({
  source: registerCompanyFx.failData,
  fn: (error) => error.response?.status || null,
  target: setErrorCode,
});

sample({
  clock: registerCompanyFx.finally,
  target: loading.api.stopLoading,
});

sample({
  source: registerForm?.formValidated,
  target: [updateUserInfoFx, loading.api.startLoading],
});

sample({
  clock: updateUserInfoFx.fail,
  target: loading.api.stopLoading,
});

sample({
  // @ts-ignore
  clock: updateUserInfoFx.doneData,
  source: registerForm?.$values.map((el) => el.company),
  target: registerCompanyFx
});

split({
  clock: localGetMeFx.doneData,
  source: registerCompanyFx.doneData,
  match: {
    toSettings: (src: boolean)=>src,
    toHome: (src: boolean)=>!src
  },
  cases: {
    toSettings: router.pushFx.prepend(()=>"/profile/settings") as Event<any>,
    toHome: router.pushFx.prepend(()=>"/") as Event<any>
  }
})

export {
  $axiosErrorCode,
  registerForm,
  loading,
};
