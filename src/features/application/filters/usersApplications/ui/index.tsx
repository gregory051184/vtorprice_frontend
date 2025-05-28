import React, {useState} from 'react';
import {
    AsyncSelect, BaseInput,
    Button, DatePicker, Drawer, SearchInput, Select, TabSelect
} from '@box/shared/ui';
import {IWithClass} from '@types';
import FilterIcon from '@assets/icons/24_filter.svg';
import {useBoolean, useDebounce, useEffectAfterMount} from '@box/shared/hooks';
import {
    applicationStatusForUsersSelectValues,
    dealTypeSelectValues,
} from '@box/entities/application';
import {recyclablesSelectApi} from '@box/entities/company';
import {citySelectApi} from '@box/entities/city';
import {useField, useForm} from '@box/shared/effector-forms';
import {applyUsersApplicationTableFilters, usersApplicationTableFilters} from '@box/features/application';
import {useEvent} from 'effector-react';
import {groupTypes} from '../../../lib';
import classNames from "classnames";
import s from './style.module.scss';

const Search: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(usersApplicationTableFilters.fields.search);
    const [val, setVal] = useState('');
    const debouncedVal = useDebounce(val, 500);

    useEffectAfterMount(() => {
        onChange(debouncedVal);
    }, [debouncedVal]);
    return <SearchInput value={val} onChange={setVal} className={className} mode="stroke"/>;
};
export const UsersApplicationsListFilters = () => {
    const {value, toggle} = useBoolean(false);
    const {fields, reset} = useForm(usersApplicationTableFilters);
    const applyFilters = useEvent(applyUsersApplicationTableFilters);

    return (
        <div>
            <Drawer
                disableClickOutside
                bottomActions={(
                    <div className="flex gap-[15px]">
                        <Button
                            onClick={() => {
                                applyFilters();
                                toggle();
                            }}
                            className="grow"
                        >
                            Применить
                        </Button>
                        <Button
                            onClick={() => {
                                reset();
                                toggle();
                            }}
                            className="grow"
                            mode="light"
                        >
                            Сбросить
                        </Button>
                    </div>
                )}
                title="Фильтр"
                visible={value}
                close={toggle}
            >
                <div className="grid grid-cols-1 auto-rows-auto gap-[25px]">
                    <TabSelect label="Тип заявок" onChange={fields.status.onChange} values={groupTypes}
                               value={fields.status.value}/>
                    <DatePicker
                        mode="stroke"
                        value={fields.created_at.value}
                        onChange={fields.created_at.onChange}
                    />
                    <Select
                        value={fields.deal_type.value}
                        onSelect={fields.deal_type.onChange}
                        placeholder="Тип заявки"
                        inputProps={{mode: 'stroke'}}
                        data={dealTypeSelectValues}
                    />
                    <Select
                        value={fields.application_recyclable_status.value}
                        onSelect={fields.application_recyclable_status.onChange}
                        placeholder="Тип сырья"
                        inputProps={{mode: 'stroke'}}
                        data={applicationStatusForUsersSelectValues}
                    />
                    <AsyncSelect
                        value={fields.recyclables.value}
                        placeholder="Тип вторсырья"
                        inputProps={{mode: 'stroke'}}
                        loadData={recyclablesSelectApi}
                        onSelect={fields.recyclables.onChange}
                    />
                    <div className="flex gap-[14px]">
                        <BaseInput
                            value={fields.price__gte.value}
                            onChange={fields.price__gte.onChange}
                            mode="stroke"
                            placeholder="Цена от"
                        />
                        <BaseInput
                            value={fields.price__lte.value}
                            onChange={fields.price__lte.onChange}
                            mode="stroke"
                            placeholder="Цена до"
                        />
                    </div>
                    <BaseInput
                        value={fields.total_weight__gte.value}
                        onChange={fields.total_weight__gte.onChange}
                        mode="stroke"
                        placeholder="Общий вес, т"
                    />
                    <AsyncSelect
                        placeholder="Город"
                        inputProps={{mode: 'stroke'}}
                        loadData={citySelectApi}
                        value={fields.city.value}
                        onSelect={fields.city.onChange}
                    />
                </div>

            </Drawer>
            <div className={classNames("mt-[30px] flex gap-[20px]", s.filters)}>
                <Search className="grow"/>
                <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon/>}>
                    Фильтр
                </Button>
            </div>
        </div>
    );
};
