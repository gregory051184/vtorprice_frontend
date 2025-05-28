import { createGate } from 'effector-react';
import {
  sample, attach, merge
} from 'effector';
import { createPagination } from '@box/shared/lib/factories';
import { employeesQuantityModel } from '@box/entities/statistics';

const gate = createGate();

const pagination = createPagination(
  employeesQuantityModel.getEmployeesQuantityFx,
    merge(
      [gate.close]
    )
);

const getEmployeesQuantityFx = attach({
  source: {
    page: pagination.$currentPage,
  },
  mapParams: (_, { page }) => {

    return {
      page,
    };
  },
  effect: employeesQuantityModel.getEmployeesQuantityFx,
});

  sample({
    clock: [
      gate.open,
      pagination.loadMore
    ],
    target: getEmployeesQuantityFx
  });
  
  export {
    getEmployeesQuantityFx,
    gate,
    pagination
  };