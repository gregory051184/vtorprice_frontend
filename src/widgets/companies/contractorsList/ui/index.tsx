import React from 'react';
import { useGate, useStore } from 'effector-react';
import classNames from 'classnames';

import { Pagination, Table } from '@box/shared/ui';
import { IWithClass } from '@box/types';
import { ContractorCard, ContractorsRow } from '@box/entities/contractors';
import { contractorsListModel } from '@box/widgets/companies/contractorsList';
import { LogistContractorsListFilters } from '@box/features/company/filters/contractors';
import { LogistContractorCreateForm } from '@box/features/company/forms/create/createContractor';
import { useScreenSize } from '@box/shared/hooks';
import { useOrdering } from '@box/shared/lib/factories';
import { DocumentPopover } from '@box/shared/ui/documentsPopover';
import { headers } from '../lib';
import s from './style.module.scss';

export const LogistContractorsList: React.FC<IWithClass> = ({ className }) => {
  useGate(contractorsListModel.gate);
  const constractors = useStore(contractorsListModel.$contractors);
  const loadingContractors = useStore(contractorsListModel.contractorsLoading.$loaderStore);
  const ord = useOrdering(contractorsListModel.ordering);
  const [, satisfies] = useScreenSize();

  return (
    <div className={className}>
      <div className={s.filters_view}>
        <LogistContractorsListFilters />
        <LogistContractorCreateForm />
      </div>  
      {satisfies('md') 
        ? (
          <Table
            separate
            pagination={<Pagination pagination={contractorsListModel.pagination} />}
            loading={loadingContractors}
            empty={constractors.length === 0}
            className={classNames(s.table_view, 'mt-[14px]')}
          >
            <Table.Head 
              headers={headers}
              ordering={ord.ordering}
              onOrderingChange={ord.setOrdering}
            />
            <Table.Body>
              {constractors.map((contractor) => (
                <ContractorsRow
                  key={contractor.id}
                  company={contractor}
                  documents={<DocumentPopover documents={contractor.documents} />}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : (
          <div className={s.card_view}>
            <div className={classNames(s.card_view_block)}>
              {constractors.map((contractor) => (
                <ContractorCard
                  key={contractor.id}
                  className={s.card_view_card}
                  contractor={contractor}
                />
              ))}
            </div>
            <Pagination pagination={contractorsListModel.pagination} />
          </div>
        )}
    </div>
  );
};
