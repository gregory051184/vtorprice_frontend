import React from 'react';
import { Table } from '@box/shared/ui';
import ArrowUp from '@assets/icons/arrow_up.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import { IExchangeRecyclableRow } from './types';

export const ExchangeRecyclableRow: React.FC<IExchangeRecyclableRow> = ({
  recyclable,
  onClick = () => null,
  selectedUrgencyType = null
}) => {
 return(
  <Table.Row
    className="cursor-pointer"
    onClick={onClick}
  >
    <Table.Cell>
      {recyclable.name}
    </Table.Cell>
    {selectedUrgencyType?.id === 1 && 
    <Table.Cell>
      {recyclable.lotSize || '-'}
    </Table.Cell>}
    <Table.Cell>
      {recyclable.latestDealPrice || '-'}
    </Table.Cell>
    <Table.Cell>
      {recyclable.purchaseApplicationsCount}
    </Table.Cell>
    <Table.Cell>
      {recyclable.salesApplicationsCount}
    </Table.Cell>
    <Table.Cell>
      {recyclable.publishedDate ? (
        <p>
          {new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(recyclable.publishedDate))}
          {' '}
        </p>
      ) : '-'}
    </Table.Cell>
    <Table.Cell>
      {recyclable.deviation === 1 ? <ArrowUp /> : recyclable.deviation === -1 ? <ArrowDown /> : '-'}
    </Table.Cell>
  </Table.Row>

)};
