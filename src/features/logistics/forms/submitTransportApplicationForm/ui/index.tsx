import React from 'react';
import {
  
  Button, Paper 
} from '@box/shared/ui';
import { ILogisticsOffer } from '@box/entities/logistics_offer/model';
import { useEvent } from 'effector-react';
import { submitOfferFx } from '../model';

export const SubmitTransportApplicationOfferForm: React.FC<
{ offer: ILogisticsOffer }
> = ({
  offer
}) => {
  const submit = useEvent(submitOfferFx);
  const handleOnClick = () => {
    submit({
      application_id: offer.application.id,
      offer_id: offer.id
    });
  };

  return (
    <Paper className="flex pl-4 pr-4 pt-4 pb-4 gap-4 border border-solid border-grey-20">
      <div className="flex justify-between flex-1 items-center px-[10px]">
        <div>
          <p className="text-grey-40 text-xs">Контрагент</p>
          <p className="text-base">{offer.contractor.name}</p>
        </div>
        <div>
          <p className="text-grey-40 text-xs">Дата загрузки</p>
          <p className="text-base">{new Intl.DateTimeFormat('ru-RU').format(new Date(offer.shippingDate))}</p>
        </div>
        <div>
          <p className="text-grey-40 text-xs">Стоимость, руб</p>
          <p className="text-base">{offer.amount}</p>
        </div>
      </div>
      <Button width={220} onClick={handleOnClick}>Подтвердить</Button>
    </Paper>
  );
};
