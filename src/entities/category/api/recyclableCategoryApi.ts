import {AxiosResponse} from "axios";
import {$host} from "@box/shared/api";


type RecyclablesCategoriesParams = {
    size: number
}

class RecyclableCategoryApi {
    getRecyclablesCategories(params: RecyclablesCategoriesParams): Promise<AxiosResponse> {
        return $host.get('/recyclables_categories/', {params});
    }

    getCategoriesWithStatistics(): Promise<AxiosResponse> {
        return $host.get('/recyclables_categories/two_last_supply_contracts_prices/');
    }
}

export const recyclableCategoryApi = new RecyclableCategoryApi();