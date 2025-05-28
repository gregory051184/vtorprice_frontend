import {useForm} from "@box/shared/effector-forms";
import {IWithClass} from "@box/types";
import {appFilters} from '../model';
import {dealTypeSelectValues, TimeframeTypes, urgencyTypeSelectValues} from "@box/entities/application";
import {AsyncSelect, Select, TabSelect} from "@box/shared/ui";
import {recyclablesCategoriesSelectApi} from "@box/entities/company";
import {citySelectApi} from "@box/entities/city";
import s from './style.module.scss';
import classNames from "classnames";

export const RecyclableApplicationPricesFilters: React.FC<IWithClass> = ({
                                                                             className
                                                                         }) => {
    const {fields} = useForm(appFilters);


    return (
        <div className={classNames("flex items-end mt-[16px] justify-between ", s.adaptive, className)}>
            <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>

                <TabSelect
                    onChange={fields.period.onChange}
                    values={TimeframeTypes}
                    value={fields.period.value}
                />

            </div>
            <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>
                <TabSelect
                    onChange={fields.deal_type.onChange}
                    values={dealTypeSelectValues}
                    value={fields.deal_type.value}
                />
            </div>
            <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>
                <Select
                    placeholder="Срочность"
                    inputProps={{mode: 'stroke'}}
                    withClearButton
                    onSelect={fields.applications__urgency_type.onChange}
                    value={fields.applications__urgency_type.value}
                    data={urgencyTypeSelectValues}
                />
                <AsyncSelect
                    placeholder="Город"
                    inputProps={{mode: 'stroke'}}
                    withClearButton
                    onSelect={fields.applications__city.onChange}
                    value={fields.applications__city.value}
                    loadData={citySelectApi}
                />
                <AsyncSelect
                    placeholder="Категория"
                    inputProps={{mode: 'stroke'}}
                    withClearButton
                    onSelect={fields.category.onChange}
                    value={fields.category.value}
                    loadData={recyclablesCategoriesSelectApi}
                />
            </div>
        </div>

    );
};
  
