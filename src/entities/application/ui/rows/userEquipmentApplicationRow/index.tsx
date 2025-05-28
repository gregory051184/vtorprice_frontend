import React from 'react';
import { Table } from '@box/shared/ui';
import { useRouter } from 'next/router';
import { IUsersEquipmentApplicationRow } from './types';

export const UsersEquipmentApplicationRow: React.FC<IUsersEquipmentApplicationRow> = ({
  application,
  deleteButton
}) => {
  const router = useRouter();
  return (
    <Table.Row className="cursor-pointer" onClick={() => {router.push(`/profile/equipment-applications/${application.id}`)}}>
      <Table.Cell>
        <p>
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(application.createdAt))}
        </p>
      </Table.Cell>
        <Table.Cell>
            <p>{application.status.id === 3 ? 'Завершено' : application.status.id === 2 ? 'Опубликовано' : application.status.id === 4 ? 'Отклонено': 'На модерации'}</p>
        </Table.Cell>
      <Table.Cell>
        {application.dealType.id === 1 ? 'Покупка' : 'Продажа'}
      </Table.Cell>
      <Table.Cell className="max-w-[110px] pr-[20px]">
        {application.equipment.name}
      </Table.Cell>
      <Table.Cell>
        <p className="text-[14px] font-medium text-black">
          {application.price}
          {' '}
          ₽ / шт
        </p>
        <p className="text-[12px] text-grey-40">
          {application.price * application.count}
          {' '}
          ₽
        </p>
      </Table.Cell>
      <Table.Cell>
        {application.count}
      </Table.Cell>
      <Table.Cell className="text-end">
        {deleteButton}
      </Table.Cell>
    </Table.Row>
  );
};
