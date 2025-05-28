import React from 'react';
import { Separator } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import classNames from 'classnames';
import Link from 'next/link';
import { IApplicationCard } from './types';
import { useStore } from 'effector-react';
import { $authStore } from '@box/entities/auth';

export const EquipmentApplicationCard: React.FC<IApplicationCard> = ({
  application,
  className,
  buttons
}) => {
  const authStore = useStore($authStore);
  return(
  <Link href={`/equipment-applications/${application.id}`} className={classNames('p-[16px] bg-grey-10 rounded-[10px]', className)}>
    <div className="flex gap-[10px]">
      <Avatar className="shrink-0" size="sm" url={application?.images[1] || null} />
      <div>
        <p>
          {application.company.name}
        </p>
      </div>
    </div>
    <Separator h={10} />
    <div className="flex gap-[20px] flex-wrap">
      <div className="min-w-[144px]">
        <p className="text-xs text-grey-40">Текущая цена</p>
        <p className="text-sm mt-[2px]">{application.price} ₽</p>
      </div>
      <div className="">
        <p className="text-xs text-grey-40">Дата размещения</p>
        <p className="text-sm mt-[2px]">
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(application.manufactureDate))}
        </p>
      </div>
    </div>
    <Separator h={10} />
    <div className="flex gap-[25px] flex-wrap">
      <div className="">
        <p className="text-sm mt-[2px]">{authStore.isAuth ? (application.city ? application.city : '') : "Недоступно для не авторизованных пользователей"}</p>
        <p className="text-sm font-light text-primaryGreen-main underline">
          Адрес
        </p>
      </div>
    </div>
    <Separator h={10} />
    {buttons}
  </Link>
);
};
