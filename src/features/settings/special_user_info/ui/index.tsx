import { useField, useForm } from '@box/shared/effector-form-controller/hooks';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import s from './style.module.scss';
import { Avatar } from '@box/entities/user';
import { BaseInput, FileButton } from '@box/shared/ui';
import { useStore } from 'effector-react';
import React, { useMemo, useRef } from 'react';
import AvatarEditIcon from '@assets/icons/avatar_edit.svg';

import {
  loading,
  avatarField,
  nameField, 
  positionField, 
  specialUserInfoForm,
  phoneField
} from '../model';

export const SpecialUserInfoForm: React.FC<IWithClass> = ({
  className,
}) => {
  const formRef = useRef(null);
  const name = useField(nameField);
  const position = useField(positionField);
  const avatar = useField(avatarField);
  const phone = useField(phoneField);
  const avatarUrl = useMemo(() => {
    const avatarValue = avatar.store.$value;
    if (avatarValue !== null) {
      if (typeof avatarValue === 'string') {
        return process.env.NEXT_PUBLIC_API_URL + avatarValue;
      }

      return URL.createObjectURL(avatarValue);
    }
    return null;
  }, [avatar.store.$value]);
  useForm(specialUserInfoForm, formRef);
  const loadingStore = useStore(loading.$loaderStore);

  return (
    <form ref={formRef} className={className}>
      <p className="text-sm mb-[26px] text-grey-60">Ваш аватар:</p>
      <div className="flex justify-center">
        <div className="flex justify-center">
          <FileButton onChange={(file) => avatar.onChange(file)}>
            <div className="relative">
              <Avatar loading={loadingStore} url={avatarUrl} size="lg" />
              <AvatarEditIcon className="absolute right-0 bottom-0" />
            </div>
          </FileButton>
        </div>
      </div>
      <div className="mt-[26px] mb-[16px]">
        <p className="text-sm mb-[26px] text-grey-60">Ваши данные:</p>
        <div className="flex flex-col gap-[16px]">
          <div className={classNames('flex gap-[16px]', s.block)}>
            <BaseInput onChange={name.onChange} value={name.store.$value} error={!!name.store.$error} className="grow" placeholder="ФИО" required />
            <BaseInput onChange={position.onChange} value={position.store.$value} error={!!position.store.$error} className="grow" placeholder="Должность" required />
            <BaseInput loading={loadingStore} onChange={phone.onChange} value={phone.store.$value} error={!!phone.store.$error} className="grow" placeholder="Контактный телефон" required />
          </div>
        </div>
      </div>
    </form>
  );
};