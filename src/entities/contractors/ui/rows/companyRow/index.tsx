import React from 'react';
import { Table } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import { ICompanyRow } from './types';

import dotenv from 'dotenv';
import IconUserForAuth from "@assets/icons/24_user.svg";

dotenv.config();

export const ContractorsRow: React.FC<ICompanyRow> = ({ company, documents }) => (
  <Table.Row>
    <Table.Cell className="pr-8">
      <div className="flex items-center  gap-6">
          {company?.avatarOrCompanyLogo  ?
        <Avatar className="shrink-0" size="sm" url={company?.avatarOrCompanyLogo.split('/')[2] === process.env.NEXT_PUBLIC_API_URL?.split('/')[2] ?
            company?.avatarOrCompanyLogo : process.env.NEXT_PUBLIC_API_URL + '/' + company?.avatarOrCompanyLogo || null} /> : <IconUserForAuth/>}
        <p>
            {company.name}
        </p>
      </div>
    </Table.Cell>
    <Table.Cell className="pr-6">
      <p>{company.contractorType.label}</p>
    </Table.Cell>
    <Table.Cell>
      <p>{company.address}</p>
    </Table.Cell>
    <Table.Cell>
      <p>{company.transportOwnsCount}</p>
    </Table.Cell>
    <Table.Cell>
      {documents}
    </Table.Cell>
  </Table.Row>
);
