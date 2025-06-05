import {ISelectValue} from '@box/shared/ui/select';
import {companyApi} from '@box/entities/company';
import {ICompanyRecyclable} from '../../model/types';


export const recyclablesSelectApi = async (search?: string):
    Promise<Array<ISelectValue<ICompanyRecyclable['recyclables']>>> => {
    try {
        const {data} = await companyApi.getCompanyRecyclables({
            search,
        });
        return data.map((el) => ({
            id: el.id,
            label: el.name,
            value: el
        }))

    } catch {
        return [];
    }
};




