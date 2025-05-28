import React,  { FormEventHandler, useCallback, useEffect } from 'react';
import { useStore, useEvent } from 'effector-react';
import classNames from 'classnames';
import { Button, PartialInput } from '@box/shared/ui';
import { useField, useForm } from '@box/shared/effector-form-controller/hooks';
import { codeField, codeForm, waitingForCodeAuth, $error, clearError } from '../model';
import s from './style.module.scss';
import { copyPhone } from '../../phone_form/model';
import { ICodeForm } from './types';
import { useTimer } from "../hooks";
import { makeCallFx } from '@box/features/auth/phone_form/model';

export const CodeForm: React.FC<ICodeForm> = ({ className, actions }) => {
  const phone = useField(copyPhone);
  const code = useField(codeField);
  const form = useForm(codeForm);
  const error = useStore($error);
  const loading = useStore(waitingForCodeAuth.$loaderStore);
  const removeError = useEvent(clearError);
  const { timer, start: startTimer } = useTimer()

  const callAgain = () => {
    makeCallFx(phone.store.$value);
    startTimer();
  }

  const onSubmit: FormEventHandler = useCallback((ev) => {
    ev.preventDefault();
    form.submit();
  }, []);

  useEffect(() => {
    code.onChange("");
  }, [])

  return (
    <form className={className} onSubmit={onSubmit}>
      <h2 className="text-2xl text-center mb-4 font-medium">
        Подтверждение телефона
      </h2>
      <p className="text-base text-center text-grey-90 mb-8 text-[14px]">
        Мы звоним на ваш номер
        {' '}
        <strong className="text-[14px]">
          +7
          {phone.store.$value}
        </strong>
        {' '}
        Введите
        последние 4 цифры номера телефона входящего звонка
      </p>
      <div className={classNames(s.partial_input, 'm-auto')}>
        <PartialInput
          error={!!code.store.$error || error}
          type="number"
          numCells={4}
          onInput={(val) => {
            code.onChange(val);
            removeError();
          }}
        />
      </div>
        {
          timer > 0 ?
            <div className="mt-10 text-center text-grey-40">
              Отправить повторно через <span className="font-bold">{timer} секунд</span>
            </div> :
            <div
              className="mt-10 text-center cursor-pointer font-bold text-primaryGreen-main"
              onClick={callAgain}>
              Принять звонок повторно
            </div>
        }
      <div className="flex flex-col gap-[10px]">
        <Button
          loading={loading}
          htmlType="submit"
          className="mt-10"
          fullWidth
          disabled={code.store.$value.length < 4}
        >
          Продолжить
        </Button>
        {actions}
      </div>
    </form>
  );
};
