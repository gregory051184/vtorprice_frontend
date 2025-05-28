import React from 'react';
import { Separator } from '@box/shared/ui';
import classNames from 'classnames';
import { ICard } from './types';
import EditIcon from '@assets/icons/Edit.svg';
import { useRouter } from "next/router";
import { useStore } from 'effector-react';
import { $userApplicationlistType } from '@box/pages/profile/applications/list/model';

export const Card: React.FC<ICard> = ({
  application,
  className,
  deleteButton
}) => {
  const router = useRouter();
  const listType = useStore($userApplicationlistType);
  return (
    <div onClick={() => router.push(`/profile/applications/${application.id}`)} className={classNames('py-[16px] px-[10px] bg-grey-10', className)}>
      <div className="flex gap-[16px] items-center justify-between">
       <div className="flex flex-col gap-[2px]">
          <span className="text-[14px] text-grey-40">
            {application.dealType.id === 1 ? 'Покупка' : 'Продажа'} {listType.id === 1 ? `${(application.totalWeight / 1000).toFixed(1)} т` : `${(application.totalWeight / 1000).toFixed(1)} т`}
          </span>
          <span className="font-medium text-black text-[16px]">{application.recyclables.name}</span>
        </div>
         <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-black text-[14px]">
            {application.price * 1000}
            {' '}
            ₽ / т
          </span>
          <span className="text-[12px] text-grey-40">
            {listType.id === 1 ? (application.price * application.totalWeight) : application.totalPrice}
            {' '}
            ₽
          </span>
        </div>
      </div>
      <Separator h={16} />
      <div className="text-[14px]">{application.address || 'Не указан'}</div>
      <Separator h={16} />
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-grey-40">
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(application.createdAt))}
        </span>
        <div className='flex gap-[16px] z-100'>
          <div className='cursor-pointer'>
            <EditIcon />
          </div>
          {deleteButton}
        </div>
      </div>
    </div>
)};
