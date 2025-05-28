import { applicationModel } from '@box/entities/application';
import { applicationsVerificationsListFiltersModel } from '@box/features/application';
import { createList } from '@box/shared/lib/factories';


const { pagination, gate, ordering } = createList({
  effect: applicationModel.getApplicationsFx,
  filters: applicationsVerificationsListFiltersModel.filters.$values,
  mapFilters: (filters) => ({
    city: filters.city?.value.id,
    deal_type: filters.deal_type?.value,
    application_recyclable_status: filters.application_recyclable_status?.value,
    recyclables: filters.recyclables?.value.id,
    ...(filters.total_weight__gte && { total_weight__gte: ((+filters.total_weight__gte) * 1000) }),
    ...(filters.total_weight__lte && { total_weight__lte: ((+filters.total_weight__lte) * 1000) }),
    search: filters.search,
    ...(filters.price__lte && { price__lte: +filters.price__lte }),
    ...(filters.price__gte && { price__gte: +filters.price__gte }),
    ...(filters.status && { status: +filters.status.value }),
    ...(filters.createdAt.every((el) => el !== null)
        && { created_at__gte: filters.createdAt[0] || undefined }
    ),
    ...(filters.createdAt.every((el) => el !== null)
        && { created_at__lte: filters.createdAt[1] || undefined }
    ),
  })
});

export {
  gate,
  pagination,
  ordering
};
