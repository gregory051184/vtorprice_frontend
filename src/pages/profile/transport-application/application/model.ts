import { ILogisticsOffer } from '@box/entities/logistics_offer/model';
import { $authHost } from '@box/shared/api';
import { createEffect, createStore } from 'effector';

const getLogisticsOfferFx = createEffect<{
  offer_id: string,
  application_id: string
}, ILogisticsOffer>({
  handler: async ({ offer_id, application_id }) => {
    const { data } = await $authHost.get(`/transport_applications/${application_id}/logistic_offers/${offer_id}/`);
    return data;
  }
});

const $offer = createStore<ILogisticsOffer | null>(null)
  .on(getLogisticsOfferFx.doneData, (_, data) => data);

export {
  $offer,
  getLogisticsOfferFx
};
