import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { Paginationable } from '@types';
import { IEmployeesQuantityData } from '../employeesQuantity/model/types';

type GetEmployeesQuantityParams = {
    page: number,
};

class EmployeesQuantityApi {
    getEmployeesQuantity(params: Partial<GetEmployeesQuantityParams>):
    Promise<AxiosResponse<{
        results: IEmployeesQuantityData
    } & Paginationable>> {
        return $host.get('/statistics/total_employee/', {
            params
        });
    }
}

export const employeesQuantityApi = new EmployeesQuantityApi();