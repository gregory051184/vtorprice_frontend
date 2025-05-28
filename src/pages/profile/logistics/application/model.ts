import {
    createEffect, createEvent, createStore, sample, Store
} from 'effector';
import {
    dealApi, dealDelivery, dealModel
} from '@box/entities/deal';
import {dealFlowModel, dealDocumentUploadModel} from '@box/features/deal';
import {DealStatus, DealType, IDeal, TransportApplicationStatus} from '@box/entities/deal/model';
import {createGate} from 'effector-react';
import Router from 'next/router';
import {$authStore, IAuthUser} from '@box/entities/auth';
import {LogisticsOfferApi, logisticsOfferModel} from '@box/entities/logistics_offer';
import {loadingFormatSelectValues} from '@box/entities/logistics/lib';
import {logisticsApplicationsApi} from "@box/entities/logistics/api";
import {ITransportApplicationModel, IUpdateTransportApplicationParams} from "@box/entities/logistics/model";
import {updateDealFx} from "@box/features/deal/forms/flow/model";

const getDealFx = createEffect<number, dealModel.IDeal>({
    handler: async (id) => {
        const {data: deal} = await dealApi.get(id);
        return deal;
    }
});
const getLogisticsOffersFx = createEffect<number, Array<logisticsOfferModel.ILogisticsOffer>>({
    handler: async (id) => {
        const {data} = await LogisticsOfferApi.list({
            id
        });
        return data.results;
    }
});

const $offers = createStore<Array<logisticsOfferModel.ILogisticsOffer>>([])
    .on(getLogisticsOffersFx.doneData, (_, data) => data);

const processDealFx = createEffect<{
    deal: dealModel.IDeal,
    user: IAuthUser
}, void>({
    handler: ({deal, user}) => {
        if (deal?.status.id === DealStatus.CLOSED && deal.needReview) {
            Router.push(`/deals/${deal.id}/review`);
        }
        const userPays = (deal.buyerPaysShipping && deal.buyerCompany.id === user.company.id)
            || (!deal.buyerPaysShipping && deal.supplierCompany.id === user.id);

        if (deal?.whoDelivers.id === 3
            && deal.status.id === DealStatus.LOGIST_ASSIGNMENT
            && !deal.transportApplication && userPays) {
            Router.push(`/transport-new-application?from-deal=${deal.id}`);
        }
    }
});

sample({
    // @ts-ignore
    clock: getDealFx.doneData,
    source: $authStore,
    fn: (src, clock) => ({
        deal: clock,
        user: src.user
    }),
    filter: (src) => src.user !== null,
    target: processDealFx
});

sample({
    source: getDealFx.doneData,
    fn: (src) => src?.transportApplication?.id as number,
    target: getLogisticsOffersFx
});

const goStepFx = createEffect<
    { id: number, params: IUpdateTransportApplicationParams }, ITransportApplicationModel
>({
    handler: async ({
                        id,
                        params
                    }) => {
        const {data} = await logisticsApplicationsApi.updateTransportApplication(id, params)

        return data;
    }
})

const handleGoNext = createEvent();

const handleGoPrevious = createEvent();

const handleGoPreviousFx = createEffect<IDeal, ITransportApplicationModel>({
    handler: async (deal) => {
        const id = deal?.transportApplication?.id;
        const statusId = deal.transportApplication?.status.id;

        switch (statusId) {

            case TransportApplicationStatus.LOADING: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {},
                        status: TransportApplicationStatus.AGREEMENT
                    }
                });
            }
            case TransportApplicationStatus.UNLOADING: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {},
                        status: TransportApplicationStatus.LOADING
                    }
                });
            }
            case TransportApplicationStatus.COMPLETED: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {},
                        status: TransportApplicationStatus.UNLOADING
                    }
                });
            }

            case TransportApplicationStatus.FINAL: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {},
                        status: TransportApplicationStatus.COMPLETED
                    }
                });
            }

            default: break;
        }

        // @ts-ignore
        return goStepFx({id, params: {deal: {}, status: TransportApplicationStatus.AGREEMENT}});
    }
});

const handleGoNextFx = createEffect<IDeal, ITransportApplicationModel>({
    handler: async (deal) => {
        const id = deal?.transportApplication?.id;
        const statusId = deal.transportApplication?.status.id;
        switch (statusId) {

            case TransportApplicationStatus.LOADING: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {shipping_date: deal.shippingDate, loaded_weight: deal.loadedWeight},
                        status: statusId + 1
                    }
                });
            }
            case TransportApplicationStatus.UNLOADING: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {delivery_date: deal.deliveryDate, accepted_weight: deal.acceptedWeight},
                        status: statusId + 1
                    }
                });
            }
            case TransportApplicationStatus.COMPLETED: {
                return goStepFx({
                    // @ts-ignore
                    id,
                    params: {
                        deal: {delivery_date: deal.deliveryDate, accepted_weight: deal.acceptedWeight},
                        status: TransportApplicationStatus.FINAL
                    }
                });
            }
            default:
                break;
        }

        // @ts-ignore
        return goStepFx({id, params: {deal: {}, status: statusId + 1}});
    }
});

const gate = createGate();

const resetDeal = createEvent();

//@ts-ignore
const $deal = createStore<dealModel.IDeal | null>(null)
    .on(getDealFx.doneData, (_, data) => data)
    //ДОБАВИЛ
    .on(updateDealFx.doneData, (_, data) => data)

    //.on(dealFlowModel.updateDealFx.doneData, (store, data) => ({...store, transportApplication: data}))
    .on(dealDocumentUploadModel.uploadDocumentFx.doneData, (_, data) => data)
    // @ts-ignore
    .on(handleGoNextFx.doneData, (store, data) => {
        return {...store, transportApplication: data}
    })
    //ДОБАВИЛ
    // @ts-ignore
    .on(handleGoPreviousFx.doneData, (store, data) => {
        return {...store, transportApplication: data}})

    .reset(resetDeal);

sample({
    clock: handleGoNext,
    source: $deal as Store<IDeal>,
    filter: (src) => src !== null,
    target: handleGoNextFx
});

sample({
    clock: handleGoPrevious,
    source: $deal as Store<IDeal>,
    filter: (src) => src !== null,
    target: handleGoPreviousFx
});

sample({
    source: $deal,
    fn: (deal) => deal?.id as number,
    filter: (src) => src !== null,
    target: [dealFlowModel.$id, dealDocumentUploadModel.$id]
});

sample({
    source: $deal,
    filter: (src) => src !== null,
    fn: (deal) => {
        if (deal) {
            return {
                type: DealType.TRANSPORT,
                status: (deal.transportApplication?.status.id),
                cargoType: deal.transportApplication?.cargoType,
                comment: deal.transportApplication?.comment,
                loadingHours: deal.transportApplication?.loadingHours,
                weight: (deal.weight / 1000).toFixed(1),
                recipient: deal.transportApplication?.recipient,
                sender: deal.transportApplication?.sender,
                phone: deal.transportApplication?.senderPhone,
                deliveryAddress: deal.deliveryAddress,
                whoDelivers: dealDelivery.find((el) => el.id === deal.whoDelivers.id),
                loadingFormat: loadingFormatSelectValues.find(el => el.id === deal.transportApplication?.loadingType.id) || null,
                shippingAddress: deal.shippingAddress,
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
                        loaded_weight: (deal.loadedWeight / 1000).toFixed(1)
                    }
                ),
                ...(deal.acceptedWeight
                    && {
                        accepted_weight: (deal.acceptedWeight / 1000).toFixed(1)
                    }
                ),
                // @ts-ignore
                ...(deal.loadingHours
                    && {
                        // @ts-ignore
                        loading_hours: deal.loadingHours
                    }
                ),
            };
        }
        return {};
    },
    target: dealFlowModel.form.set
});

sample({
    clock: gate.close,
    target: resetDeal
});

export {
    getDealFx,
    $deal,
    handleGoNext,
    handleGoPrevious,
    gate,
    $offers
};
