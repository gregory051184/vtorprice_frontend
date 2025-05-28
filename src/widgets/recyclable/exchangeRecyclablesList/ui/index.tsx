import React from 'react';
import { Pagination, Table } from '@box/shared/ui';
import { IWithClass } from '@types';
import { useGate, useStore } from 'effector-react';
import { exchangeRecyclableModel, ExchangeRecyclableRow } from '@box/entities/exchangeRecyclable';
import { useOrdering, usePagination } from '@box/shared/lib/factories';
import { useRouter } from 'next/router';
import { useForm } from '@box/shared/effector-forms';
import { exchangeRecyclablesListFiltersModel } from '@box/features/recyclable';
import { pagination, gate, ordering as od } from '../model';
import { headers } from '../lib';
import { useScreenSize } from "@box/shared/hooks";
import { ExchangeRecyclableCard } from "@box/entities/exchangeRecyclable/ui/cards/exchangeRecyclableCard";

export const ExchangeRecyclablesList: React.FC<IWithClass> = ({
  className
}) => {
  const recyclables = useStore(exchangeRecyclableModel.$exchangeRecyclables);
  const loading = useStore(exchangeRecyclableModel.exchangeRecyclablesLoading.$loaderStore);
  const pag = usePagination(pagination);
  const filters = useForm(exchangeRecyclablesListFiltersModel.filters);
  const ordering = useOrdering(od);
  const router = useRouter();
  useGate(gate);
  const [, satisfies] = useScreenSize();
  const selectedUrgencyType = filters.fields.urgency_type.value
  const headersForUrgencyType2 = headers.filter(header => header.ordering !== 'lotSize');

  if (satisfies('md')) {
    return (
      <Table
        pagination={<Pagination pagination={pagination} hasUpdate/>}
        empty={recyclables.length === 0}
        className={className}
        loading={loading && pag.currentPage === 1}
      >
        <Table.Head
          headers={selectedUrgencyType?.id === 1 ? headers : headersForUrgencyType2}
          ordering={ordering.ordering}
          onOrderingChange={ordering.setOrdering}
        />
        <Table.Body>
          {recyclables.map((recyclable) => (
            <ExchangeRecyclableRow
              onClick={() => {
                const params = new URLSearchParams({
                  type: filters.values.urgency_type?.value

                });
                router.push(`/exchange/${recyclable.id}?${params}`);
              }}
              recyclable={recyclable}
              selectedUrgencyType={selectedUrgencyType}
              key={recyclable.id}
            />
          ))}
        </Table.Body>
      </Table>
    );
  }

  return (
    <div className="mt-[24px] gap-[16px] flex flex-col">
      {recyclables.map(r => (
        <ExchangeRecyclableCard
          onClick={() => {
            const params = new URLSearchParams({
              type: filters.values.urgency_type?.value

            });
            router.push(`/exchange/${r.id}?${params}`);
          }}
          recyclable={r}
          key={r.id}
        />
      ))}
      <Pagination pagination={pagination} hasUpdate />
    </div>
  )

};
