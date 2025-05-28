import { AppShell } from '@box/layouts';
import React from 'react';
import Logo from '@assets/icons/logo.svg';
import { RegistrationWidget } from '@box/widgets/registration';
import { type NextPage } from 'next';

const Header: React.FC = () => (
  <div className="flex justify-center pt-[40px] pb-[47px]">
    <Logo />
  </div>
);

const Footer: React.FC = () => (
  <div className="text-center pb-[90px] pt-[40px]">
    <p className="text-sm text-grey-40 ">
      © 2018 - 2022 Все права защищены.
      <br />
      Официальный сайт компании ВторПрайс.
      {' '}
      <br />
      {' '}
      Информация на сайте не является публичной
      <br />
      {' '}
      офертой и носит информационный характер.
    </p>
  </div>
);

const Index: NextPage = () => (
  <AppShell
    className="bg-grey-10"
    header={<Header />}
    footer={<Footer />}
  >
    <RegistrationWidget />
  </AppShell>
);

export default Index;
