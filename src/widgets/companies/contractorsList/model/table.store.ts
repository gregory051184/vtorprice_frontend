import {
  attach,
  createEffect, createStore, merge, sample,
} from 'effector';
import { AxiosError } from 'axios';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { contractorApi } from '@box/entities/contractors';
import { IContractor, IContractorDocument } from '@box/entities/contractors/model';
import { createGate } from 'effector-react';
import { contractorsListFiltersModel } from '@box/features/company/filters/contractors';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { logistContractorCreateForm } from '@box/features/company/forms/create/createContractor';

const gate = createGate();
const ordering = createOrdering();

const getContractorsFx = createEffect<
Parameters<typeof contractorApi.getContractors>[0]
, {
  data: Awaited<ReturnType<typeof contractorApi.getContractors>>['data'],
  page?: number
}, AxiosError>({
  handler: async (params) => {
    const { data } = await contractorApi.getContractors(params);
    return {
      data,
      page: params.page
    };
  }
});

const getContractorFx = createEffect<
Parameters<typeof contractorApi.getContractor>[0], IContractor, AxiosError>({
  handler: async (id) => {
    const { data } = await contractorApi.getContractor(id);
    return data;
  }
});

const createContractorFx = createEffect<
Parameters<typeof contractorApi.createContractor>[0]
, IContractor, AxiosError>({
  handler: async (params) => {
    const { data } = await contractorApi.createContractor(params);
    return data;
  }
});

const postContractorDocumentsFx = createEffect<
{ id: number, contractorDocuments: FileList | null }
, Array<IContractorDocument> | null, AxiosError>({
  handler: async ({ id, contractorDocuments }) => {
    if (contractorDocuments && contractorDocuments?.length > 0) {
      const arrFile = Array.from(contractorDocuments);
      const datas = await Promise.all(
        arrFile.map((file) => contractorApi.postContractorDocument(id, file)) 
      );

      const allDocuments = datas.reduce((prev, current) => {
        if (prev.data.documents.length > current.data.documents.length) {
          return prev;
        }
        return current;
      });

      return allDocuments.data.documents;
    }
    
    return null;
  }
});

const createContractorWithForm = attach({
  source: logistContractorCreateForm.form.$values,
  mapParams: (_, form) => ({
    name: form.name,
    address: form.address,
    contractor_type: form.contractor_type?.value as number,
    transport_owns_count: +form.transport_owns_count,
    latitude: +form.latitude,
    longitude: +form.longitude,
    avatar_or_company_logo: form.avatar_or_company_logo,
    //@ts-ignore
    documents: form.document
  }),
  effect: createContractorFx
});

sample({
  clock: logistContractorCreateForm.form.formValidated,
  target: createContractorWithForm
});

sample({
  clock: createContractorFx.doneData,
  source: logistContractorCreateForm.form.$values,
  fn: (filters, responce) => ({ id: responce.id, contractorDocuments: filters.document }),
  target: postContractorDocumentsFx
});

sample({
  clock: postContractorDocumentsFx.done,
  target: logistContractorCreateForm.form.reset
});

const updateContractorFx = createEffect<
Parameters<typeof contractorApi.updateContractor>
, IContractor, AxiosError>({
  handler: async (params) => {
    const { data } = await contractorApi.updateContractor(params[0], params[1]);
    return data;
  }
});

const deleteContractorFx = createEffect<
Parameters<typeof contractorApi.deleteContractor>[0]
, IContractor, AxiosError>({
  handler: async (params) => {
    const { data } = await contractorApi.deleteContractor(params);
    return data;
  }
});

const pagination = createPagination(getContractorsFx, merge([
  gate.close,
  contractorsListFiltersModel.filters.$values
]));

const getContractorsWithFiltersFx = attach({
  source: {
    filters: contractorsListFiltersModel.filters.$values,
    page: pagination.$currentPage,
    size: pagination.$perPage,
    ordering: ordering?.$ordering
  },
  mapParams: (_, {
    filters, page, ordering, size 
  }) => ({
    page,
    size,
    ordering,
    search: filters.search,
    city: filters.city?.value.id,
  }),
  effect: getContractorsFx,
});

sample({
  clock: [gate.open, contractorsListFiltersModel.filters.$values, 
    ordering.setOrdering, pagination.loadMore, pagination.setPerPage],
  target: getContractorsWithFiltersFx
});

const contractorsLoading = createLoaderStore(false, getContractorsFx);

const $contractors = createStore<Array<IContractor>>([])
  .on(getContractorsFx.doneData, (state, data) => {
    if (data.page && data.page > 1) {
      return [
        ...state,
        ...data.data.results,
      ];
    }
    return data.data.results;
  })
  .on(updateContractorFx.doneData, (state, data) => {
    const newState = [...state];
    const updatedContractorIndex = newState.findIndex((el) => el.id === data.id);
    if (updatedContractorIndex) {
      newState[updatedContractorIndex] = data;
    }
    return newState;
  })
  .on(createContractorFx.doneData, (store, data) => [...store, data])
  .on(postContractorDocumentsFx.doneData, (state, data) => {
    const newState = [...state];
    if (data) {
      const updatedContractorIndex = newState.findIndex((el) => el.id === data[0].objectId);
      newState[updatedContractorIndex].documents = data;
    }
    return newState;
  });

const $contractor = createStore<IContractor | null>(null)
  .on(getContractorFx.doneData, (_, data) => data)
  .on(updateContractorFx.doneData, (_, data) => data);

export {
  gate,
  ordering,
  pagination,
  $contractors,
  $contractor,
  getContractorsFx,
  getContractorFx,
  updateContractorFx,
  contractorsLoading,
  deleteContractorFx,
  createContractorFx
};
