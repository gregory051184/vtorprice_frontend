import {applicationModel} from '@box/entities/application';
import {$authStore} from '@box/entities/auth';
import {
    applicationManagementTableFilters,
    applyApplicationManagementTableFilters,
    applyEquipmentApplicationManagementTableFilters,
    equipmentApplicationsManagementTableFilters
} from "@box/features/applications-management/filters/applicationsModerationsFilter/model/store";
import {$userApplicationlistTypeManagement} from "@box/pages/profile/applications-managment/list/model/store";
import {createOrdering, createPagination} from "@box/shared/lib/factories";
import {ROLE} from '@box/types';
import {attach, createEvent, forward, merge, sample} from "effector";
import {createGate} from "effector-react";


function isMyFunc() {
    const authStore = $authStore.getState();
    if (authStore?.user?.role.id as ROLE === ROLE.MANAGER) {
        return true
    }
    return undefined
}

const gate = createGate();
const ordering = createOrdering();
const pagination = createPagination(applicationModel.getApplicationsFx, merge([
    gate.close,
    applicationManagementTableFilters.$values
]));

const getApplications = attach({
    source: {
        filters: applicationManagementTableFilters.$values,
        urgency_type: $userApplicationlistTypeManagement.map((val) => val.value),
        page: pagination.$currentPage,
        ordering: ordering.$ordering,
        size: pagination.$perPage
    },
    mapParams: (_, {
        filters, urgency_type, page, ordering, size
    }) => ({
        page,
        size,
        ordering,
        urgency_type,
        is_my: isMyFunc(),
        company: filters.company?.value.id,
        city: filters.city?.value.id,
        deal_type: filters.deal_type?.value,
        recyclables: filters.recyclables?.value.id,
        search: filters.search,
        ...(filters.total_weight__gte && {total_weight__gte: (+filters.total_weight__gte) * 1000}),
        ...(filters.price__lte && {price__lte: (+filters.price__lte) / 1000}),
        ...(filters.price__gte && {price__gte: (+filters.price__gte) / 1000}),
        ...(filters.status?.value && {status: +filters.status.value}),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__gte: filters.created_at[0] || undefined}
        ),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__lte: filters.created_at[1] || undefined}
        ),
        ...(filters.is_deleted?.value && {is_deleted: filters.is_deleted.value === 2}),
    }),
    effect: applicationModel.getApplicationsFx
})

const searchApplicationsValue = applicationManagementTableFilters.fields.search.$value;
const companyApplicationsValue = applicationManagementTableFilters.fields.company.$value;
const resetApplicationsForm = applicationManagementTableFilters.reset;

sample({
    clock: ordering.setOrdering,
    target: applicationModel.resetApplicationsListEvent,
});

const runGetApplicationsAfterStoreResetEvent = createEvent();

forward({
    from: applicationModel.resetApplicationsListEvent,
    to: runGetApplicationsAfterStoreResetEvent,
});

sample({
    clock: [
        gate.open,
        runGetApplicationsAfterStoreResetEvent,
        pagination.loadMore,
        pagination.setPerPage,
        companyApplicationsValue,
        searchApplicationsValue,
        applicationManagementTableFilters.$values,
        //applyApplicationManagementTableFilters,
        resetApplicationsForm,
        $userApplicationlistTypeManagement
    ],
    source: applicationManagementTableFilters.$values,
    target: getApplications
})

export {
    ordering,
    pagination,
    gate
};


const gateEquipment = createGate();
const orderingEquipment = createOrdering();
const paginationEquipment = createPagination(applicationModel.getEquipmentApplicationsFx,
    merge([
        gateEquipment.close,
        equipmentApplicationsManagementTableFilters.$values
    ])
)

const getEquipmentApplications = attach({
    source: {
        filters: equipmentApplicationsManagementTableFilters.$values,
        page: paginationEquipment.$currentPage,
        ordering: orderingEquipment.$ordering,
        size: paginationEquipment.$perPage
    },
    mapParams: (_, {
        filters, page, size, ordering
    }) => ({
        page,
        size,
        ordering,
        is_my: isMyFunc(),
        search: filters.search,
        deal_type: filters.deal_type?.value,
        company: filters.company?.value.id,
        city: filters.city?.value.id,
        ...(filters.equipment && {equipment: filters.equipment.value}),
        ...(filters.count && {total_weight__gte: +filters.count}),
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status?.value && {status: +filters.status.value}),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__gte: filters.created_at[0] || undefined}
        ),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__lte: filters.created_at[1] || undefined}
        ),
        ...(filters.is_deleted?.value && {is_deleted: filters.is_deleted.value === 2}),
    }),
    effect: applicationModel.getEquipmentApplicationsFx
})

const searchEquipmentApplicationsValue = equipmentApplicationsManagementTableFilters.fields.search.$value;
const companyEquipmentApplicationsValue = equipmentApplicationsManagementTableFilters.fields.company.$value;
const resetEquipmentApplicationsForm = equipmentApplicationsManagementTableFilters.reset;

sample({
    clock: orderingEquipment.setOrdering,
    target: applicationModel.resetEquipmentApplicationsListEvent,
});

const runGetEquipmentApplicationsAfterStoreResetEvent = createEvent();

forward({
    from: applicationModel.resetEquipmentApplicationsListEvent,
    to: runGetEquipmentApplicationsAfterStoreResetEvent,
});

sample({
    clock: [
        gateEquipment.open,
        runGetEquipmentApplicationsAfterStoreResetEvent,
        paginationEquipment.loadMore,
        paginationEquipment.setPerPage,
        companyEquipmentApplicationsValue,
        searchEquipmentApplicationsValue,
        equipmentApplicationsManagementTableFilters.$values,
        //applyEquipmentApplicationManagementTableFilters,
        resetEquipmentApplicationsForm,
    ],
    source: equipmentApplicationsManagementTableFilters.$values,
    target: getEquipmentApplications
})

export {
    orderingEquipment,
    paginationEquipment,
    gateEquipment
};