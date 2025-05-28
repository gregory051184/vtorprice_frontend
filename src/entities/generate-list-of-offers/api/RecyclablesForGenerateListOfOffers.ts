import {AxiosResponse} from 'axios/index';
import {Paginationable} from "@types";
import {$host} from "@box/shared/api";
import {IGenerateListOfOffers} from "@box/entities/generate-list-of-offers/model";
import {ICompany} from "@box/entities/company/model";
import {IRecyclableApplication} from "@box/entities/application/model";

type GetRecyclablesForGenerateParams = {
    id?: string,
    category: string,
    page: number,
    period: string,
    ordering?: string
};


type GetApplicationsForOfferParams = {
    company_id: number,
    recyclable_id: number,
    page: number,
    period: string
}

class RecyclablesForOffersApi {
    getCompaniesVerifications(params: Partial<GetRecyclablesForGenerateParams>):
        Promise<AxiosResponse<{
            results: Array<IGenerateListOfOffers>
        } & Paginationable>> {
        return $host.get('/recyclables/generate_offers/', {
            params
        });
    }

    getDealsForOffer(params: Partial<GetRecyclablesForGenerateParams>): Promise<AxiosResponse<{
        results: Array<ICompany>
    } & Paginationable>> {
        return $host.get(`/recyclables_deals/${params.id}/companies_offers?ordering=${params?.ordering}`, {
            //@ts-ignore
            category: params.category,
            page: params.page,
            period: params.period,
        });
    }

    getApplicationsForOffer(params: Partial<GetApplicationsForOfferParams>): Promise<AxiosResponse<{
        results: Array<IRecyclableApplication>
    } & Paginationable>> {
        return $host.get(`/recyclables_applications/offer/`, {
            params
        });
    }

}

export const recyclablesForOffersApi = new RecyclablesForOffersApi();