import {
  AppInput, BaseInput, Button, Checkbox,
} from '@box/shared/ui';
import React, {FormEventHandler, useEffect} from 'react';
import classNames from 'classnames';
import VMasker from 'vanilla-masker';
import { useField, useForm } from '@box/shared/effector-form-controller/hooks';
import { useStore } from 'effector-react';
import {
  phoneCallForm, phoneField, policyField, waitingForCall, isBackField, copyPhone, copyPolicy
} from '../model';
import s from './style.module.scss';
import privacyPolicy from '@assets/privacy_policy.pdf';

export const PhoneForm = () => {
  const phone = useField(phoneField);
  const copyPhoneValue = useField(copyPhone);
  const copyPolicyValue = useField(copyPolicy);
  const policy = useField(policyField);
  const form = useForm(phoneCallForm);
  const isBackValue = useField(isBackField);
  const loading = useStore(waitingForCall.$loaderStore);

  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    form.submit();
    isBackValue.onChange(false);
  };

  useEffect(() => {
    return () => {
      if (!!isBackValue.store.$value) {
        phone.onChange(copyPhoneValue.store.$value);
        policy.onChange(copyPolicyValue.store.$value);

      } else {
        phone.onChange("");
        policy.onChange(false);
        copyPhoneValue.onChange("");
        copyPolicyValue.onChange(false);
      }
      isBackValue.onChange(false);
    }
  }, [!!isBackValue.store.$value])

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-medium text-center mb-4">Личный кабинет</h2>
      <p className="text-base text-center text-grey-90 mb-8">Введите номер телефона, чтобы войти или зарегистрироваться</p>
      <div className="flex gap-3">
        <AppInput inputInactive placeholder="" placeholderPlain value="+7" className={classNames('w-4/12', s.rounded_input)} />
        <BaseInput
          name="phone"
          placeholderPlain
          error={!!phone.store.$error}
          value={phone.store.$value}
          onChange={(val) => {
            phone.onChange(VMasker.toPattern(val, '(999)999-99-99'));
            copyPhoneValue.onChange(VMasker.toPattern(val, '(999)999-99-99'));
          }}
          type="text"
          placeholder="Номер телефона"
          className={classNames('w-8/12', s.rounded_input)}
        />
      </div>
      <div className="mt-5">
        <Checkbox
          name="policy"
          checked={policy.store.$value}
          onChange={(val) => {
            policy.onChange(val);
            copyPolicyValue.onChange(val);
          }}
          description={(
            <p>
              Нажимая продолжить, вы соглашаетесь с нашей
              {' '}
              <span
                onClick={() => window.open(privacyPolicy, '_blank')}
                className="text-primaryGreen-main">Политикой конфиденциальности</span>
            </p>
          )}
        />
      </div>
      <Button loading={loading} htmlType="submit" disabled={!policy.store.$value} className="mt-6" fullWidth>
        Продолжить
      </Button>
    </form>
  );
};
