import { CompanyCreateForm } from '@box/features';
import React from 'react';
import s from './style.module.scss';

export const RegistrationWidget = () => (
  <div className={s.container}>
    <h1 className="text-2xl text-center">Создание профиля компании</h1>
    <p className="text-sm mt-[20px] text-center">
      Чтобы пользоваться личным кабинетом –
      <br />
      необходимо заполнить обязательные поля
    </p>
    <CompanyCreateForm className="mt-[32px]" />
  </div>
);
