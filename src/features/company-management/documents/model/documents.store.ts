import {
  createStore, sample, createEvent, createEffect,
} from 'effector';
import { $authHost } from '@box/shared/api';
import { AxiosError } from 'axios';
import { companyModel } from '@box/entities/company';
import { $company } from '@box/pages/companies/company/model/company.store';

enum DOCTYPEKEY {
  CHARTER = 1,
  REQUISITES = 2,
  INN = 3,
}

type TRequiredDoctype = DOCTYPEKEY.CHARTER | DOCTYPEKEY.REQUISITES | DOCTYPEKEY.INN;

const $companyDocuments = $company.map((val) => val?.documents);

const setRequiredDocuments = createEvent<{ [key: string]: companyModel.ICompanyDocument }>();
const uploadRequiredDocument = createEvent<{ type: TRequiredDoctype, file: File }>();
const deleteRequiredDocument = createEvent<{ id: number, type: TRequiredDoctype }>();

const setNotRequiredDocuments = createEvent<Array<companyModel.ICompanyDocument>>();
const uploadNotRequiredDocument = createEvent<File>();
const deleteNotRequiredDocument = createEvent<number>();

const deleteDocumentApi = async (id: number) => {
  await $authHost.delete(`/company_documents/${id}`);
  return id;
};

const uploadDocumentApi = async ({ type, file }: { type: TRequiredDoctype | null, file: File}) => {
  const { data } = await $authHost.post('/company_documents/', {
    file,
    ...(type && { doc_type: type }),
    // @ts-ignore
    comment: file.name,
    company: $company.getState()?.id || 0
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const deleteRequiredDocumentFx = createEffect<
{
  id: number, type: TRequiredDoctype
}, number, AxiosError>({
  handler: async ({ id, type }) => {
    await deleteDocumentApi(id);
    return type;
  },
});

const uploadRequiredDocumentFx = createEffect<
{ type: TRequiredDoctype, file: File },
Required<companyModel.ICompanyDocument>,
AxiosError
>({
  handler: uploadDocumentApi,
});

const deleteNotRequiredDocumentFx = createEffect<number, number, AxiosError>({
  handler: deleteDocumentApi,
});

const uploadNotRequiredDocumentFx = createEffect<
File, Required<companyModel.ICompanyDocument>, AxiosError>({
  handler: async (file) => {return(uploadDocumentApi({
    type: null,
    file,
  }))},
});

const $documents = createStore<{
  [key: string]:companyModel.ICompanyDocument | null
}>({
  charter: null,
  inn: null,
  requisites: null,
})
  .on(uploadRequiredDocumentFx.doneData, (store, data) => ({
    ...store,
    [DOCTYPEKEY[data.docType.id].toLowerCase()]: data,
  }))
  .on(setRequiredDocuments, (_, documents) => documents)
  .on(deleteRequiredDocument, (store, { type }) => ({
    ...store,
    [DOCTYPEKEY[type].toLowerCase()]: null,
  }));

const $notRequiredDocuments = createStore<Array<companyModel.ICompanyDocument>>([])
  .on(setNotRequiredDocuments, (_, documents) => documents)
  .on(uploadNotRequiredDocumentFx.doneData, (store, data) => [...store, data])
  .on(deleteNotRequiredDocument, (store, id) => store.filter((el) => el.id !== id));

sample({
  source: $companyDocuments,
  fn: (source) => {
    if (source) {
      return source?.filter((el) => el.docType).reduce((acc, document) => ({
        ...acc,
        ...(document.docType && { [DOCTYPEKEY[document.docType.id].toLowerCase()]: document }),
      }), {});
    }
    return [];
  },
  target: setRequiredDocuments,
});

sample({
  source: $companyDocuments,
  fn: (source) => {
    if (source) {
      return source?.filter((el) => !el.docType);
    }
    return [];
  },
  target: setNotRequiredDocuments,
});

sample({
  clock: uploadRequiredDocument,
  target: uploadRequiredDocumentFx,
});

sample({
  clock: deleteRequiredDocument,
  target: deleteRequiredDocumentFx,
});

sample({
  clock: uploadNotRequiredDocument,
  source: uploadNotRequiredDocument,
  target: uploadNotRequiredDocumentFx,
});

sample({
  clock: deleteNotRequiredDocument,
  target: deleteNotRequiredDocumentFx,
});

export {
  $documents,
  uploadRequiredDocument,
  deleteRequiredDocument,
  uploadNotRequiredDocument,
  deleteNotRequiredDocument,
  $notRequiredDocuments,
};
