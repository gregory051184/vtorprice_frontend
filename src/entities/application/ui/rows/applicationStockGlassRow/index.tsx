import React from 'react';
import { Table } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import Check from '@assets/icons/16_checkmark.svg';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { IApplicationStockGlassRow } from './types';

export const ApplicationStockGlassRow: React.FC<IApplicationStockGlassRow> = ({
  priceColor,
  application,
  urgencyType = null
}) => {
  const router = useRouter();
  return (
    <Table.Row
      className="cursor-pointer"
      onClick={() => {
        router.push(`/applications/${application.id}`);
      }}
    >
      <Table.Cell>
        <div className="flex items-center  gap-6">
          <Avatar className="shrink-0" size="sm" url={application.company?.image || null} />
          <p className="text-sm">{application.company.name}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="max-w-[110px] pr-[20px]">
        {(application.totalWeight / 1000).toFixed(1)}
        {' '}
        т
      </Table.Cell>
      {urgencyType === "1" && 
      <Table.Cell>
        {application.lotSize || '-'}
      </Table.Cell>}
      <Table.Cell>
        {application.withNds ? <Check /> : 'Нет'}
      </Table.Cell>
      <Table.Cell className={classNames(priceColor === 'green' ? 'text-primaryGreen-main' : 'text-red-dark', 'font-medium')}>
        {application.price * 1000}
        {' '}
        ₽
      </Table.Cell>
      <Table.Cell className="max-w-[110px] pr-[20px]">
        {new Date(application.createdAt).toLocaleDateString()}
      </Table.Cell>
    </Table.Row>

  );
};
