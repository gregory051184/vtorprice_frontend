import React from 'react';
import classNames from 'classnames';
import {
    AsyncSelect, DatePicker,
} from '@box/shared/ui';
import {collectionTypeSelectApi, recyclablesSelectApi} from '@box/entities/company';
import {citySelectApi} from '@box/entities/city';
import {SearchDebounce} from '@box/shared/ui/input/searchDebounce';
import {useForm} from '@box/shared/effector-forms';
import {filters} from '../model';
import s from './style.module.scss';

export const ManagerMyCompaniesListFilters = () => {
    const {fields} = useForm(filters);

    return (
        <div>
            <div className={classNames('flex gap-4 mb-4', s.filter)}>
                <AsyncSelect
                    placeholder="Категория"
                    inputProps={{
                        mode: 'stroke',
                    }}
                    withClearButton
                    value={fields.recyclables__category.value}
                    onSelect={fields.recyclables__category.onChange}
                    loadData={recyclablesSelectApi}
                />
                <SearchDebounce
                    className="grow"
                    value={fields.search.value}
                    onChange={fields.search.onChange}
                />
            </div>
            <div className={classNames('flex gap-4', s.filter)}>
                <DatePicker
                    mode="stroke"
                    value={fields.createdAt.value}
                    className="grow"
                    onChange={fields.createdAt.onChange}
                />
                <AsyncSelect
                    withClearButton
                    value={fields.activity_types__rec_col_types.value}
                    onSelect={fields.activity_types__rec_col_types.onChange}
                    withSearch={false}
                    wide
                    inputProps={{mode: 'stroke'}}
                    loadData={collectionTypeSelectApi}
                    className={classNames(s.field, 'w-[270px] shrink-0')}
                    withSpecialWideAndCloseButton={true}
                    placeholder="Тип компании"
                />
                <AsyncSelect
                    withClearButton
                    placeholder="Город"
                    value={fields.company__city.value}
                    inputProps={{mode: 'stroke'}}
                    loadData={citySelectApi}
                    onSelect={fields.company__city.onChange}
                />
            </div>
        </div>
    );
};
