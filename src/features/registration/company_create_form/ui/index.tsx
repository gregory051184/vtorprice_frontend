import { logoutEvent } from '@box/entities/auth';
import {
  AsyncSelect, BaseInput, Button, Tip,
} from '@box/shared/ui';
import { IWithClass } from '@box/types';
import { useEvent, useStore } from 'effector-react';
import React, {useCallback, useEffect} from 'react';
import { companySelectApi } from '@box/entities/company';
import classNames from 'classnames';
import { useForm } from '@box/shared/effector-forms';
import {
  $axiosErrorCode, registerForm, loading
} from '../model';
import s from './style.module.scss';

const errorMessage = new Map([[403, 'У вас уже есть компания'], [400, 'Компания уже есть в системе']]);

export const CompanyCreateForm: React.FC<IWithClass> = ({ className }) => {
  const errorStatusCode = useStore($axiosErrorCode);
  const logout = useEvent(logoutEvent);
  const loadingStore = useStore(loading.$loaderStore);
  const { hasError, fields, submit, reset } = useForm(registerForm);
  const cancelRegistration = useCallback(() => logout(), [],);

  useEffect(() => {
    reset();
  }, [])

  return (
    <form
      className={className}
      onSubmit={(ev) => {
        ev.preventDefault();
        submit();
      }}
    >
      <div className="flex flex-col column gap-[16px]">
        <AsyncSelect
          value={fields.company.value}
          onSelect={fields.company.onChange}
          inputProps={{
            required: true,
            error: hasError('company')
          }}
          placeholder="Название компании или ИНН"
          loadData={companySelectApi}
          withClearButton
        />
        <BaseInput value={fields.name.value} error={hasError('name')} onChange={fields.name.onChange} placeholder="ФИО сотрудника" required />
        <BaseInput value={fields.position.value} error={hasError('position')} onChange={fields.position.onChange} placeholder="Должность" required />
      </div>
      <div className={classNames('flex gap-5 justify-center mt-[56px]', s.buttons)}>
        <Button
          loading={loadingStore}
          htmlType="submit"
          disabled={!fields.name.value || !fields.position.value || !fields.company.value}
        >
          Продолжить
        </Button>
        <Button onClick={cancelRegistration} mode="light" htmlType="button">
          Отменить регистрацию
        </Button>
      </div>
      {errorStatusCode
        && (
          <div className={s.error}>
            <Tip className="mt-[30px]" link={{ text: 'Обратиться в поддержку', onClick: () => window.open('https://api.whatsapp.com/send/?phone=79625754888', '_blank') }}>
              {errorMessage.get(errorStatusCode) || 'Неизвестная ошибка'}
            </Tip>
          </div>
        )}

    </form>
  );
};
