import {useField, useForm} from "@box/shared/effector-forms";
import {useBoolean, useDebounce, useEffectAfterMount} from "@box/shared/hooks";
import {AsyncSelect, BaseInput, Button, DatePicker, Drawer, SearchInput, Select, TabSelect} from "@box/shared/ui";
import {IWithClass, ROLE} from "@box/types";
import {useState} from "react";
import {
    applicationManagementTableFilters,
    applyApplicationManagementTableFilters,
    applyEquipmentApplicationManagementTableFilters,
    equipmentApplicationsManagementTableFilters
}
    from "../model/store";
import {useEvent, useStore} from "effector-react";
import {groupTypes} from "@box/features/application/lib";
import {applicationStatusSelectValues, dealTypeSelectValues} from "@box/entities/application";
import {existingCompanySelectApi, recyclablesSelectApi} from "@box/entities/company";
import {citySelectApi} from "@box/entities/city";
import classNames from "classnames";
import s from './style.module.scss';
import FilterIcon from '@assets/icons/24_filter.svg';
import {equipmentSelectApi} from "@box/entities/application/api/selects/equipmentSelect";
import {$authStore} from "@box/entities/auth";

function checkUser() {
    const {user} = useStore($authStore);
    if (user?.role.id as ROLE === ROLE.MANAGER) {
        return user?.id;
    }
    return undefined;
}

const Search: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(applicationManagementTableFilters.fields.search);
    const [val, setVal] = useState('');
    const debouncedVal = useDebounce(val, 500);

    useEffectAfterMount(() => {
        onChange(debouncedVal);
    }, [debouncedVal]);
    return <SearchInput value={val} onChange={setVal} className={className} mode="stroke"/>;
};


export const ApplicationsListManagementFilters = () => {
    const {value, toggle} = useBoolean(false);
    const {fields, reset} = useForm(applicationManagementTableFilters);
    const applyFilters = useEvent(applyApplicationManagementTableFilters);
    const user = checkUser()
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
                    <TabSelect label="Активные/Архивные"
                               onChange={fields.is_deleted.onChange}
                               values={groupTypes}
                               value={fields.is_deleted.value}/>
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
                <AsyncSelect
                    inputProps={{mode: 'stroke'}}
                    value={fields.company.value}
                    onSelect={fields.company.onChange}
                    placeholder="Компания"
                    loadData={(val) => {
                        return (existingCompanySelectApi(val, user))
                    }}

                    withClearButton
                />
                <Select
                    withClearButton
                    value={fields.status.value}
                    onSelect={fields.status.onChange}
                    placeholder="Статус"
                    inputProps={{mode: 'stroke'}}
                    data={applicationStatusSelectValues}/>
                <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon/>}>
                    Фильтр
                </Button>
            </div>
        </div>
    );
};

const SearchEquipment: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(equipmentApplicationsManagementTableFilters.fields.search);
    const [val, setVal] = useState('');
    const debouncedVal = useDebounce(val, 500);

    useEffectAfterMount(() => {
        onChange(debouncedVal);
    }, [debouncedVal]);
    return <SearchInput value={val} onChange={setVal} className={className} mode="stroke"/>;
};
export const EquipmentApplicationsManagementListFilters = () => {
    const {value, toggle} = useBoolean(false);
    const {fields, reset} = useForm(equipmentApplicationsManagementTableFilters);
    const applyFilters = useEvent(applyEquipmentApplicationManagementTableFilters);
    const user = checkUser()

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
                    <TabSelect label="Активные/Архивные"
                               onChange={fields.is_deleted.onChange}
                               values={groupTypes}
                               value={fields.is_deleted.value}/>
                    <DatePicker
                        mode="stroke"
                        value={fields.created_at.value}
                        onChange={fields.created_at.onChange}
                        className="grow"
                    />
                    <Select
                        placeholder="Тип заявки"
                        inputProps={{mode: 'stroke'}}
                        data={dealTypeSelectValues}
                        value={fields.deal_type.value}
                        onSelect={fields.deal_type.onChange}
                    />
                    <AsyncSelect
                        placeholder="Обуродование"
                        inputProps={{mode: 'stroke'}}
                        loadData={equipmentSelectApi}
                        value={fields.equipment.value}
                        onSelect={fields.equipment.onChange}
                    />
                    <div className="flex gap-[14px]">
                        <BaseInput
                            placeholder="Цена от"
                            mode="stroke"
                            value={fields.price__gte.value}
                            onChange={fields.price__gte.onChange}
                        />
                        <BaseInput
                            placeholder="Цена до"
                            mode="stroke"
                            value={fields.price__lte.value}
                            onChange={fields.price__lte.onChange}
                        />
                    </div>
                    <BaseInput
                        placeholder="Кол-во"
                        mode="stroke"
                        value={fields.count.value}
                        onChange={fields.count.onChange}
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
                <SearchEquipment className="grow"/>
                <AsyncSelect
                    inputProps={{mode: 'stroke'}}
                    value={fields.company.value}
                    onSelect={fields.company.onChange}
                    placeholder="Компания"
                    loadData={(val) => {
                        return (existingCompanySelectApi(val, user))
                    }}
                    withClearButton
                />
                <Select
                    withClearButton
                    value={fields.status.value}
                    onSelect={fields.status.onChange}
                    placeholder="Статус"
                    inputProps={{mode: 'stroke'}}
                    data={applicationStatusSelectValues}/>
                <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon/>}>
                    Фильтр
                </Button>
            </div>
        </div>
    );
};