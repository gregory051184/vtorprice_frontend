import {createEffect, createEvent, createStore, sample} from "effector";
import {equipmentDealsApi} from "@box/entities/application/api/equipmentDealsApi";
import {DealStatus, DealType, IDeal} from "@box/entities/deal/model";
import Router from "next/router";
import {createGate} from "effector-react";
import {dealDelivery, dealPaymentTerms} from "@box/entities/deal";
import {equipmentDealFlowModel} from "@box/features/deal/forms/equipment/flow";
import {dealDocumentUploadModel} from '@box/features/deal';
import {$authStore, IAuthUser} from "@box/entities/auth";

const getEquipmentDealFx = createEffect<number, any>({
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
    clock: getEquipmentDealFx.doneData,
    source: $authStore,
    // @ts-ignore
    fn: (src, clock) => ({
        deal: clock,
        user: src.user
    }),
    // @ts-ignore
    filter: (src) => src.user !== null,
    target: processEquipmentDealFx
});

const goStepFx = createEffect<{
    id: number,
    status: DealStatus,
    count: number,
}, IDeal>({
    handler: async ({
                        id,
                        status,
                        count
                    }) => {
        const {data} = await equipmentDealsApi.update(id, {
            status,
            count
        });

        return data;
    }
});

const handleGoNext = createEvent();
const handleGoPrevious = createEvent();


const handleGoPreviousFx = createEffect<IDeal, IDeal>({
    handler: async (deal) => {
        switch (deal.status.id) {
            case DealStatus.AGREEMENT: {
                if ([1, 2].includes(deal.whoDelivers.id)) {
                    const data = await goStepFx({
                        id: deal.id,
                        status: DealStatus.NEW,
                        // @ts-ignore
                        count: deal.count
                    });

                    return data;
                }

                const data = goStepFx({
                    id: deal.id,
                    status: DealStatus.NEW,
                    // @ts-ignore
                    count: deal.count
                });

                // Router.push(`/transport-new-application?from-equipments-deal=${deal.id}`);

                return data;
            }
            case DealStatus.LOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.AGREEMENT,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            case DealStatus.UNLOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.LOADED,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            case DealStatus.FINAL: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.AGREEMENT,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            default:
                break;
        }
        return goStepFx({
            id: deal.id,
            status: DealStatus.LOADED,
            // @ts-ignore
            count: deal.count
        });
    }
});


const handleGoNextFx = createEffect<IDeal, IDeal>({
    handler: async (deal) => {
        switch (deal.status.id) {
            case DealStatus.AGREEMENT: {
                if ([1, 2].includes(deal.whoDelivers.id)) {
                    const data = await goStepFx({
                        id: deal.id,
                        status: DealStatus.LOADED,
                        // @ts-ignore
                        count: deal.count
                    });

                    return data;
                }

                const data = goStepFx({
                    id: deal.id,
                    status: DealStatus.LOGIST_ASSIGNMENT,
                    // @ts-ignore
                    count: deal.count
                });

                // Router.push(`/transport-new-application?from-equipments-deal=${deal.id}`);

                return data;
            }
            case DealStatus.LOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.UNLOADED,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            case DealStatus.UNLOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.FINAL,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            case DealStatus.FINAL: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.CLOSED,
                    // @ts-ignore
                    count: deal.count
                });

                return data;
            }
            default:
                break;
        }
        return goStepFx({
            id: deal.id,
            status: DealStatus.LOADED,
            // @ts-ignore
            count: deal.count
        });
    }
});

sample({
    // @ts-ignore
    clock: handleGoNextFx.doneData,
    source: $authStore,
    // @ts-ignore
    fn: (src, clock) => ({
        deal: clock,
        user: src.user
    }),
    // @ts-ignore
    filter: (src) => src.user !== null,
    target: processEquipmentDealFx
});


sample({
    // @ts-ignore
    clock: handleGoPreviousFx.doneData,
    source: $authStore,
    // @ts-ignore
    fn: (src, clock) => ({
        deal: clock,
        user: src.user
    }),
    // @ts-ignore
    filter: (src) => src.user !== null,
    target: processEquipmentDealFx
});

const gate = createGate();

const resetDeal = createEvent();

const $equipmentDeal = createStore<any | null>(null)
    .on(getEquipmentDealFx.doneData, (_, data) => data)
    .on(deleteEquipmentDocumentFx.doneData, (store, data) => {
        // @ts-ignore
        const newDocuments = store?.documents.filter(d => d.id !== data) || []

        return store && {...store, documents: newDocuments}
    })
    .on(dealDocumentUploadModel.uploadEquipmentDocumentFx.doneData, (_, data) => data)
    .on(equipmentDealFlowModel.updateEquipmentDealFx.doneData, (_, data) => data)
    .on(handleGoNextFx.doneData, (_, data) => data)
    .on(handleGoPreviousFx.doneData, (_, data) => data)
    .reset(resetDeal);

sample({
    clock: handleGoNext,
    source: $equipmentDeal,
    filter: (src) => src !== null,
    target: handleGoNextFx
});

sample({
    clock: handleGoPrevious,
    source: $equipmentDeal,
    filter: (src) => src !== null,
    target: handleGoPreviousFx
});

sample({
    source: $equipmentDeal,
    fn: (deal) => deal?.id as number,
    filter: (src) => src !== null,
    target: [
        equipmentDealFlowModel.$id,
        dealDocumentUploadModel.$equipmentDocumentId
    ]
});

sample({
    source: $equipmentDeal,
    filter: (src) => src !== null,
    fn: (deal) => {
        if (deal) {
            return {
                other_payment_term: deal.otherPaymentTerm,
                dealType: DealType.EQUIPMENT,
                price: deal.price,
                count: deal.count,
                type: deal.application.equipment.name,
                saleByParts: deal.application.saleByParts,
                withNds: deal.withNds,
                deliveryAddress: deal.deliveryAddress,
                deliveryLatitude: deal.deliveryLatitude,
                deliveryLongitude: deal.deliveryLongitude,
                deliveryCity: deal.deliveryCity,
                shippingAddress: deal.shippingAddress,
                shippingLatitude: deal.shippingLatitude,
                shippingLongitude: deal.shippingLongitude,
                shippingCity: deal.shippingCity,
                whoDelivers: dealDelivery.find((el) => el.id === deal.whoDelivers.id),
                paymentTerm: dealPaymentTerms.find((el) => el.id === deal.paymentTerm.id),
                comment: deal.comment,
                wasInUse: deal.application.wasInUse,
                status: deal.status.id,
                manufactureDate: deal.application.manufactureDate,
                sellerPay: {
                    id: deal.buyerPaysShipping ? 2 : 1,
                    label: deal.buyerPaysShipping ? 'Покупатель' : 'Продавец',
                    value: !deal.buyerPaysShipping
                },
                weight: (1).toFixed(1) // / 1000
                ,
                ...(deal.shippingDate
                    && {
                        shipping_date: new Date(deal.shippingDate)
                    }
                ),
                ...(deal.deliveryDate
                    && {
                        delivery_date: new Date(deal.deliveryDate)
                    }
                ),
                ...(deal.loadedWeight
                    && {
                        loaded_weight: ((+deal.loadedWeight) / 1000).toFixed(1)
                    }
                ),
                ...(deal.acceptedWeight
                    && {
                        accepted_weight: ((+deal.acceptedWeight) / 1000).toFixed(1)
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
    getEquipmentDealFx,
    $equipmentDeal,
    gate,
    handleGoNext,
    handleGoPrevious,
    deleteEquipmentDocumentFx
}
