import {useField, useForm} from "@box/shared/effector-forms";
import {managersFilters} from "@box/entities/user/filters";
import {AsyncSelect, DatePicker, SearchInput, Select} from "@box/shared/ui";
import React, {useEffect, useState} from "react";
import {IWithClass} from "@types";
import classNames from "classnames";
import s from "@box/features/company/filters/companiesVerifications/ui/style.module.scss";
import {managerSelectApi} from "@box/entities/user";

import {recyclablesSelectApi} from "@box/entities/company";
import {useDebounce, useEffectAfterMount} from "@box/shared/hooks";
import {dealStatusSelectValues} from "@box/entities/deal";

export const ManagersCompaniesListFiltersSearch: React.FC<IWithClass> = ({
                                                                             className
                                                                         }) => {
    const search = useField(managersFilters.fields.search);
    const [val, setVal] = useState('');
    const debouncedVal = useDebounce(val, 500);

    useEffect(() => {
        search.onChange('');
    }, []);

    useEffectAfterMount(() => {
        search.onChange(debouncedVal);
    }, [debouncedVal]);
    return (
        <SearchInput
            placeholder="Название компании или ИНН..."
            value={val}
            className={classNames('max-w-[400px] w-full', className)}
            onChange={setVal}
            mode="stroke"
        />
    );
};


export const ManagersDealsFilter = () => {
    const {fields, submit} = useForm(managersFilters)
    return (
        <div className="inline-flex mt-6">
            <DatePicker
                inputStyle={"w-auto"}
                mode="stroke"
                placeholder="Временной промежуток"
                value={fields.created_at.value}
                onChange={fields.created_at.onChange}
            />
            <Select
                withClearButton
                onSelect={fields.status.onChange}
                value={fields.status.value}
                inputProps={{mode: 'stroke'}}
                className={classNames(s.field, 'w-[210px] shrink-0 ml-4')}
                placeholder="Статус сделки"
                data={dealStatusSelectValues}
            />
            <AsyncSelect
                withClearButton
                className={classNames(s.field, 'w-[215px] shrink-0 ml-4')}
                placeholder="Менеджер"
                value={fields.manager.value}
                loadData={managerSelectApi}
                onSelect={fields.manager.onChange}
                inputProps={{mode: 'stroke'}}
            />

            <AsyncSelect
                withClearButton
                loadData={recyclablesSelectApi}
                inputProps={{mode: 'stroke'}}
                value={fields.application__recyclables.value}
                onSelect={fields.application__recyclables.onChange}
                className={classNames(s.field, 'w-[270px] shrink-0 ml-4')}
                placeholder="Тип вторсырья"
            />
        </div>
    )
}