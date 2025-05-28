import { IWithClass } from '@types';
import { ReactNode } from "react";
import { IEquipmentApplication, IRecyclableApplication } from "@box/entities/application/model";
import React from 'react';
import { Separator } from '@box/shared/ui';
import classNames from 'classnames';
import EditIcon from '@assets/icons/Edit.svg';
import { useRouter } from "next/router";
import { $userApplicationlistTypeManagement } from '@box/pages/profile/applications-managment/list/model/store';
import { useStore } from 'effector-react';


export interface ICard extends IWithClass {
  application: IRecyclableApplication,
  deleteButton?: ReactNode
}

export const Card: React.FC<ICard> = ({
  application,
  className,
  deleteButton
}) => {
  const router = useRouter();
  const listType = useStore($userApplicationlistTypeManagement);
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

export interface IUserEquipmentApplicationCard extends IWithClass {
    application: IEquipmentApplication,
    deleteIcon: React.ReactNode,
}

export const CardEquipment: React.FC<IUserEquipmentApplicationCard> = ({
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