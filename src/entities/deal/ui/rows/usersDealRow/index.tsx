import { Table } from '@box/shared/ui';
import { useRouter } from 'next/router';
import React from 'react';
import { IUsersDealRow } from './types';
import { ColorStatus } from "@box/shared/ui/colorStatus";

export const UsersDealRow: React.FC<IUsersDealRow> = ({
  route,
  id,
  recyclable,
  equipment,
  supplierCompany,
  createdAt,
  applicationPrice,
  price,
  status
}) => {
  const router = useRouter();
  return (
    <Table.Row
      className="cursor-pointer"
      onClick={() => {
        router.push(`/${route}/${id}`);
      }}
    >
      <Table.Cell className="max-w-[110px]">
        <p>{recyclable || equipment}</p>
      </Table.Cell>
      <Table.Cell className="max-w-[200px]">
        <p>{supplierCompany}</p>
      </Table.Cell>
      
      <Table.Cell className="max-w-[110px] pr-[20px]">
        <p>
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(createdAt))}
          {' '}
        </p>
      </Table.Cell>
      <Table.Cell>
        <p>
          {route==="deals" ? (applicationPrice * 1000) : applicationPrice}
          {` ₽ / ${route==="deals" ? "т" : "шт"}`}
        </p>
        <p className="text-sm text-grey-40">
          {price}
          {' '}
          ₽
        </p>
      </Table.Cell>
      <Table.Cell>
        {/* @ts-ignore */}
        <ColorStatus status={status} />
      </Table.Cell>
    </Table.Row>
  );
};
