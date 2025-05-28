import {AxiosResponse} from "axios";
import {$host} from "@box/shared/api";

class RecyclableCategoryApi {
    getRecyclablesCategories(): Promise<AxiosResponse> {
        return $host.get('/recyclables_categories/');
    }
}

export const recyclableCategoryApi = new RecyclableCategoryApi();