import { createGate } from 'effector-react';
import { sample } from 'effector';
import { companiesStatsModel, dealsStatsModel, exchangeVolumeModel, recyclablesVolumeStatsModel } from '@box/entities/statistics';

const gate = createGate();

  const getExchangeVolumeFx = exchangeVolumeModel.getExchangeVolumeFx
  const getDealsStatsFx     = dealsStatsModel.getDealsStatsFx
  const getRecyclablesVolumeStatsFx = recyclablesVolumeStatsModel.getRecyclablesVolumeStatsFx
  const getCompaniesStatsFx = companiesStatsModel.getCompaniesStatsFx
  
  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getCompaniesStatsFx
  });
  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getDealsStatsFx
  });
  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getRecyclablesVolumeStatsFx
  });
  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getExchangeVolumeFx
  });
  
  export {
    getCompaniesStatsFx,
    getDealsStatsFx,
    getRecyclablesVolumeStatsFx,
    getExchangeVolumeFx,
    gate
  };