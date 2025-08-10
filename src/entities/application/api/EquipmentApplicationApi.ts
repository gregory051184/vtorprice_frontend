import {AxiosResponse} from 'axios';
import {$authHost, $host} from '@box/shared/api';
import {Paginationable} from '@types';
import {ISelectValue} from '@box/shared/ui';
import {companyModel} from '@box/entities/company';
import {IEquipmentApplication, IEquipmentCategory} from '../model';
import {ICompany} from "@box/entities/company/model";


type CreateEquipmentApplicationParams = {
    deal_type: number,
    count: number,
    was_in_use: boolean,
    sale_by_parts: boolean,

    //ДОБАВИЛ
    equipment: string,
    //ИЗМЕНИЛ
    equipment_category: number,
    //ДОБАВИЛ
    equipmentCategory?: number,

    address?: string,
    latitude?: number,
    longitude?: number,
    status?: 1 | 2 | 3 | 4,
    with_nds?: boolean,
    price?: number,
    manufacture_date?: string,
    video_url?: string,
    comment?: string,
    city?: string,
    company?: ISelectValue<companyModel.ICompany>,
};

export type GetEquipmentsApplicationsParams = {
    search: string,
    ordering: string | null,
    deal_type: number,
    is_deleted: boolean,
    //ДОБАВИЛ
    category?: number,

    equipment: string | number,

    equipment__category: number,
    city: number,
    company: number,
    created_at__gte: string,
    created_at__lte?: string,
    price__lte: number,
    price__gte: number,
    count__lte: number,
    count__gte: number,
    status: number,
    page: number,
    size: number,
    excluede: number,
    //ДОБАВИЛ
    was_in_use?: number,
    sale_by_part?: number,
    manufacture_date__gte: string,
    manufacture_date__lte?: string,

    city__region__district?: number,
    city__region?: number,
};

type UpdateEquipmentApplicationStatusParams = {
    id: number,
    status: string,
};

class EquipmentApplicationApi {
    getEquipmentApplications(
        params: Partial<GetEquipmentsApplicationsParams>
    ): Promise<AxiosResponse<{
        results: Array<IEquipmentApplication>
    } & Paginationable>> {
        //ДОБАВИЛ
        return $authHost.get('/equipment_applications/', {
            params,
        });
    }

    getEquipmentApplicationsForMyProfile(
        params: Partial<GetEquipmentsApplicationsParams>
    ): Promise<AxiosResponse<{
        results: Array<IEquipmentApplication>
    } & Paginationable>> {
        return $authHost.get(`/equipment_applications/profile_applications/`, {
            params,
        });
    }

    getEquipmentCategory(): Promise<AxiosResponse<{
        results: Array<IEquipmentCategory>
    } & Paginationable>> {
        return $authHost.get('/equipment_categories/');
    }

    createEquipmentApplication(applicationData: CreateEquipmentApplicationParams):
        Promise<AxiosResponse<IEquipmentApplication>> {
        return $authHost.post('/equipment_applications/', applicationData);
    }

    getEquipmentApplication(id: number): Promise<AxiosResponse<IEquipmentApplication>> {
        return $host.get(`/equipment_applications/${id}/`);
    }

    upadateEquipmentApplication(
        data: Partial<CreateEquipmentApplicationParams> & { id: number }
    ): Promise<AxiosResponse<IEquipmentApplication>> {
        const {id, ...params} = data;
        return $authHost.patch(`/equipment_applications/${id}/`, params);
    }

    patchEquipmentApplicationStatus(data: UpdateEquipmentApplicationStatusParams): Promise<AxiosResponse<IEquipmentApplication>> {
        const {id, ...params} = data;
        console.log(id)
        return $authHost.patch(`/equipment_applications/${id}/`, {
            ...params
        });
    }

    setEquipmentApplicationImage(
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

        return $authHost.post(`/equipment_applications/${id}/add_images/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    deleteEquipmentApplication(id: number): Promise<AxiosResponse<IEquipmentApplication>> {
        return $authHost.delete(`/equipment_applications/${id}/`);
    }

    updateEquipmentApplicationInFavorite(id: number): Promise<AxiosResponse<IEquipmentApplication>> {
        return $authHost.patch(`/equipment_applications/${id}/favorite/`);
    }
}

export const equiomentApplicationApi = new EquipmentApplicationApi();
