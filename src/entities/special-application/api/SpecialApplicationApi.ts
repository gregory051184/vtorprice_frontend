import {AxiosResponse} from "axios";
import {$authHost} from "@box/shared/api";
import {IConfirmationUrl} from "@box/entities/subscribe";
import {ISpecialApplication} from "@box/entities/special-application/model/types";


type CreateSpecialApplicationParams = {
    //images?: Array<File | string>,
    with_nds?: boolean,
    price?: number,
    period: number,
    //comment?: string,
    address?: string,
    latitude?: number,
    longitude?: number,
    company?: number,
    description?: string,
    city?: number,
    is_deleted?: boolean,
};

type SpecialApplicationGetParams = {
    id: number
    name: string;
    price: number;
    description: string;
    period?: string;
    createdAt?: string;
    isDeleted?: boolean;

}

class SpecialApplicationApi {

    createSpecialApplication(createSpecialApplicationParams: CreateSpecialApplicationParams):
        Promise<AxiosResponse<IConfirmationUrl>> {
        return $authHost.post('/special_applications/', createSpecialApplicationParams);
    }

    setSpecialApplicationImage(
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
        return $authHost.post(`/special_applications/${id}/add_images/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getSpecialApplication(id: number):
        Promise<AxiosResponse<ISpecialApplication>> {
        return $authHost.get(`/companies_special_applications/${id}/`);
    };

    getSpecialApplications(params: Partial<SpecialApplicationGetParams>):
        Promise<AxiosResponse<Array<ISpecialApplication>>> {
        return $authHost.get(`/companies_special_applications/`, {params});
    };

    updateSpecialApplication(
        data: Partial<CreateSpecialApplicationParams> & { id: number }
    ): Promise<AxiosResponse<ISpecialApplication>> {
        const {id, ...params} = data;
        return $authHost.patch(`/special_applications/${id}/`, params);
    };

    deleteSpecialApplication(id: number): Promise<AxiosResponse<ISpecialApplication>> {
        return $authHost.delete(`/special_applications/${id}/`);
    }
}

export const specialApplicationApi = new SpecialApplicationApi();