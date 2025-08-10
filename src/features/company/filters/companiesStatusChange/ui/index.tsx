import {AsyncSelect, SearchInput, Select} from '@box/shared/ui';
import React, {useState} from 'react';
import {useDebounce, useEffectAfterMount} from '@box/shared/hooks';
import classNames from 'classnames';
import {
    collectionTypeSelectApi, companyRecyclablesCountValues,
    companyStatusSelectValues,
    recyclablesSelectApi
} from '@box/entities/company/api/selects';
import {citySelectApi} from '@box/entities/city/api/selects';
import {useField, useForm} from '@box/shared/effector-forms';
import s from '../../companiesVerifications/ui/style.module.scss';
import {filters} from "@box/features/company/filters/companies/model";
import {managerSelectApi} from "@box/entities/user";
import {useStoreMap} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@types";


const Search = () => {
    const search = useField(filters.fields.search);
    const [val, setVal] = useState('');
    const debouncedVal = useDebounce(val, 300);

    useEffectAfterMount(() => {
        search.onChange(debouncedVal);
    }, [debouncedVal]);
    return (
        <SearchInput
            value={val}
            onChange={setVal}
            className={classNames('grow', s.field)}
            mode="stroke"
            placeholder="Введите название компании.."
        />
    );
};


export const CompaniesStatusChangeListFilters = () => {
    const {fields} = useForm(filters);
    const user = useStoreMap({
        store: $authStore,
        keys: ['user'],
        fn: (val) => val.user
    });
    // useEffect(() => {
    //     fields.activity_types__rec_col_types.onChange(null);
    //     fields.activity_types__advantages.onChange([]);
    //     fields.recyclables__recyclables.onChange(null);
    //     fields.city.onChange(null);
    // }, []);

    return (
        <div className="flex flex-col gap-[20px]">
            <div className={classNames('flex items-center gap-[20px]', s.filter, s.filter_head)}>
                <AsyncSelect
                    withClearButton
                    loadData={recyclablesSelectApi}
                    inputProps={{mode: 'stroke'}}
                    value={fields.recyclables__recyclables.value}
                    onSelect={fields.recyclables__recyclables.onChange}
                    className={classNames(s.field, 'w-[270px] shrink-0')}
                    placeholder="Тип вторсырья"
                />
                <Select
                    onSelect={fields.exist_company_recyclables.onChange}
                    value={fields.exist_company_recyclables.value}
                    inputProps={{mode: 'stroke'}}
                    className={classNames(s.field, 'w-[215px] shrink-0')}
                    placeholder="Маркировка"
                    data={companyRecyclablesCountValues}
                />
                <Search/>
            </div>
            <div className={classNames('flex gap-[20px]', s.filter)}>
                <AsyncSelect
                    withClearButton
                    value={fields.activity_types__rec_col_types.value}
                    onSelect={fields.activity_types__rec_col_types.onChange}
                    withSearch={false}
                    wide
                    inputProps={{mode: 'stroke'}}
                    containerSize={1220}
                    loadData={collectionTypeSelectApi}
                    className={classNames(s.field, 'w-[215px] shrink-0')}
                    withSpecialWideAndCloseButton={true}
                    placeholder="Тип компании"
                />
                <AsyncSelect
                    withClearButton
                    onSelect={fields.city.onChange}
                    inputProps={{mode: 'stroke'}}
                    value={fields.city.value}
                    loadData={citySelectApi}
                    className={classNames(s.field_city, 'w-[215px] shrink-0')}
                    placeholder="Город"
                />
                <Select
                    onSelect={fields.status.onChange}
                    value={fields.status.value}
                    inputProps={{mode: 'stroke'}}
                    className={classNames(s.field, 'w-[215px] shrink-0')}
                    placeholder="Статус компании"
                    data={companyStatusSelectValues}
                />
                {(user && user?.role.id < ROLE.MANAGER) &&
                    <AsyncSelect
                        withClearButton
                        className={classNames(s.field, 'w-[215px] shrink-0')}
                        placeholder="Менеджер"
                        value={fields.manager.value}
                        loadData={managerSelectApi}
                        onSelect={fields.manager.onChange}
                        inputProps={{mode: 'stroke'}}
                    />
                }
            </div>
        </div>
    );
};
