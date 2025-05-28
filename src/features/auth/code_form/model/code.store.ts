import { createField, createForm } from '@box/shared/effector-form-controller';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import {
  setAuthUser,
  IAuthUser, authApi,
} from '@box/entities/auth';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import {
  validationPipe,
  isNotEmptyString,
} from '@box/shared/effector-form-controller/validator';
import { ROLE } from '@box/types';
import { $userToSubmit } from '../../phone_form/model';

const authFx = createEffect<
{ id: number; code: string },
{ user: IAuthUser; access_token: string },
AxiosError
>({
  handler: async ({ id, code }) => {
    const { data } = await authApi.authorize({
      userId: id,
      code,
    });
    const { data: userData } = await authApi.getAuthUser(data.access);
    Cookies.set('access_token', data.access, { expires: 30});
    Cookies.set('refresh_token', data.refresh, { expires: 30});
    Cookies.set('user_id', id.toString(), { expires: 30});

    if (!data.hasCompany && (!userData.role || userData.role.id === ROLE.COMPANY_ADMIN)) {
      Router.push('/registration');
    }

    const wrong_data: any = userData
    userData['first_name'] = wrong_data['firstName']
    userData['last_name'] = wrong_data['lastName']
    userData['middle_name'] = wrong_data['middleName']

    return {
      access_token: data.access,
      user: userData,
    };
  },
});

const codeField = createField<string>({
  initialValue: '',
  validateFn: (val) => validationPipe(val, isNotEmptyString(), (val) => {
    if (val.length === 4) {
      return null;
    }

    throw new Error('Вы должны принять политику конфиденциальности');
  }),
});

const waitingForCodeAuth = createLoaderStore(false, authFx);

const codeForm = createForm(codeField);

sample({
  clock: codeForm.formValid,
  source: combine({
    id: $userToSubmit.map((data) => data?.id || 0),
    code: codeField.$value,
  }),
  target: authFx,
});

const clearError = createEvent();
const $error = createStore(false)
  .on(authFx.failData, () => true)
  .on(clearError, () => false)

sample({
  source: authFx.doneData,
  target: setAuthUser,
});

export {
  codeField, codeForm, waitingForCodeAuth, authFx, $error, clearError
};
