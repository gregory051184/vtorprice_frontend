import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {
  Button,
  Pagination, Table
} from '@box/shared/ui';
import { IWithClass } from '@box/types';
import { useEvent, useGate, useStore, useUnit } from 'effector-react';
import { equipmentsListModel } from '@box/widgets/applications/applicationsEquipmentList';
import Add from '@assets/icons/16_add.svg';
import StarImg from '@box/shared/ui/starImg';
import { useOrdering } from '@box/shared/lib/factories';
import { useScreenSize } from '@box/shared/hooks';
import { EquipmentApplicationCard, EquipmentApplicationRow } from '@box/entities/application';

import { headers } from '../lib';

import s from './style.module.scss';
import { notAuthAlertModel } from '@box/entities/notAuthAlert/model';

export const EquipmentsTable: React.FC<IWithClass> = ({ className }) => {
  useGate(equipmentsListModel.gate);
  const applications = useStore(equipmentsListModel.$equipmentApplications);
  const loading = useStore(equipmentsListModel.equipmentApplicationsLoading.$loaderStore);
  const updateInFavorite = useUnit(equipmentsListModel.updateIsFavoriteEquipmentApplicationFx);
  const ord = useOrdering(equipmentsListModel.ordering);
  const [, satisfies] = useScreenSize();
  const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);

  const handleChangeInFavorite = (
    id: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (event) {
      event.stopPropagation();
    }
    updateInFavorite(id);
    openModalNotAuth();
  };

  return (
    <div className={className}>
      {satisfies('md') ? (
        <Table
          loading={loading}
          empty={applications.length === 0}
          className={s.table_view}
          pagination={<Pagination pagination={equipmentsListModel.pagination} />}
        >
          <Table.Head 
            headers={headers}
            ordering={ord.ordering}
            onOrderingChange={ord.setOrdering}
          />
          <Table.Body>
            {applications.map((application) => (
              <EquipmentApplicationRow
                application={application}
                key={application.id}
                buttons={(
                  <div className="flex gap-[6px]">
                    <Button  
                      onClick={(e) => handleChangeInFavorite(application.id, e)} 
                      className="w-[130px]" 
                      mode="stroke"
                      type="mini"
                      iconLeft={<StarImg width={13} style={{ fill: `${application.isFavorite ? '' : 'none'}` }} />}
                    >
                      {application.isFavorite ? 'Отписаться' : 'Избранное'}
                    </Button>
                    <Link href={`/equipment-deals/new/${application.id}`}>
                      <Button type="mini" mode="stroke" iconLeft={<Add width={16} height={16} />}>
                        Сделка
                      </Button>
                    </Link>
                  </div>
                )}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className={s.card_view}>
          <div className={classNames(s.card_view_block)}>
            {applications.map((application) => (
              <EquipmentApplicationCard
                application={application}
                className={s.card_view_card}
                key={application.id}
                buttons={(
                  <div className="flex gap-[6px] w-full">
                    <Button  
                      fullWidth
                      onClick={(e) => handleChangeInFavorite(application.id, e)} 
                      mode="stroke"
                      type="mini"
                      iconLeft={<StarImg width={13} style={{ fill: `${application.isFavorite ? '' : 'none'}` }} />}
                    >
                      {application.isFavorite ? 'Отписаться' : 'Избранное'}
                    </Button>
                    <Button 
                      fullWidth
                      type="mini" 
                      mode="stroke" 
                      iconLeft={<Add width={16} height={16} />}
                    >
                      Сделка
                    </Button>
                  </div>
                )}
              />
            ))}
          </div>
          <Pagination pagination={equipmentsListModel.pagination} /> 
        </div>
      )} 
    </div>
  );
};
