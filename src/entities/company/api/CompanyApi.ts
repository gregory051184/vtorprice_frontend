import {
    IActivityType,
    IActivityTypeAdvantage,
    ICompany,
    ICompanyRecyclable,
    IRecColType
} from '@box/entities/company/model/types';
import {$authHost, $host} from '@box/shared/api';
import {AxiosResponse} from 'axios';
import {Paginationable} from '@types';


type GetCompanyTypeAdvantagesParams = number;
type CreateCompanyParams = ICompany;
type CreateUsersCompanyActivityTypesParams = {
    advantages?: Array<number>,
    recColTypes?: Array<number>,
    activity: number,
    company: number
};
type GetCompaniesParams = {
    page?: number,
    ordering?: string | null,
    activity_types?: string,
    activity_types__rec_col_types?: string,
    //recyclables__recyclables?: string,
    recyclables_applications__recyclables?: string,
    status?: number,
    is_favorite?: boolean,
    city?: number,
    search?: string,
    activity_types__advantages?: Array<number>,
    global_search?: boolean,
    manager?: number,
    created_at__gte?: Date,
    created_at__lte?: Date,

    city__region?: number,
    city__region__district?: number,
    with_nds?: string,
    rate?: string,
    deals_count?: string,
    company_volume?: string,
    company_has_supply_contract?: number,
    is_jur_or_ip?: number,
    company_failed_deals?: number,
    company_has_applications?: number,

    recyclables_applications__urgency_type?: number,
    exist_company_recyclables?: number

};

type GetCompaniesRecColTypesParams = {
    activity?: number,
    search?: string,
};

type GetCompanyParams = number;

type GetCompanyGroupedRecyclingCollectionTypesParams = {
    search?: string
};

type GetCompanyRecyclablesParams = {
    search?: string,
    statusId?: string
};

type SetCompanyOwnerParams = number | string;

type UpdateCompanyParams = {
    id: number,
    name?: string,
    inn?: string,
    image?: File | string | null,
    address?: string,
    description?: string,
    withNds?: boolean,
    payment_account?: string | null
    staff?: Array<number>,
    suspend_staff?: Array<number>,
    manager?: string,
    email?: string,
};

type UpdateCompanyStaffParams = {
    id: number,
    staff?: Array<number>,
    suspend_staff?: Array<number>,
};

type UpdateCompanyStatusParams = {
    id: number,
    status: string,
};

type GetCategoriesParams = {
    size: number
}


class CompanyApi {
    createCompany(companyData: CreateCompanyParams): Promise<AxiosResponse<ICompany>> {
        return $authHost.post('/companies/', companyData);
    }

    createUsersCompanyActivityTypes(data: CreateUsersCompanyActivityTypesParams): Promise<
        AxiosResponse<IActivityType
        >> {
        return $authHost.post('/company_activity_types/', data);
    }

    getCompany(id: GetCompanyParams): Promise<AxiosResponse<ICompany>> {
        return $host.get(`/companies/${id}/`);
    }

    getCompanies(data: GetCompaniesParams): Promise<AxiosResponse<{
        results: Array<ICompany>
    } & Paginationable>> {
        return $authHost.get('/companies/', {
            params: data
        });
    }

    getCompaniesForMainFiltersPage(data: GetCompaniesParams): Promise<AxiosResponse<{
        results: Array<ICompany>
    } & Paginationable>> {
        return $authHost.get('/companies/companies_with_applications_for_main_filter/', {
            params: data
        });
    }

    getCompaniesRecColTypes(data: GetCompaniesRecColTypesParams): Promise<AxiosResponse<{
        results: Array<IRecColType>
    }>> {
        return $host.get('/recycling_collection_types/', {
            params: data
        });
    }

    // eslint-disable-next-line max-len
    getCompanyGroupedRecyclingCollectionTypes(data: GetCompanyGroupedRecyclingCollectionTypesParams): Promise<AxiosResponse<Array<{
        id: number,
        label: string,
        recColTypes: IActivityType['recColTypes']
    }>
    >> {
        return $host.get('/recycling_collection_types/activity_grouped_list/', {
            params: {
                search: data.search
            }
        });
    }

    getCompanyRecyclables(data: GetCompanyRecyclablesParams): Promise<AxiosResponse<Array<ICompanyRecyclable['recyclables']>
    >> {
        return $host.get('/recyclables/', {
            params: {
                search: data.search
            }
        });
    }

    getActivityTypeAdvantages(activity: GetCompanyTypeAdvantagesParams): Promise<AxiosResponse<{
        results: Array<IActivityTypeAdvantage>
    }>> {
        return $host.get('/company_advantages/', {
            params: {
                activity
            }
        });
    }

    setCompanyOwner(id: SetCompanyOwnerParams): Promise<AxiosResponse<void>> {
        return $authHost.post(`/companies/${id}/set_owner/`);
    }

    updataCompanyInFavorite(data: {
        id: number
    }): Promise<AxiosResponse<ICompany>> {
        return $authHost.patch(`/companies/${data.id}/favorite/`);
    }

    setCompany(data: UpdateCompanyParams): Promise<AxiosResponse<ICompany>> {
        const {id, image, ...params} = data;
        return $authHost.put(`/companies/${id}/`, {
            ...params,
            ...(image instanceof File && {image})
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    patchCompany(data: UpdateCompanyStaffParams): Promise<AxiosResponse<ICompany>> {
        const {id, ...params} = data;

        return $authHost.patch(`/companies/${id}/`, {
            ...params
        });
    }

    patchCompanyStatus(data: UpdateCompanyStatusParams): Promise<AxiosResponse<ICompany>> {
        const {id, ...params} = data;
        return $authHost.patch(`/companies/${id}/`, {
            ...params
        });
    }

    getRecyclablesCategories(params: GetCategoriesParams): Promise<AxiosResponse<{
        results: Array<{
            id: number,
            name: string,
            subcategories: Array<{
                id: number,
                name: string,
                subcategories: any
            }>
        }>
    }>> {
        return $host.get('/recyclables_categories/', {params});
    }

    getEquipmentCategories(params: GetCategoriesParams): Promise<AxiosResponse<{
        results: Array<{
            id: number,
            name: string,
            subcategories: Array<{
                id: number,
                name: string,
                subcategories: any
            }>
        }>
    }>> {
        return $host.get('/equipment_categories/', {params});
    }

}

export const companyApi = new CompanyApi();
