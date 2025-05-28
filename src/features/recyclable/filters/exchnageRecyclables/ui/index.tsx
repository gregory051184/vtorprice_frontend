import React from 'react';
import {IWithClass} from '@types';
import classNames from 'classnames';
import {useField, useForm} from '@box/shared/effector-forms';
import {recyclablesCategoriesSelectApi} from '@box/entities/company';
import {AsyncSelect, SearchInput, TabSelect} from '@box/shared/ui';
import {urgencyTypeSelectValues} from '@box/entities/application';
import {filters} from '../model';

const UrgencyTypeTabs: React.FC<IWithClass> = ({
                                                   className
                                               }) => {
    const {value, onChange} = useField(filters.fields.urgency_type);
    return (
        <TabSelect
            className={className}
            onChange={onChange}
            values={urgencyTypeSelectValues}
            value={value}
        />
    );
};


const ExchangeRecyclablesListFilters = ({
                                            className
                                        }: IWithClass) => {
    const {fields} = useForm(filters);
    return (
        <div className={classNames('flex gap-[20px]', className)}>
            <AsyncSelect
                inputProps={{
                    mode: 'stroke',
                }}
                withClearButton
                value={fields.category.value}
                wide
                containerSize={1220}
                onSelect={fields.category.onChange}
                placeholder="Категория"
                loadData={recyclablesCategoriesSelectApi}
            />
            <SearchInput mode="stroke" className="grow" value={fields.search.value} placeholder="Поиск по заявкам..."
                         onChange={fields.search.onChange}/>
        </div>
    );
};

ExchangeRecyclablesListFilters.UrgencyTypeTabs = UrgencyTypeTabs;


export {
    ExchangeRecyclablesListFilters
};
