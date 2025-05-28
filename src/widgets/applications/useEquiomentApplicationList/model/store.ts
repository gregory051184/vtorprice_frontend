import { attach, merge, sample } from 'effector';
import { $authStore } from '@box/entities/auth';
import { applicationModel } from '@box/entities/application';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import {
  usersEquipmentApplicationsTableFilters,
  applyUsersEquipmentApplicationTableFilters
} from '@box/features/application/filters/usersEquipmentApplication';
import {createGate} from "effector-react";

const gate = createGate();
const ordering = createOrdering();
const pagination = createPagination(applicationModel.getEquipmentApplicationsFx, merge([
  gate.close,
  usersEquipmentApplicationsTableFilters.$values
]))

const getEquipmentApplications = attach({
  source: {
    filters: usersEquipmentApplicationsTableFilters.$values,
    companyId: $authStore.map((val) => val.user?.company?.id),
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage
  },
  mapParams: (_, {
    filters, companyId, page, size, ordering
  }) => ({
    page,
    size,
    ordering,
    search: filters.search,
    deal_type: filters.deal_type?.value,
    company: companyId,
    city: filters.city?.value.id,
    ...(filters.equipment && { equipment: filters.equipment.value }),
    ...(filters.count && { total_weight__gte: +filters.count }),
    ...(filters.price__lte && { price__lte: +filters.price__lte }),
    ...(filters.price__gte && { price__gte: +filters.price__gte }),
    ...(filters.status?.value && { status: +filters.status.value }),
    ...(filters.created_at.every((el) => el !== null)
      && { created_at__gte: filters.created_at[0] || undefined }
    ),
    ...(filters.created_at.every((el) => el !== null)
      && { created_at__lte: filters.created_at[1] || undefined }
    )
  }),
  effect: applicationModel.getEquipmentApplicationsFx
})

const searchEquipmentApplicationsValue = usersEquipmentApplicationsTableFilters.fields.search.$value;
const resetEquipmentApplicationsForm = usersEquipmentApplicationsTableFilters.reset;

sample({
  clock: [
    gate.open,
    pagination.loadMore,
    pagination.setPerPage,
    searchEquipmentApplicationsValue,
    applyUsersEquipmentApplicationTableFilters,
    resetEquipmentApplicationsForm,
    ordering.setOrdering
  ],
  target: getEquipmentApplications
})

export {
  ordering,
  pagination,
  gate
};
