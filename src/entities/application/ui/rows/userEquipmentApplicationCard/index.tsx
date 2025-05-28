import React from 'react';
import { Separator } from '@box/shared/ui';
import classNames from 'classnames';
import { IUserEquipmentApplicationCard } from './types';
import { useRouter } from "next/router";
import EditIcon from '@assets/icons/Edit.svg';

export const UserEquipmentApplicationCard: React.FC<IUserEquipmentApplicationCard> = ({
  application,
  className,
  deleteIcon
}) => {
  const router = useRouter();
  return (
    <div onClick={() => {router.push(`/profile/equipment-applications/${application.id}`)}} className={classNames('p-[16px] bg-grey-10 rounded-[10px]', className)}>
      <div className="flex justify-between ">
        <p className="text-[14px] text-grey-40">
          {application.dealType.label}
          {' '}
          {application.count}
          {' '}
          шт
        </p>
        <p className="text-[14px] font-medium">
          {application.price}
          {' '}
          ₽ / шт
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-[16px] mt-[2px] font-medium">
          {application.equipment.name}
        </p>
        <p className="text-[12px] text-grey-40 font-bold">
          {application.count * application.price} ₽
        </p>
      </div>
      <Separator h={10} />
      <p className="my-4">{application.address}</p>
      <Separator h={10} />
      <div className="flex justify-between my-4">
        <p className="text-sm mt-[2px] text-grey-40">
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(application.manufactureDate))}
        </p>
        <div className='flex gap-[16px] z-100'>
          <div className='cursor-pointer'>
            <EditIcon />
          </div>
          {deleteIcon}
        </div>
      </div>
    </div>
)};
