import { ILogisticsOffer } from '@box/entities/logistics_offer/model';
import { $authHost } from '@box/shared/api';
import { createEffect } from 'effector';
import Router from 'next/router';

const submitOfferFx = createEffect<{
  offer_id: number,
  application_id: number
}, ILogisticsOffer>({
  handler: async ({
    offer_id,
    application_id
  }) => {
    const { data } = await $authHost.patch(`/transport_applications/${application_id}/logistic_offers/${offer_id}/`, {
      status: 2
    });
    Router.back();
    return data;
  }
});

export { submitOfferFx };
