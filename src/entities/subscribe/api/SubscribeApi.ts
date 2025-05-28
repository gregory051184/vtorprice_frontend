import {AxiosResponse} from "axios";
import {$authHost} from "@box/shared/api";
import {Paginationable} from "@types";
import {ISubscribe, ISubscribeCategory} from "@box/entities/subscribe";


type BuySubscribeCreateParams = {
    company: number;
    level: number;
};

type SubscribeGetParams = {
    id: number
    name: string;
    price: number;
    description: string;
    level: string;
    createdAt?: string;
    isDeleted?: boolean;

}

type SubscribeEnd = {
    id: number;
    isDeleted: boolean;

}

export interface IConfirmationUrl {
    confirmationUrl: string;
    id?: number;
}

class SubscribeApi {

    buySubscribe(buySubscribeCreateParams: BuySubscribeCreateParams):
        Promise<AxiosResponse<IConfirmationUrl>> {
        return $authHost.post('/company_subscribes/create_payment/', buySubscribeCreateParams, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    getSubscribeCategories(params: Partial<SubscribeGetParams>):
        Promise<AxiosResponse<
            Array<ISubscribeCategory>
            & Paginationable>> {
        return $authHost.get('/company_subscribes_categories/', {
            params
        });
    };

    getSubscribe(id: number):
        Promise<AxiosResponse<ISubscribe>> {
        return $authHost.get(`/company_subscribes/${id}`);
    };

    getSubscribes(params: Partial<SubscribeGetParams>):
        Promise<AxiosResponse<Array<ISubscribe>>> {
        return $authHost.get(`/company_subscribes/`, {params});
    };

    updateSubscribe(data: Partial<SubscribeEnd> & {
        id: number
    }): Promise<AxiosResponse<ISubscribe>> {
        const {id, ...params} = data;
        return $authHost.patch(`/company_subscribes/${id}/`, params);
    }

    /*deleteProposal(id: number): Promise<AxiosResponse<IProposal>> {
        return $authHost.delete(`/company_proposals/${id}/`);
    }*/

}

export const subscribeApi = new SubscribeApi();