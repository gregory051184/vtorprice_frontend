import {
    createEffect, createEvent, createStore, sample, Store
} from 'effector';
import {
    dealApi, dealDelivery, dealModel, dealPaymentTerms
} from '@box/entities/deal';
import {dealFlowModel, dealDocumentUploadModel} from '@box/features/deal';
import {packingSelectValues, packingTaxSelectValues} from '@box/entities/application';
import {DealStatus, DealType, IDeal} from '@box/entities/deal/model';
import {createGate} from 'effector-react';
import Router from 'next/router';
import {$authStore, IAuthUser} from '@box/entities/auth';
import {LogisticsOfferApi, logisticsOfferModel} from '@box/entities/logistics_offer';
import {updateApplicationFx} from "@box/entities/application/model";

const getDealFx = createEffect<number, dealModel.IDeal>({
    handler: async (id) => {
        const {data: deal} = await dealApi.get(id);
        return deal;
    }
});

const deleteDocumentFx = createEffect<{ dealId: number, docId: number }, number>({
    handler: async ({dealId, docId}) => {
        await dealApi.deleteDocument(dealId, docId)
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

const processDealFx = createEffect<{
    deal: dealModel.IDeal,
    user: IAuthUser
}, void>({
    handler: ({deal, user}) => {
        if (deal?.status.id === DealStatus.CLOSED && deal.needReview) {
            Router.push(`/deals/${deal.id}/review`);
        }
        const userPays = (deal.buyerPaysShipping && deal.buyerCompany.id === user?.company?.id)
            || (!deal.buyerPaysShipping && deal.supplierCompany.id === user?.company?.id);

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
    fn: (src) => src.id,
    target: getLogisticsOffersFx
});

const goStepFx = createEffect<{
    id: number,
    status: DealStatus
}, IDeal>({

    handler: async ({
                        id,
                        status
                    }) => {

        const {data} = await dealApi.update(id, {
            status
        });
        return data;
    }

});

const handleGoNext = createEvent();

//ДОБАВИЛ
const handleGoPrevious = createEvent();

const handleGoPreviousFX = createEffect<IDeal, IDeal>({
    handler: async (deal) => {
        switch (deal.status.id) {

            case DealStatus.LOGIST_ASSIGNMENT: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.AGREEMENT
                });

                return data;
            }

            case DealStatus.AGREEMENT: {
                if ([1, 2].includes(deal.whoDelivers.id)) {
                    const data = await goStepFx({
                        id: deal.id,
                        status: DealStatus.NEW
                    });

                    return data;
                }

                const data = goStepFx({
                    id: deal.id,
                    status: DealStatus.NEW
                });

                return data;
            }

            case DealStatus.LOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.AGREEMENT
                });

                return data;
            }

            case DealStatus.UNLOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.LOADED
                });

                return data;
            }

            case DealStatus.FINAL: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.UNLOADED
                });

                return data;
            }

            case DealStatus.CLOSED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.FINAL
                });

                return data;
            }

            default:
                break;
        }
        return goStepFx({
            id: deal.id,
            status: DealStatus.LOADED
        });
    }
})

//_____________________________________________________________________


const handleGoNextFx = createEffect<IDeal, IDeal>({
    handler: async (deal) => {
        switch (deal.status.id) {
            case DealStatus.AGREEMENT: {
                if ([1, 2].includes(deal.whoDelivers.id)) {
                    const data = await goStepFx({
                        id: deal.id,
                        status: DealStatus.LOADED
                    });

                    return data;
                }

                const data = goStepFx({
                    id: deal.id,
                    status: DealStatus.LOGIST_ASSIGNMENT
                });
                // Router.push(`/transport-new-application?from-deal=${deal.id}`);

                return data;
            }
            case DealStatus.LOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.UNLOADED
                });

                return data;
            }
            case DealStatus.UNLOADED: {
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.FINAL
                });

                return data;
            }
            case DealStatus.FINAL: {
                //ДОБАВИЛ
                if (deal.application.urgencyType.id === 1) {
                    await updateApplicationFx({id: deal.application.id, status: 3});
                }
                //_____________________________________________________
                const data = await goStepFx({
                    id: deal.id,
                    status: DealStatus.CLOSED
                });
                return data;
            }
            default:
                break;
        }
        return goStepFx({
            id: deal.id,
            status: DealStatus.LOADED
        });
    }
});

sample({
    // @ts-ignore
    clock: handleGoNextFx.doneData,
    source: $authStore,
    fn: (src, clock) => ({
        deal: clock,
        user: src.user
    }),
    filter: (src) => src.user !== null,
    target: processDealFx
})

const gate = createGate();

const resetDeal = createEvent();

const $deal = createStore<dealModel.IDeal | null>(null)
    .on(getDealFx.doneData, (_, data) => data)
    .on(dealFlowModel.updateDealFx.doneData, (_, data) => data)
    .on(dealDocumentUploadModel.uploadDocumentFx.doneData, (_, data) => data)
    .on(handleGoNextFx.doneData, (_, data) => data)
    //ДОБАВИЛ
    .on(handleGoPreviousFX.doneData, (_, data) => data)
    //_______________________________________________________________________
    .on(deleteDocumentFx.doneData, (store, data) => {
        const newDocuments = store?.documents.filter(d => d.id !== data) || []

        return store && {...store, documents: newDocuments}
    })
    .reset(resetDeal);

sample({
    clock: handleGoNext,
    source: $deal as Store<IDeal>,
    filter: (src) => src !== null,
    target: handleGoNextFx
});
//ДОБАВИЛ
sample({
    clock: handleGoPrevious,
    source: $deal as Store<IDeal>,
    filter: (src) => src !== null,
    target: handleGoPreviousFX
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
            const taxType = packingTaxSelectValues.find((el) => el.value === deal.application.packingDeductionType?.id)
            return {
                weediness: deal.weediness.toString(),
                moisture: deal.moisture.toString(),
                price: deal.price.toString(),
                weight: (deal.weight / 1000).toFixed(1),
                withNds: deal.withNds,
                deliveryAddress: deal.deliveryAddress,
                deliveryLatitude: deal.deliveryLatitude,
                deliveryLongitude: deal.deliveryLongitude,
                shippingAddress: deal.shippingAddress,
                shippingLatitude: deal.shippingLatitude,
                shippingLongitude: deal.shippingLongitude,
                whoDelivers: dealDelivery.find((el) => el.id === deal.whoDelivers.id),
                packing: packingSelectValues[deal.isPackingDeduction ? 1 : 0],
                payment_term: dealPaymentTerms.find((el) => el.id === deal.paymentTerm.id),
                other_payment_term: deal.otherPaymentTerm,
                comment: deal.comment,
                type: DealType.RECYCLABLES,
                status: deal.status.id,
                sellerPay: {
                    id: deal.buyerPaysShipping ? 2 : 1,
                    label: deal.buyerPaysShipping ? 'Покупатель' : 'Продавец',
                    value: !deal.buyerPaysShipping
                },
                ...(deal.isPackingDeduction
                    && {
                        packingTax: taxType
                    }
                ),
                ...(deal.isPackingDeduction
                    && {packingTaxVolume: taxType?.id === 2 ? deal.packingDeductionValue : (deal.packingDeductionValue / 1000)}
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
                        loaded_weight: (+deal.loadedWeight / 1000).toFixed(1)
                    }
                ),
                ...(deal.acceptedWeight
                    && {
                        accepted_weight: (+deal.acceptedWeight / 1000).toFixed(1)
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

sample({
    clock: gate.close,
    target: dealFlowModel.form.reset
});

export {
    getDealFx,
    deleteDocumentFx,
    $deal,
    handleGoNext,
    gate,
    $offers,
    //ДОБАВИЛ
    handleGoPrevious
};
