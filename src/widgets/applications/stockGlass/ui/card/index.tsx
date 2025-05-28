import React, { FC } from "react";
import {ICard} from "@box/widgets/applications/stockGlass/ui/card/types";
import { useRouter } from "next/router";
import { Avatar } from '@box/entities/user';
import Check from '@assets/icons/16_checkmark.svg';
import classNames from "classnames";

const Card: FC<ICard> = ({ application, priceColor }) => {
  const router = useRouter();

  return <div
    onClick={() => {router.push(`/applications/${application.id}`)}}
    className='flex flex-col px-[10px] py-[16px] cursor-pointer rounded-[10px] bg-grey-10'
  >
    <div className="flex items-center gap-[10px] pb-[16px] border-b border-b-grey-20">
      <Avatar className="shrink-0" size="sm" url={application.company?.image || null} />
      <span className="text-[16px] text-black font-medium">{application.company.name}</span>
    </div>
    <div className='py-[16px] border-b border-b-grey-20 flex'>
      <div className='flex flex-col w-full gap-[4px] justify-start'>
        <span className='text-[10px] font-medium text-grey-40'>Мин. вес фуры</span>
        <span className='text-[15px] font-medium text-black'>{application.lotSize || '-'}</span>
      </div>
      <div className='flex flex-col w-full gap-[4px] justify-start'>
        <span className='text-[10px] font-medium text-grey-40'>Кол-во</span>
        <span className='text-[15px] font-medium text-black'>
          {(application.totalWeight / 1000).toFixed(1)}
          {' '}
          т
        </span>
      </div>
    </div>
    <div className='py-[16px] border-b border-b-grey-20 flex'>
      <div className='flex flex-col w-full gap-[4px] justify-start'>
        <span className='text-[10px] font-medium text-grey-40'>С НДС</span>
        <span className='text-[15px] font-medium text-black'>
          {application.withNds ? <Check/> : 'Нет'}
        </span>
      </div>
      <div className='flex flex-col w-full gap-[4px] justify-start'>
        <span className='text-[10px] font-medium text-grey-40'>Цена за 1 т</span>
        <span
            className={classNames('text-[15px] font-medium', priceColor === 'green' ? 'text-primaryGreen-main' : 'text-red-dark')}>
          {application.price * 1000}
          {' '}
          ₽
        </span>
      </div>
    </div>
  </div>
}

export {Card}
