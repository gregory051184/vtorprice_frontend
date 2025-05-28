import { $authHost } from "@box/shared/api";
import { attach, createEffect, createStore } from "effector";

const $id = createStore(0);
const $equipmentDocumentId = createStore(0);
const $transportDocumentId = createStore(0);

const uploadDocumentFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
    },
    any
  >({
    handler: async ({ dealId, document, name }) => {
      const { data } = await $authHost.post(
        `/recyclables_deals/${dealId}/add_documents/`,
        {
          document,
          name,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
  }),
  source: $id,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

const uploadDocumentWithTypesFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
      document_type: number;
    },
    any
  >({
    handler: async ({ dealId, document, name, document_type }) => {
      const data = await $authHost.post(
        `/recyclables_deals/${dealId}/add_documents/`,
        {
          document,
          name,
          document_type
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.data;
    },
  }),
  source: $id,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

const uploadEquipmentDocumentFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
    },
    any
  >({
    handler: async ({ dealId, document, name }) => {
      const { data } = await $authHost.post(
        `/equipment_deals/${dealId}/add_documents/`,
        {
          document,
          name,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
  }),
  source: $equipmentDocumentId,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

const uploadEquipmentDocumentWithTypesFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
      document_type: number;
    },
    any
  >({
    handler: async ({ dealId, document, name, document_type }) => {
      const { data } = await $authHost.post(
        `/equipment_deals/${dealId}/add_documents/`,
        {
          document,
          name,
          document_type
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
  }),
  source: $equipmentDocumentId,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

const uploadTransportDocumentFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
    },
    any
  >({
    handler: async ({ dealId, document, name }) => {
      const { data } = await $authHost.post(
        `/transport_applications/${dealId}/add_documents/`,
        {
          document,
          name,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
  }),
  source: $transportDocumentId,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

const uploadTransportDocumentWithTypesFx = attach({
  effect: createEffect<
    {
      dealId: number;
      document: File;
      name: string;
      document_type: number;
    },
    any
  >({
    handler: async ({ dealId, document, name, document_type }) => {
      const { data } = await $authHost.post(
        `/transport_applications/${dealId}/add_documents/`,
        {
          document,
          name,
          document_type
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
  }),
  source: $transportDocumentId,
  mapParams(params: any, states) {
    params.dealId = states;
    return params;
  },
});

export {
  $id,
  uploadDocumentFx,
  uploadEquipmentDocumentFx,
  $equipmentDocumentId,
  $transportDocumentId,
  uploadTransportDocumentFx,
  uploadDocumentWithTypesFx,
  uploadEquipmentDocumentWithTypesFx,
  uploadTransportDocumentWithTypesFx
};
