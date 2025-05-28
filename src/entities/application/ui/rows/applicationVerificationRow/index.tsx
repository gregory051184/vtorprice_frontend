import React from 'react';
import { Table } from '@box/shared/ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { IApplicationVerificationRow } from './types';
import s from './style.module.scss';
import { TextHeightOverflowEllipsis } from '@box/shared/ui/textHeightOverflowEllipsis';

const statusColor = ['text-primaryGreen-main', 'text-orange-dark', 'text-primaryGreen-main', '', 'text-red-dark'];

export const ApplicationVerificationRow: React.FC<IApplicationVerificationRow> = ({
  application
}) => {
  const router = useRouter();
  const date = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
  }).format(new Date(application.createdAt))
  
  return (
    <>
    <Table.Row
      className={classNames("cursor-pointer", s.card_isHiddenForAdaptive)}
      onClick={() => {
        router.push(`/applications-verification/${application.id}`);
      }}
    >
      <Table.Cell className="w-[160px]">
        <p>
          {date}
          {' '}
        </p>
      </Table.Cell>
      <Table.Cell>
        {application.dealType.id === 1 ? 'Покупка' : 'Продажа'}
      </Table.Cell>
      <Table.Cell className=" pr-[20px]">
        {application.recyclables.name}
      </Table.Cell>
      <Table.Cell>
        <p>
          {' '}
          {application.totalPrice}
          {' '}
          ₽
        </p>
        <p className="text-sm text-grey-40">
          {' '}
          {application.price * 1000}
          {' '}
          ₽ / т
        </p>
      </Table.Cell>
      <Table.Cell>
        {(application.totalWeight / 1000).toFixed(1)}{' т'}
      </Table.Cell>
      <Table.Cell>
        {`${application.address.substring(0, 20)}...` || 'Не указан'}
      </Table.Cell>
      <Table.Cell className={classNames(statusColor[application.status.id], 'font-semibold')}>
        {application.status.label || 'Не указан'}
      </Table.Cell>
    </Table.Row>

    <div className={classNames("hidden gap-[15px] p-[10px] h-52 cursor-pointer", s.card_adaptive)} onClick={() => {
        router.push(`/applications-verification/${application.id}`);
      }}>
      <div className='flex justify-between items-center h-1/3 border-b border-b-grey-20 pb-[15px] pt-[5px]'>
        <div>
          <p className='text-sm text-grey-40'>{application.dealType.id === 1 ? 'Покупка' : 'Продажа'}{' '}{(application.totalWeight / 1000).toFixed(1)}{' т'}</p>
          <p className='text-sm font-bold'>{application.recyclables.name}</p>
        </div>
        <div>
          <p className='text-sm font-semibold '>{application.totalPrice}{' '}₽</p>
          <p className='text-sm text-grey-40'>{application.price * 1000}{' '}₽ / т</p>
        </div>
      </div>
      <div style={{ maxHeight: '100%', overflow: 'hidden' }} className='flex items-center overflow-hidden h-2/6 border-b border-b-grey-20 pb-[15px]'>
        <TextHeightOverflowEllipsis text={`${application.address}` || 'Не указан'} maxHeight={50} />
      </div>
      <div className='flex items-center h-1/6 justify-between pb-[5px]'>
      <p className='text-sm text-grey-40'>{date}</p>
      <p className={classNames(statusColor[application.status.id], 'font-semibold text-sm')} >{application.status.label || 'Не указан'}</p>
      </div>
    </div>
  </>
  );
};
