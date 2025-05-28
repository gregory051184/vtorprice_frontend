import { UsersDealRow } from '@box/entities/deal';
import { IWithClass } from '@box/types';
import { useGate, useStore } from 'effector-react';
import { Table, Pagination, TabSelect } from '@box/shared/ui';
import React from 'react';
import { UsersDealsListFilters } from '@box/features/deal';
import classNames from 'classnames';
import { gate, $deals, pagination, equipmentGate,  equipmentPagination, dealsLoading, equipmentDealsLoading } from '../model';
import { useScreenSize } from "@box/shared/hooks";
import { UserDealCard } from "@box/widgets/deal/usersDealsList/ui/userDealCard";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";

const values = [
  {
    id: 1,
    label: 'Вторсырье',
    value: 1
  },
  {
    id: 2,
    label: 'Оборудование',
    value: 2
  }
]

export const UsersDealsList: React.FC<IWithClass> = ({ className }) => {
  const router = useRouter();
  const { type } = router.query;
  const deals = useStore($deals);
  const dealLoading = useStore(dealsLoading.$loaderStore);
  const equipmentLoading = useStore(equipmentDealsLoading.$loaderStore);
  const loading = dealLoading || equipmentLoading;
  const isRecyclables = !type || type === '1';
  const currentValue = isRecyclables ? values[0] : values[1];
  useGate(isRecyclables ? gate : equipmentGate);
  const [, satisfies] = useScreenSize();

  return (
    <div>
      <TabSelect
        onChange={(v) => router.push(`?type=${v.value}`)}
        values={values}
        value={{
          id: currentValue.id,
          label: currentValue.label,
          value: currentValue.value
        }}
        className='mb-[24px]'
      />
      {
        loading ?
          <Loader color="green" mx="auto" my={20} /> :
          <>
            <UsersDealsListFilters isRecyclables={isRecyclables} />
            {
              satisfies('sm') ?
                <Table
                  empty={deals.length === 0}
                  pagination={<Pagination pagination={isRecyclables ? pagination : equipmentPagination} />}
                  className={classNames('mt-[28px]', className)}
                >
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>
                        Название {isRecyclables ? 'вторсырья' : 'оборудования'}
                      </Table.Cell>
                      <Table.Cell>
                        Контрагент
                      </Table.Cell>
                      <Table.Cell>
                        Дата создания
                      </Table.Cell>
                      <Table.Cell>
                        Цена
                      </Table.Cell>
                      <Table.Cell>
                        Статус
                      </Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {deals.map((deal) => <UsersDealRow
                      id={deal.id}
                      route={isRecyclables ? 'deals' : 'equipments-deals'}
                      recyclable={deal.application.recyclables?.name}
                      // @ts-ignore
                      equipment={deal.application.equipment?.name}
                      supplierCompany={deal.supplierCompany.name}
                      createdAt={deal.createdAt}
                      applicationPrice={deal.application.price}
                      price={deal.price}
                      key={deal.id}
                      status={deal.status}
                    />)}
                  </Table.Body>
                </Table> :
                <div>
                  <div className="flex gap-[16px] flex-wrap mt-[24px]">
                    {deals.map(deal => <UserDealCard
                        id={deal.id}
                        route={isRecyclables ? 'deals' : 'equipments-deals'}
                        recyclable={deal.application.recyclables?.name}
                        // @ts-ignore
                        equipment={deal.application.equipment?.name}
                        supplierCompany={deal.supplierCompany.name}
                        createdAt={deal.createdAt}
                        applicationPrice={deal.application.price}
                        price={deal.price}
                        key={deal.id}
                        status={deal.status}
                      />
                    )}
                  </div>
                  <Pagination pagination={isRecyclables ? pagination : equipmentPagination} />
                </div>
            }
          </>
      }
    </div>
  ); 
};
