import { createGate } from 'effector-react';
import { sample } from 'effector';
import { companiesStatsModel } from '@box/entities/statistics';

const gate = createGate();

  const getCompaniesStatsFx = companiesStatsModel.getCompaniesStatsFx

  sample({
    // @ts-ignore
    // eslint-disable-next-line
    clock: gate.open,
    target: getCompaniesStatsFx
  });
  
  export {
    getCompaniesStatsFx,
    gate
  };