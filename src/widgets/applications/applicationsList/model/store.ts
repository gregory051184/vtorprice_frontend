import { landingApplicationsListFiltersModel } from '@box/features/application';
import { applicationModel } from '@box/entities/application';
import { createList } from '@box/shared/lib/factories';

const {
  pagination, gate
} = createList({
  effect: applicationModel.getApplicationsFx,
  filters: landingApplicationsListFiltersModel
    .filters.$values.map(({ show_table, ...others }) => others),
  mapFilters: (filters) => ({
    status: 2,
    deal_type: filters.deal_type?.value,
    city: filters.city?.value.id,
    total_weight__gte: filters.total_weight?.value[0] ? (filters.total_weight.value[0] * 1000) : undefined,
    total_weight__lte: filters.total_weight?.value[1] ? (filters.total_weight.value[1] * 1000) : undefined,
    urgency_type: filters.urgency_type?.value,
    application_recyclable_status: filters.application_recyclable_status?.value,
    recyclables__category: filters.recyclables__category?.value.id,
    recyclables: filters.recyclables.map((el) => el.id as number)
  }),
  fetchFilter: landingApplicationsListFiltersModel.filters.$values.map((val) => val.show_table),
});

export {
  gate,
  pagination
};
