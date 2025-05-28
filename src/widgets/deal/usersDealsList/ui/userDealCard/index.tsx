import React, { FC } from "react";
import { IUsersDealRow } from "@box/entities/deal/ui/rows/usersDealRow/types"
import classNames from "classnames";
import s from './style.module.scss';
import { ColorStatus } from "@box/shared/ui/colorStatus";
import { useRouter } from "next/router";

const UserDealCard: FC<IUsersDealRow> = ({
  route,
  id, recyclable,
  equipment,
  supplierCompany,
  createdAt,
  applicationPrice,
  price,
  status
}) => {
  const { push } = useRouter();

  return <div
    className={classNames(s.card, 'px-[10px] py-[16px] bg-grey-10 cursor-pointer')}
    onClick={() => {
      push(`/${route}/${id}`);
    }}
  >
    <div className={s.row}>
      <div className={s.block}>
        <span className={s.title}>Название  {route === 'deals' ? 'вторсырья' : 'оборудования'}</span>
        <span className={classNames(s.value, 'mt-[10px]')}>{recyclable || equipment}</span>
      </div>
      <div className={classNames(s.block, 'items-end')}>
        <span className={s.value}>
          {route==="deals" ? (applicationPrice * 1000) : applicationPrice}
          {' '}
          {` ₽ / ${route==="deals" ? "т" : "шт"}`}
        </span>
        <span className='font-normal text-[12px] text-grey-40 mt-[7px]'>
          {price}
          {' '}
          ₽
        </span>
      </div>
    </div>
    <div className={s.row}>
      <div className={s.block}>
        <span className={s.title}>Контрагент</span>
        <span className={classNames(s.value, 'mt-[10px]')}>{supplierCompany}</span>
      </div>
    </div>
    <div className='flex gap-[10px] items-center justify-start'>
      <span className='font-normal text-[14px] text-grey-40 min-w-[106px]'>
        {new Intl.DateTimeFormat('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour12: false,
        }).format(new Date(createdAt))}
      </span>
      <div className="w-full flex justify-start">
        {/* @ts-ignore */}
        <ColorStatus status={status} />
      </div>
    </div>
  </div>
}

export { UserDealCard }
