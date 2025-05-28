import React from 'react';
import { useBoolean } from '@box/shared/hooks';
import { BackButton, Collapse, Container } from '@box/shared/ui';
import classNames from 'classnames';
import { IWithClass } from '@box/types';
import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import s from './style.module.scss';
import PlusIcon from '@assets/icons/24_plus.svg';
import MinusIcon from '@assets/icons/24_minus.svg';

const FaqCard:React.FC<{ title: string, description: string } & IWithClass> = ({
  title,
  description,
  className,
}) => {
  const { value, toggle } = useBoolean(false);
  return (
    <div className={classNames(s.faq_card, 'bg-grey-10 border border-grey-10', { 'bg-white border-grey-20': value }, className)}>
      <div className="flex cursor-pointer justify-between" onClick={toggle}>
        <p className="text-lg font-semibold">{title}</p>
        <div className='mt-[3px]'>
          {!value ? <PlusIcon /> : <MinusIcon />}
        </div>
      </div>
      <Collapse opened={value}>
        <div>
          <p className="text-sm text-grey-90 pt-5">{description}</p>
        </div>

      </Collapse>
    </div>
  );
};

function Index() {
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Container>
        <BackButton className='text-sm mt-[10px]'>Назад</BackButton>
        <h1 className="font-normal text-2xl mt-4 mb-8">FAQ</h1>
        <div className="flex flex-col gap-3">
          <FaqCard title="Как создать заявку" description="Для того, чтобы создать заявку – перейдите на страницу такую–то и нажмите на кнопку “Заявка”, либо вы можете найти ее в шапке сайта. Далее вам нужно заполнить все данные по заявке в форме, которая откроется" />
          <FaqCard title="Как создать заявку" description="Для того, чтобы создать заявку – перейдите на страницу такую–то и нажмите на кнопку “Заявка”, либо вы можете найти ее в шапке сайта. Далее вам нужно заполнить все данные по заявке в форме, которая откроется" />
          <FaqCard title="Как создать заявку" description="Для того, чтобы создать заявку – перейдите на страницу такую–то и нажмите на кнопку “Заявка”, либо вы можете найти ее в шапке сайта. Далее вам нужно заполнить все данные по заявке в форме, которая откроется" />
          <FaqCard title="Как создать заявку" description="Для того, чтобы создать заявку – перейдите на страницу такую–то и нажмите на кнопку “Заявка”, либо вы можете найти ее в шапке сайта. Далее вам нужно заполнить все данные по заявке в форме, которая откроется" />
          <FaqCard title="Как создать заявку" description="Для того, чтобы создать заявку – перейдите на страницу такую–то и нажмите на кнопку “Заявка”, либо вы можете найти ее в шапке сайта. Далее вам нужно заполнить все данные по заявке в форме, которая откроется" />

        </div>
      </Container>
    </AppShell>
  );
}

export default Index;
