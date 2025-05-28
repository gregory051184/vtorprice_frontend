import React from 'react';
import classNames from 'classnames';
import { Button, Container } from '@box/shared/ui';
import Link from 'next/link';
import s from './style.module.scss';
import { useRouter } from 'next/router';

export const Contacts = () => { 
  const router = useRouter();
  return(
  <div className={classNames('bg-grey-10', s.contacts)}>
    <Container className={classNames("flex justify-between", s.container)}>
      <div className={classNames("w-full flex flex-col  justify-center", s.left)}>
        <h4 className="text-[40px] font-medium">+7 962 557–55–88</h4>
        <div className="mt-[32px] flex gap-[16px]">
          <Button onClick={() => {router.push(`/new-application`);}}>Оставить заявку</Button>
          <Button onClick={() => {window.open(`https://wa.me/79274155888`, '_blank');}} mode="light">Написать в WhatsApp</Button>
        </div>
      </div>
      <div className={classNames("w-full flex gap-[32px]", s.right)}>
        <div className="">
          <p className="text-[24px] font-medium">Адрес офиса</p>
          <p className="text-[18px] text-grey-70 font-normal mt-[16px]">
            г. Казань, ул. Ямашева
            <br />
            {' '}
            115А, 5 этаж, офис 70
            <br />
            Пн – Пт 9 – 18
          </p>
        </div>
        <div className="">
          <p className="text-[24px] font-medium">Реквизиты</p>
          <p className="text-[18px] text-grey-70 font-normal mt-[16px]">ООО “ВторПрайс”</p>
          <p className="text-[18px] text-grey-70 font-normal">ИНН 1660326191</p>
          <p className="text-[18px] text-grey-70 font-normal">ОГРН 1191690015450</p>
          <Link href="https://cloud.mail.ru/public/hN9R/ToxEtJDBt" target="_blank" className="text-primaryGreen-main font-semibold mt-[16px] block">
            Скачать карту партнера
          </Link>
        </div>
      </div>
    </Container>
  </div>

  )
};
