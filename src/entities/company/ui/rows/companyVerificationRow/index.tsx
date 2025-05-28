import React from 'react';
import { Table } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import { useRouter } from 'next/router';
import { ICompanyVerificationRow } from './types';

export const CompanyVerificationRow: React.FC<ICompanyVerificationRow> = ({
  companyVerification
}) => {
  const router = useRouter();
  return (
    <Table.Row
      className="cursor-pointer border"
      onClick={() => {
        router.push(`/companies-verification/${companyVerification.id}`);
      }}
    >
      <Table.Cell className="pr-8 w-[400px]">
        <div className="flex items-center  gap-6">
          <Avatar className="shrink-0" size="sm" url={companyVerification.company?.image || null} />
          <p>
            {companyVerification.company.name}
            {' '}
          </p>
        </div>
      </Table.Cell>
      <Table.Cell>
        <p>
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          }).format(new Date(companyVerification.createdAt))}
          {' '}
        </p>
      </Table.Cell>
      <Table.Cell className="w-[300px]">
        <p>{companyVerification.company.address}</p>
      </Table.Cell>
    </Table.Row>

  );
};
