import { AxiosError } from "axios";
import { attach, createEffect, createStore, sample, split } from "effector";
import { logisticsApplicationsApi } from "@box/entities/logistics/api/logistApi";
import { transportApplicationOfferFormModel } from "@box/features/logistics/forms/createTransportApplicationOffer";
import { createGate } from "effector-react";
import { IMyOffer, ITransportApplicationModel } from "./types";

const gate = createGate<{ id: number }>();

const getTransportApplicationFx = createEffect<
  Parameters<typeof logisticsApplicationsApi.getApplication>[0],
  ITransportApplicationModel,
  AxiosError
>({
  handler: async (params) => {
    const { data } = await logisticsApplicationsApi.getApplication(params);

    return data;
  },
});

const createTransportApplicationOfferFx = createEffect<
  {
    id: number;
    data: Parameters<
      typeof logisticsApplicationsApi.createTransportApplicationOffer
    >[1];
  },
  IMyOffer,
  AxiosError
>({
  handler: async (params) => {
    const { data } =
      await logisticsApplicationsApi.createTransportApplicationOffer(
        params.id,
        params.data
      );

    return data;
  },
});

const uppdataTransportApplicationOfferFx = createEffect<
  {
    idApplication?: number;
    idOffer?: number;
    data: Parameters<
      typeof logisticsApplicationsApi.uppdataTransportApplicationOffer
    >[2];
  },
  IMyOffer | {},
  AxiosError
>({
  handler: async (params) => {
    if (params.idApplication && params.idOffer) {
      const { data } =
        await logisticsApplicationsApi.uppdataTransportApplicationOffer(
          params.idApplication,
          params.idOffer,
          params.data
        );
      return data;
    }
    return {};
  },
});

const createTransportApplicationOffer = attach({
  source: {
    gate: gate.state,
    params: transportApplicationOfferFormModel.form.$values,
  },
  mapParams: (_, { gate, params }) => {
    return {
      id: gate.id,
      data: {
        application: gate.id,
        contractor: params.contractor?.value || 1,
        ...(params.amount && { amount: Number(params.amount) }),
        shippingDate: params.uploadDate?.toJSON() || "",
      },
    };
  },
  effect: createTransportApplicationOfferFx,
});

const $transportApplication = createStore<ITransportApplicationModel | null>(
  null
)
  .on(getTransportApplicationFx.doneData, (_, data) => data)
  .on(createTransportApplicationOffer.doneData, (state, data) => {
    if (state) {
      const newState = { ...state, myOffer: data };
      return newState;
    }
    return null;
  })
  .on(gate.close, () => null);

const uppdateTransportApplicationOffer = attach({
  source: {
    gate: gate.state,
    application: $transportApplication,
    params: transportApplicationOfferFormModel.form.$values,
  },
  mapParams: (_, { gate, application, params }) => {
    return {
      idApplication: gate.id,
      idOffer: application?.myOffer?.id,
      data: {
        contractor: params.contractor?.value || 1,
        ...(params.amount && { amount: Number(params.amount) }),
        shippingDate: params.uploadDate?.toJSON() || "",
      },
    };
  },
  effect: uppdataTransportApplicationOfferFx,
});

split({
  clock: transportApplicationOfferFormModel.form.formValidated,
  source: transportApplicationOfferFormModel.applyForm,
  match: (value) => value,
  cases: {
    send: createTransportApplicationOffer,
    change: uppdateTransportApplicationOffer,
  },
});

sample({
  clock: gate.open,
  fn: (value) => value.id,
  target: getTransportApplicationFx,
});

sample({
  clock: gate.close,
  target: transportApplicationOfferFormModel.form.reset
})

sample({
  source: $transportApplication,
  fn: (source) => {
    if (source && source.myOffer) {
      const contractor = source.myOffer.contractor;
      const uploadDate = new Date(source.myOffer.shippingDate);
      const amount = source.myOffer.amount.toString();
      return {
        contractor: {
          id: contractor.id,
          label: contractor.name,
          value: contractor.id,
        },
        uploadDate,
        amount,
      };
    }
    return {};
  },
  target: transportApplicationOfferFormModel.form.setForm,
});

export {
  $transportApplication,
  getTransportApplicationFx,
  createTransportApplicationOfferFx,
  createTransportApplicationOffer,
  gate,
};
