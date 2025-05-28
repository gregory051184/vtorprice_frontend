import {createEffect, createStore} from "effector";
import {companyApi} from "@box/entities/company";
import {ICompany} from "@box/entities/company/model/types";
import {AxiosError} from "axios";
import {createLoaderStore} from "@box/shared/lib/helpers";


const getCompaniesForMainFiltersPageFx = createEffect<
    Parameters<typeof companyApi.getCompanies>[0]
    , {
    data: Awaited<ReturnType<typeof companyApi.getCompaniesForMainFiltersPage>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const {data} = await companyApi.getCompaniesForMainFiltersPage(params);
        // if (params?.rate) {
        //     //@ts-ignore
        //     const results = data.results.filter(item => item?.averageReviewRate >= +params?.rate)
        //     data.results = results
        // }
        // if (params?.deals_count) {
        //     //@ts-ignore
        //     const results = data.results.filter(item => item?.dealsCount >= +params?.deals_count)
        //     data.results = results
        // }
        // if (params.company_failed_deals) {
        //     if (params.company_failed_deals === 1) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasFailedDeals === false)
        //         data.results = results
        //     }
        //     if (params.company_failed_deals === 2) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasFailedDeals === true)
        //         data.results = results
        //     }
        // }
        // if (params.company_has_applications) {
        //     if (params.company_has_applications === 1) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasReadyForShipment === false)
        //         data.results = results
        //     }
        //     if (params.company_has_applications === 2) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasReadyForShipment === true)
        //         data.results = results
        //     }
        // }
        // if (params.company_has_supply_contract) {
        //     if (params.company_has_supply_contract === 1) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasSupplyContracts === false)
        //         data.results = results
        //     }
        //     if (params.company_has_supply_contract === 2) {
        //         //@ts-ignore
        //         const results = data.results.filter(item => item?.hasSupplyContracts === true)
        //         data.results = results
        //     }
        // }
        // if (params.recyclables__recyclables) {
        //     //@ts-ignore
        //     const results = data.results.filter(item => item?.companyRecyclables?.includes(+params.recyclables__recyclables))
        //     data.results = results
        // }
        // if (params.company_volume) {
        //     //@ts-ignore
        //     const results = data.results.filter(item => item?.companyVolume >= +params?.company_volume)
        //     data.results = results
        // }
        return {
            data,
            page: params.page
        };
    }
});

const companiesForMainFilterLoading = createLoaderStore(false, getCompaniesForMainFiltersPageFx);

const $companiesWithMainFilters = createStore<Array<ICompany>>([])
    .on(getCompaniesForMainFiltersPageFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                ...data.data.results,
            ];
        }
        return data.data.results;
    })


export {
    $companiesWithMainFilters,
    getCompaniesForMainFiltersPageFx,
    companiesForMainFilterLoading
}