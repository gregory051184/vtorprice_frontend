import React from 'react';
import { Table } from '@box/shared/ui';
import { useRouter } from 'next/router';
import { IUsersApplicationRow } from './types';
import s from './style.module.scss';
import classNames from 'classnames';
import { $userApplicationlistType } from '@box/pages/profile/applications/list/model';
import { useStore } from 'effector-react';

export const UsersApplicationRow: React.FC<IUsersApplicationRow> = ({
  application,
  deleteButton
}) => {
  const router = useRouter();
  const listType = useStore($userApplicationlistType);
  return (
    <Table.Row className={classNames("cursor-pointer")} onClick={() => router.push(`/profile/applications/${application.id}`)}>
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
      <Table.Cell className="max-w-[200px] pr-[20px]">
        {application.recyclables.name}
      </Table.Cell>
      <Table.Cell>
        <>
          <p>
            {listType.id === 1 ? (application.price * application.totalWeight) : application.totalPrice}
            {' '}
            ₽
          </p>
          <p className="text-sm text-grey-40">
            {application.price * 1000}
            {' '}
            ₽ / т
          </p>
        </>
      </Table.Cell>
      <Table.Cell>
      {listType.id === 1 ? `${(application.totalWeight / 1000).toFixed(1)} т` : `${(application.totalWeight / 1000).toFixed(1)} т`}
      </Table.Cell>
      <Table.Cell className="max-w-[220px]">
        <div className={s.address}>{`${application.address}` || 'Не указан'}</div>
      </Table.Cell>
      <Table.Cell className="text-end">
        {deleteButton}
      </Table.Cell>
    </Table.Row>
  );
};
