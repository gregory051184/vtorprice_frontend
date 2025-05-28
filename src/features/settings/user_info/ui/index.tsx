import { useField, useForm } from '@box/shared/effector-form-controller/hooks';
import { BaseInput } from '@box/shared/ui';
import { IWithClass } from '@box/types';
import React, { useRef } from 'react';
import classNames from 'classnames';
import s from './style.module.scss';

import { nameField, positionField, userInfoForm } from '../model';

export const CompanyUserInfoForm: React.FC<IWithClass> = ({
  className,
}) => {
  const formRef = useRef(null);
  const name = useField(nameField);
  const position = useField(positionField);
  useForm(userInfoForm, formRef);
  return (
    <form ref={formRef} className={className}>
      <div>
        <div className={classNames('flex flex-col gap-[16px]')}>
          <div className={classNames('flex gap-[16px]', s.block)}>
            <BaseInput onChange={name.onChange} value={name.store.$value} error={!!name.store.$error} className="grow" placeholder="ФИО" required />
            <BaseInput onChange={position.onChange} value={position.store.$value} error={!!position.store.$error} className="grow" placeholder="Должность" required />
          </div>
        </div>
      </div>
    </form>

  );
};
