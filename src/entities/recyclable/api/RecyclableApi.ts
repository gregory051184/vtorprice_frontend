import {AxiosResponse} from 'axios';
import {$host} from '@box/shared/api';
import {IRecyclable} from '../model';


type RecyclablesByCategoryId = {
    category: number
}

class RecyclableApi {
    getRecyclable(id: number): Promise<AxiosResponse<IRecyclable>> {
        return $host.get(`/recyclables/${id}`);
    }

     getRecyclablesByCategoryId(id: number): Promise<AxiosResponse<Array<IRecyclable>/*{
        results: Array<IRecyclable>
    }*/>> {
        const params: RecyclablesByCategoryId = {category: id};
        return $host.get(`/recyclables/`, {params});
    }
}

export const recyclableApi = new RecyclableApi();
