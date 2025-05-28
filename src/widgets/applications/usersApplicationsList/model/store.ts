import { attach, merge, sample } from 'effector';
import { $authStore } from '@box/entities/auth';
import {
  usersApplicationTableFilters, applyUsersApplicationTableFilters
} from '@box/features/application';
import {applicationModel} from '@box/entities/application';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { $userApplicationlistType } from '@box/pages/profile/applications/list/model';
import {createGate} from "effector-react";

const gate = createGate();
const ordering = createOrdering();
const pagination = createPagination(applicationModel.getApplicationsFx, merge([
  gate.close,
  usersApplicationTableFilters.$values
]));

const getApplications = attach({
  source: {
    filters: usersApplicationTableFilters.$values,
    companyId: $authStore.map((val) => val.user?.company?.id),
    urgency_type: $userApplicationlistType.map((val) => val.value),
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage
  },
  mapParams: (_, {
    filters, companyId, urgency_type, page, ordering, size
  }) => ({
    page,
    size,
    ordering,
    urgency_type,
    company: companyId,
    application_recyclable_status: filters.application_recyclable_status?.value,
    city: filters.city?.value.id,
    deal_type: filters.deal_type?.value,
    recyclables: filters.recyclables?.value.id,
    search: filters.search,
    ...(filters.total_weight__gte && { total_weight__gte: (+filters.total_weight__gte) * 1000 }),
    ...(filters.price__lte && { price__lte: ((+filters.price__lte) / 1000) }),
    ...(filters.price__gte && { price__gte: ((+filters.price__gte) / 1000) }),
    ...(filters.status?.value && { status: +filters.status.value }),
    ...(filters.created_at.every((el) => el !== null)
      && { created_at__gte: filters.created_at[0] || undefined }
    ),
    ...(filters.created_at.every((el) => el !== null)
      && { created_at__lte: filters.created_at[1] || undefined }
    )
  }),
  effect: applicationModel.getApplicationsFx
})

const searchApplicationsValue = usersApplicationTableFilters.fields.search.$value;
const resetApplicationsForm = usersApplicationTableFilters.reset;

sample({
  clock: [
    gate.open,
    pagination.loadMore,
    pagination.setPerPage,
    searchApplicationsValue,
    applyUsersApplicationTableFilters,
    resetApplicationsForm,
    ordering.setOrdering,
    $userApplicationlistType
  ],
  target: getApplications
})

export {
  ordering,
  pagination,
  gate
};
