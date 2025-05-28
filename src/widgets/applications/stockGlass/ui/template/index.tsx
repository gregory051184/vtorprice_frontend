import React from 'react';
import { Pagination, Table } from '@box/shared/ui';
import { ApplicationStockGlassRow } from '@box/entities/application';
import { IStockGlassApplicationsListTemplate } from './types';
import classNames from "classnames";
import s from './style.module.scss';
import {useRouter} from 'next/router';

export const StockGlassApplicationListTemplate: React.FC<IStockGlassApplicationsListTemplate> = ({
  className,
  applications,
  pagination,
  title
}) => {
  const router = useRouter();
  const urgencyType = router.query.type//router.query.type;
  return(
  <div className={className}>
    <h1 className="text-2xl mb-[16px] ml-[14px]">{title}</h1>
    <div className={classNames("max-h-[350px] overflow-auto", s.container)}>
      <Table
        pagination={<Pagination pagination={pagination} />}
        empty={applications.length === 0}
      >
        <Table.Head className="sticky top-0 bg-white">
          <Table.Row>
            <Table.Cell width={400}>
              Название компании
            </Table.Cell>
            <Table.Cell width={200}>
              Общее кол–во
            </Table.Cell>
            {urgencyType === "1" && <Table.Cell width={200}>
              Мин. вес фуры
            </Table.Cell>}
            <Table.Cell width={200}>
              С НДС
            </Table.Cell>
            <Table.Cell width={200}>
              Цена за 1 т
            </Table.Cell>

            <Table.Cell width={400}>
              Дата создания
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {applications.map((application) => (
            <ApplicationStockGlassRow
              priceColor={title === "Продажа" ? "red" : "green"}
              key={application.id}
              application={application}
              urgencyType={urgencyType as string}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  </div>
)};
