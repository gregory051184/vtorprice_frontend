import {companyApi} from '@box/entities/company';
import {ISelectValue} from '@box/shared/ui';

export const collectionTypeSelectApi = async (search: string): Promise<Array<ISelectValue>> => {
    try {
        const {data} = await companyApi.getCompanyGroupedRecyclingCollectionTypes({
            search
        });

        return data.map((el) => ({
            id: el.id,
            label: el.label,
            value: el,
            isHeader: true,
            selectable: false,
            children: el.recColTypes.map((type) => ({
                id: type.id,
                label: type.name,
                value: type
            }))
        }));
    } catch {
        return [];
    }
};


