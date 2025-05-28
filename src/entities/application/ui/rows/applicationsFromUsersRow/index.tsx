import React from 'react';
import { Radio, Table } from '@box/shared/ui';
import { useRouter } from 'next/router';
import { IApplicationsFromUsersRow } from './types';

export const ApplicatiosFromUsersRow: React.FC<IApplicationsFromUsersRow> = ({
  application,
  selected,
  onSelect
}) => {
  const router = useRouter();
  return (
    <Table.Row
      className="cursor-pointer"
     
    >
      <Table.Cell className="max-w-[110px]">
        <div className="flex gap-[10px]">
          <Radio
            checked={selected}
            onClick={(ev) => ev.stopPropagation()}
            onChange={(val) => {
              onSelect(val);
            }}
          />
          <p onClick={() => {router.push(`/applications/${application.id}`);}}>{application.recyclables.name}</p>
        </div>

      </Table.Cell>
      <Table.Cell
        onClick={() => {
          router.push(`/applications/${application.id}`);
        }}
        className="max-w-[110px] pr-[20px]"
      >
        <p>
          {application.price * 1000}
          {' '}
          ₽ / т
        </p>
        <p className="text-xs text-grey-40">
          {application.totalPrice}
          {' '}
          ₽
          {' '}
        </p>

      </Table.Cell>
      <Table.Cell onClick={() => {
        router.push(`/applications/${application.id}`);
      }}
      >
        {(application.totalWeight / 1000).toFixed(1)}
        {' '}
        т
      </Table.Cell>
    </Table.Row>

  );
};
