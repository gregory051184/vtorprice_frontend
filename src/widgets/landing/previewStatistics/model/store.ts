import { createGate } from 'effector-react';
import {
  sample, attach
} from 'effector';
import { applicationsStatsModel } from '@box/entities/statistics';

const gate = createGate();

const getPreviewStatisticsFx = attach({
  mapParams: () => {

    return {
      period: 'month'
    };
  },
  effect: applicationsStatsModel.getApplicationsStatsFx,
});

  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getPreviewStatisticsFx
  });
  
  export {
    getPreviewStatisticsFx,
    gate
  };