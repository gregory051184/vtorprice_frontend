import { createEffect, createStore, sample } from 'effector';
import { AxiosError } from 'axios';
import { applicationApi, applicationModel } from '@box/entities/application';

const getRecsFx = createEffect<
applicationModel.IRecyclableApplication | null, Array<applicationModel.IRecyclableApplication>, 
AxiosError>({
  handler: async (application) => {
    if (application) {
      const { data } = await applicationApi.getApplications({
        deal_type: application.dealType.id,

        application_recyclable_status: application.applicationRecyclableStatus.id,

        urgency_type: application.urgencyType.id,
        recyclables: [application.recyclables.id],
        recyclables__category: application.recyclables.category.id,
        city: application.city,
        exclude: application.id
      });
      return data.results;
    }
    return [];
  }
});

const $applicationRecs = createStore<Array<applicationModel.IRecyclableApplication>>([])
  .on(getRecsFx.doneData, (_, data) => data);

sample({
  source: applicationModel.$application,
  filter: (source) => source !== null,
  target: getRecsFx
});

export {
  $applicationRecs
};
