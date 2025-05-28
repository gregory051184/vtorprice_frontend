import {createEffect, createEvent, createStore, sample, Store} from "effector";
import {equipmentDealFlowModel} from "@box/features/deal/forms/equipment/flow";
import {equipmentDealsApi} from "@box/entities/application/api/equipmentDealsApi";
import {createGate} from "effector-react";
import {ITransportApplicationModel, IUpdateTransportApplicationParams} from "@box/entities/logistics/model";
import {logisticsApplicationsApi} from "@box/entities/logistics/api";
import {DealStatus, DealType, IDeal, TransportApplicationStatus} from "@box/entities/deal/model";
import {LogisticsOfferApi, logisticsOfferModel} from "@box/entities/logistics_offer";
import {dealDelivery, dealPaymentTerms} from "@box/entities/deal";
import {dealDocumentUploadModel} from "@box/features/deal";
import {loadingFormatSelectValues} from "@box/entities/logistics/lib";
import {$authStore, IAuthUser} from "@box/entities/auth";
import Router from "next/router";
import {updateDealFx} from "@box/features/deal/forms/flow/model";

const getDealFx = createEffect<number, any>({
    handler: async (id) => {
        const {data: deal} = await equipmentDealsApi.get(id);
        return deal;
    }
});

const deleteEquipmentDocumentFx = createEffect<{ dealId: number, docId: number }, number>({
    handler: async ({dealId, docId}) => {
        await equipmentDealsApi.deleteDocument(dealId, docId)
        return docId;
    }
})

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

const processEquipmentDealFx = createEffect<{
    deal: any,
    user: IAuthUser
}, void>({
    handler: ({deal, user}) => {
        if (deal?.status.id === DealStatus.CLOSED && deal.needReview) {
            Router.push(`/equipment-deals/${deal.id}/review`);
        }
        const userPays = (deal.buyerPaysShipping && deal.buyerCompany.id === user?.company?.id)
            || (!deal.buyerPaysShipping && deal.supplierCompany.id === user?.company?.id);

        if (deal?.whoDelivers.id === 3
            && deal.status.id === DealStatus.LOGIST_ASSIGNMENT
            && !deal.transportApplication && userPays) {
            Router.push(`/transport-new-application?from-equipment-deal=${deal.id}`);
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
    target: processEquipmentDealFx
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
// @ts-ignore
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

const $deal = createStore<any | null>(null)
    .on(getDealFx.doneData, (_, data) => data)

    //ДОБАВИЛ
    .on(updateDealFx.doneData, (_, data) => data)
    // @ts-ignore
    .on(handleGoNextFx.doneData, (store, data) => {
        return store && {...store, transportApplication: data}
    })
    .on(equipmentDealFlowModel.updateEquipmentDealFx.doneData, (store, data) => data)
    .on(dealDocumentUploadModel.uploadEquipmentDocumentFx.doneData, (_, data) => data)
    .on(deleteEquipmentDocumentFx.doneData, (store, data) => {
        // @ts-ignore
        const newDocuments = store?.documents.filter(d => d.id !== data) || []

        return store && {...store, documents: newDocuments}
    })
    .reset(resetDeal);

// @ts-ignore
sample({
    clock: handleGoNext,
    source: $deal as Store<IDeal>,
    // @ts-ignore
    filter: (src) => src !== null,
    target: handleGoNextFx
});

sample({
    source: $deal,
    fn: (deal) => deal?.id as number,
    filter: (src) => src !== null,
    target: [
        equipmentDealFlowModel.$id,
        dealDocumentUploadModel.$equipmentDocumentId
    ]
});

sample({
    source: $deal,
    filter: (src) => src !== null,
    fn: (deal) => {

        if (deal) {
            return {
                other_payment_term: deal.otherPaymentTerm,
                count: deal.count,
                paymentTerm: dealPaymentTerms.find((el) => el.id === deal.paymentTerm.id),
                manufactureDate: deal.application.manufactureDate,
                price: deal.price,
                dealType: DealType.TRANSPORT,
                status: deal.status.id,
                cargoType: deal.transportApplication?.cargoType,
                comment: deal.transportApplication?.comment,
                loadingHours: deal.transportApplication?.loadingHours,
                weight: deal.weight,
                recipient: deal.transportApplication?.recipient,
                sender: deal.transportApplication?.sender,
                phone: deal.transportApplication?.senderPhone,
                deliveryAddress: deal.deliveryAddress,
                whoDelivers: dealDelivery.find((el) => el.id === deal.whoDelivers.id),
                loadingFormat: loadingFormatSelectValues.find(el => el.id === deal.transportApplication?.loadingType?.id) || null,
                shippingAddress: deal.shippingAddress,
                weekendWork: deal.transportApplication?.weekendWork,
                deliveryCity: deal.deliveryCity,
                shippingCity: deal.shippingCity,
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
                ),
            };
        }
        return {};
    },
    target: equipmentDealFlowModel.form.set
});

sample({
    clock: gate.close,
    target: resetDeal
});

export {
    getDealFx,
    $deal,
    gate,
    handleGoNext,
    $offers,
    deleteEquipmentDocumentFx
}
