import {AxiosResponse} from 'axios';
import {$authHost, $host} from '@box/shared/api';
import {Paginationable} from '@types';
import {IRecyclableApplication, IRecyclableApplicationShortForAll} from '../model';

type CreateApplicationParams = {
    images?: Array<File | string>,
    deal_type: IRecyclableApplication['dealType']['id'],
    urgency_type: IRecyclableApplication['urgencyType']['id'],
    application_recyclable_status?: IRecyclableApplication['applicationRecyclableStatus']['id'],
    with_nds?: boolean,
    bale_count?: number,
    bale_weight?: number,
    volume?: number,
    price?: number,
    lot_size?: number,
    is_packing_deduction?: boolean,
    packing_deduction_type?: IRecyclableApplication['packingDeductionType']['id'],
    packing_deduction_value?: number,
    comment?: string,
    address?: string,
    latitude?: number,
    longitude?: number,
    recyclables?: number,
    company?: number,
    city?: number,
    status?: number
};

type GetApplicationsParams = {
    no_page?: boolean,
    exclude: number,
    search: string,
    deal_type: IRecyclableApplication['dealType']['id'],
    //СДЕЛАЛ urgency_type необязательным
    urgency_type?: IRecyclableApplication['urgencyType']['id'],
    application_recyclable_status?: IRecyclableApplication['applicationRecyclableStatus']['id'],
    recyclables: Array<number>,
    recyclables__category: number,
    city: number,
    company: number,
    total_weight__lte: number | string,
    total_weight__gte: number | string,
    price__lte: number | string,
    price__gte: number | string,
    status: number,
    created_at__gte: Date | null,
    created_at__lte: Date | null,
    is_favorite: boolean,
    ordering: string | null,
    page: number,
    //ДОБАВИЛ
    period?: string,
    with_nds?: string,
    bale_weight__lte?: number | string,
    bale_weight__gte?: number | string,
    weediness__gte?: number | string,
    weediness__lte?: number | string,
    moisture__gte?: number | string,
    moisture__lte?: number | string,
    companies_trust?: number | string,
    activity_types__rec_col_types?: string,
    company_activity_type?: number,
    company_deals_number?: number | string,
    company_volume?: number | string,
    company_failed_deals?: number | string,
    company_has_applications?: number | string,
    company_has_supply_contract?: number | string,
    owner_has_companies?: number | string,
    is_jur_or_ip?: number | string,
    company_rating?: number | string,

    city__region__district?: number,
    city__region?: number,
};

type GetApplicationsForPurchaseAndSalesParams = {
    deal_type: IRecyclableApplication['dealType']['id'],
    urgency_type?: IRecyclableApplication['urgencyType']['id'],
    recyclables: Array<number>,
    city?: number,
    total_weight__lte?: number | string,
    total_weight__gte?: number | string,
    price__lte?: number | string,
    price__gte?: number | string,
    status: number,
    created_at__gte?: Date | null,
    created_at__lte?: Date | null,
};

export type GetAllApplicationsWithoutPagesParams = {
    page?: number,
    period: string,
    category?: string,
    sub_category?: string,
    deal_type?: number,
    application_recyclable_status?: number,
    company_activity_types?: number
}


class ApplicationApi {
    createApplication(applicationData: CreateApplicationParams):
        Promise<AxiosResponse<IRecyclableApplication>> {
        const formData = new FormData();
        if (Array.isArray(applicationData.images)) {
            for (let i = 0; i < applicationData.images?.length; i += 1) {
                formData.append('images', applicationData.images[i]);
            }
        }
        delete applicationData.images;

        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (const key in applicationData) {
            // @ts-ignore
            formData.append(key, applicationData[key]);
        }

        return $authHost.post('/recyclables_applications/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getApplications(params: Partial<GetApplicationsParams>): Promise<AxiosResponse<{
        results: Array<IRecyclableApplication>
    } & Paginationable>> {
        return $authHost.get('/recyclables_applications/', {
            params,
        });
    }

    getApplicationForPurchaseAndSales(params: GetApplicationsForPurchaseAndSalesParams): Promise<AxiosResponse<Array<IRecyclableApplication>>> {
        return $authHost.get('/recyclables_applications/', {
            params,
        });
    }


    getAllApplications(params: GetAllApplicationsWithoutPagesParams): Promise<AxiosResponse> {
        return $authHost.get('/all_recyclables_applications/', {params});
    }

    getAllApplicationsWithPagination(params: Partial<GetAllApplicationsWithoutPagesParams>): Promise<AxiosResponse<{
        results: Array<IRecyclableApplication>
    } & Paginationable>> {
        return $authHost.get('/recyclables_applications/', {params});
    }

    //ДОБАВИЛ ДЛЯ ПОЛУЧЕНИЯ ВСЕХ СВОИХ ЗАЯВОК В СВОЁМ ПРОФИЛЕ ДАЖЕ УДАЛЁННЫХ
    getApplicationsForMyProfile(params: Partial<GetApplicationsParams>): Promise<AxiosResponse<{
        results: Array<IRecyclableApplication>
    } & Paginationable>> {
        return $authHost.get('/recyclables_applications/profile_applications/', {
            params,
        });
    }

    getAllCompanyApplications(params: Partial<GetApplicationsParams>): Promise<AxiosResponse<{
        results: Array<IRecyclableApplication>
    } & Paginationable>> {
        return $host.get(`/recyclables_applications/company_apps/`, {
            params,
        });
    }

    getApplication(id: number): Promise<AxiosResponse<IRecyclableApplication>> {
        return $host.get(`/recyclables_applications/${id}/`);
    }

    updateApplicationInFavorite(id: number): Promise<AxiosResponse<IRecyclableApplication>> {
        return $authHost.patch(`/recyclables_applications/${id}/favorite/`);
    }

    // eslint-disable-next-line max-len
    setApplication(data: Partial<CreateApplicationParams> & {
        id: number
    }): Promise<AxiosResponse<IRecyclableApplication>> {
        const {id, ...params} = data;
        return $authHost.patch(`/recyclables_applications/${id}/`, params);
    }

    deleteApplication(id: number): Promise<AxiosResponse<IRecyclableApplication>> {
        return $authHost.delete(`/recyclables_applications/${id}/`);
    }

    setApplicationImage(
        images: Array<File | null | string>,
        id: number
    ): Promise<AxiosResponse<{ image: string }>> {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image != null) {
                formData.append('image', image);
            }
        }
        return $authHost.post(`/recyclables_applications/${id}/add_images/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

export const applicationApi = new ApplicationApi();
