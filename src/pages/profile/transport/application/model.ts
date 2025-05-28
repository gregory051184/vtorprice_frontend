import { createEffect, createEvent, createStore, sample, Store } from "effector";
import { logisticsApplicationsApi } from "@box/entities/logistics/api";
import { IRecyclableApplication } from "@box/entities/application/model";
import { createGate } from "effector-react";
import { LogisticsOfferApi, logisticsOfferModel } from '@box/entities/logistics_offer';
import { DealType, TransportApplicationStatus } from "@box/entities/deal/model";
import { dealDelivery } from '@box/entities/deal';
import { ITransportApplicationModel, IUpdateTransportApplicationParams } from "@box/entities/logistics/model";
import { loadingFormatSelectValues } from "@box/entities/logistics/lib";
import { transportFlowModel } from "@box/features/deal/forms/transport";
import { dealDocumentUploadModel } from "@box/features/deal";

const getTransportFx = createEffect<number, IRecyclableApplication>({
  handler: async (id) => {
    const { data } = await logisticsApplicationsApi.getApplication(id);
    return data;
  }
});

const deleteTransportDocumentFx = createEffect<{dealId: number, docId: number}, number>({
  handler: async ({dealId, docId}) => {
    await logisticsApplicationsApi.deleteDocument(dealId, docId)
    return docId;
  }
})

const getLogisticsOffersFx = createEffect<number, Array<logisticsOfferModel.ILogisticsOffer>>({
  handler: async (id) => {
    const { data } = await LogisticsOfferApi.list({
      id
    });
    return data.results;
  }
});

const $offers = createStore<Array<logisticsOfferModel.ILogisticsOffer>>([])
  .on(getLogisticsOffersFx.doneData, (_, data) => data);

sample({
  source: getTransportFx.doneData,
  fn: (src) => src?.id as number,
  target: getLogisticsOffersFx
});

const goStepFx = createEffect<
  {id: number, params: IUpdateTransportApplicationParams}, ITransportApplicationModel
>({
  handler: async ({
    id,
    params
  }) => {
    const { data } = await logisticsApplicationsApi.updateTransportApplication(id, params)

    return data;
  }
})

const handleGoNext = createEvent();

const handleGoNextFx = createEffect<any,  ITransportApplicationModel>({
  // @ts-ignore
  handler: async (transport) => {
    const id = transport?.id;
    const statusId = transport.status.id;

    switch (statusId) {
      case TransportApplicationStatus.LOADING: {
        return goStepFx({
          id,
          params: {
            deal: {
              shipping_date: transport.shippingDate,
              loaded_weight: transport.loadedWeight,
            },
            shipping_date: transport.shippingDate,
            loaded_weight: transport.loadedWeight,
            status: statusId + 1
          }
        });
      }
      case TransportApplicationStatus.UNLOADING: {
        return goStepFx({
          // @ts-ignore
          id,
          params: {
            deal: { delivery_date: transport.delivery_date, accepted_weight: transport.accepted_weight },
            delivery_date: transport.deliveryDate,
            accepted_weight: transport.acceptedWeight,
            status: statusId + 1
          }
        });
      }
      case TransportApplicationStatus.COMPLETED: {
        // @ts-ignore
        return goStepFx({id, params: {
          deal: {delivery_date: transport.deliveryDate,accepted_weight: transport.acceptedWeight}, status: TransportApplicationStatus.FINAL }});
      }
      default:
        break;
    }

    // @ts-ignore
    return goStepFx({ id, params: {deal: {}, status: statusId + 1} });
  }
});

const gate = createGate();

const resetTransport = createEvent();

const $transport = createStore<any | null>(null)
  .on(getTransportFx.doneData, (_, data) => data)
  .on(transportFlowModel.updateTransportFx.doneData, (_, data) => data)
  .on(handleGoNextFx.doneData, (_, data) => data)
  .on(dealDocumentUploadModel.uploadTransportDocumentFx.doneData, (_, data) => data)
  .on(deleteTransportDocumentFx.doneData, (store, data) => {
    // @ts-ignore
    const newDocuments = store?.documents.filter(d => d.id !== data) || []

    return store && {...store, documents: newDocuments}
  })
  .reset(resetTransport);

sample({
  clock: handleGoNext,
  source: $transport as Store<any>,
  filter: (src) => src !== null,
  target: handleGoNextFx
});

sample({
  source: $transport,
  fn: (deal) => deal?.id as number,
  filter: (src) => src !== null,
  target: [
    transportFlowModel.$id,
    dealDocumentUploadModel.$transportDocumentId
  ]
});

sample({
  source: $transport,
  filter: (src) => src !== null,
  fn: (deal) => {
    if (deal) {
      return {
        type: DealType.TRANSPORT,
        status: deal.status.id,
        cargoType: deal.cargoType,
        comment: deal.comment,
        phone: deal.senderPhone,
        loadingHours: deal.loadingHours,
        weight: deal.weight.toString(),
        recipient: deal.recipient,
        sender: deal.sender,
        deliveryAddress: deal.deliveryAddress,
        whoDelivers: dealDelivery.find((el) => el.id === deal.whoDelivers?.id),
        loadingFormat: loadingFormatSelectValues.find(el=>el.id === deal?.loadingType.id) || null,
        shippingAddress: deal.shippingAddress,
        weekendWork: deal.weekendWork,
        ...(deal.deliveryLatitude
          && {
            deliveryLatitude: deal.deliveryLatitude
          }
        ),
        ...(deal.deliveryLongitude
          && {
            deliveryLongitude: deal.deliveryLongitude
          }
        ),
        ...(deal.deliveryCity
          && {
            deliveryCity: deal.deliveryCity?.id || deal.deliveryCity
          }
        ),
        ...(deal.shippingLatitude
          && {
            shippingLatitude: deal.shippingLatitude
          }
        ),
        ...(deal.shippingLongitude
          && {
            shippingLongitude: deal.shippingLongitude
          }
        ),
        ...(deal.shippingCity
          && {
            shippingCity: deal.shippingCity?.id || deal.shippingCity
          }
        ),
        ...(deal.deliveryDate
          && {
            delivery_date: new Date(deal.deliveryDate)
          }
        ),
        ...(deal.shippingDate
          && {
            shipping_date: new Date(deal.shippingDate)
          }
        ),
        ...(deal.loadedWeight
          && {
            loaded_weight: deal.loadedWeight
          }
        ),
        ...(deal.acceptedWeight
          && {
            accepted_weight: deal.acceptedWeight
          }
        ),
        // @ts-ignore
        ...(deal.loadingHours
          && {
            // @ts-ignore
            loading_hours: deal.loadingHours
          }
        )
      };
    }
    return {};
  },
  target: transportFlowModel.transportForm.setForm
});

sample({
  clock: gate.close,
  target: resetTransport
});

export {
  getTransportFx,
  $transport,
  gate,
  handleGoNext,
  $offers,
  deleteTransportDocumentFx
}
