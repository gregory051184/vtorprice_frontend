import React, {useEffect} from 'react';
import classNames from 'classnames';
import {
    AsyncSelect, BaseInput,
    Button, Select, TabSelect
} from '@box/shared/ui';
import {useForm} from '@box/shared/effector-forms';
import {useEvent, useStore, useUnit} from 'effector-react';
import {citySelectApi} from '@box/entities/city';
import Reset from '@assets/icons/20_reset.svg';
import {
    applicationTypes,
    dealTypeSelectValues,
    urgencyTypeSelectValues
} from '@box/entities/application';
import {recyclablesSelectApi} from '@box/entities/company';
import {equipmentSelectApi} from '@box/entities/application/api/selects/equipmentSelect';
import {clearApplicationInList, getCityInfoFx} from '@box/pages/map';
import {IWithClass} from '@box/types';
import {
    applyMapApplicationFilters, filters, applicationType,
    changeApplicationType, resetMapApplicationFilters
} from '../model';
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {regionSelectApi} from "@box/entities/region";
import s from "@box/features/company/filters/companies/ui/style.module.scss";
import {districtSelectApi} from "@box/entities/district";


export const MapApplicationFilters: React.FC<IWithClass> = ({className}) => {
    const {fields, reset} = useForm(filters);
    const type = useStore(applicationType);
    const changeType = useUnit(changeApplicationType);
    const resetType = useUnit(resetMapApplicationFilters);
    const applyFilters = useEvent(applyMapApplicationFilters);
    const clearSeachApplication = useUnit(clearApplicationInList);
    const getCityInfo = useUnit(getCityInfoFx);

    const router = useRouter();
    const queries = router.query

    const defaultFilters = (queries: ParsedUrlQuery) => {

        if (queries['application_type']) {
            //@ts-ignore
            const appType = applicationTypes.filter(appType => +appType?.id === +queries['application_type'])[0];
            clearSeachApplication();
            changeType(appType);

            //@ts-ignore
            const dealType = dealTypeSelectValues.filter(dealType => +dealType?.id === +queries['deal_type'])[0];
            fields.deal_type.onChange(dealType)

            //@ts-ignore
            const urgencyType = urgencyTypeSelectValues.filter(urgencyType => +urgencyType?.id === +queries['urgency_type'])[0];
            fields.urgency_type.onChange(urgencyType);

            //@ts-ignore
            recyclablesSelectApi().then(data => {
                //@ts-ignore
                const item = data.filter(item => item?.id === +queries['category'])[0]
                fields.recyclables__category.onChange(item);
            })
            //@ts-ignore
            fields.weight.onChange(queries['volume'][0])

            //@ts-ignore
            citySelectApi().then(data => {
                //@ts-ignore
                const city = data.filter(city => +city?.id === +queries['city'])[0];
                fields.city.onChange(city)
            })
        }
    }

    useEffect(() => {
        defaultFilters(queries)
    }, [queries]);

    return (
        <div className={classNames('flex flex-col gap-[14px] bg-white-80 rounded-xl py-6 px-4', className)}>
            <h1 className="text-base font-semibold">Фильтр</h1>
            <TabSelect
                className="w-full bg-white-10"
                value={type}
                onChange={(val) => {
                    clearSeachApplication();
                    changeType(val);
                }}
                values={applicationTypes}
            />
            {type?.value === 1 ? (
                <>
                    <AsyncSelect
                        placeholder="Тип оборудования"
                        value={fields.equipment__category?.value}
                        onSelect={fields.equipment__category.onChange}
                        loadData={equipmentSelectApi}
                    />
                    <Select
                        placeholder="Тип обьявления"
                        data={dealTypeSelectValues}
                        onSelect={fields.deal_type.onChange}
                        value={fields.deal_type?.value}
                    />
                    <BaseInput
                        placeholder="Кол-во"
                        className="grow"
                        value={fields.count?.value}
                        onChange={fields.count.onChange}
                    />
                    <AsyncSelect
                        placeholder="Город"
                        value={fields.city?.value}
                        loadData={citySelectApi}
                        onSelect={fields.city.onChange}
                    />
                    {/*<AsyncSelect
                        withClearButton
                        onSelect={fields.region.onChange}
                        //inputProps={{mode: 'stroke'}}
                        value={fields.region.value}
                        loadData={regionSelectApi}
                        //className={classNames(s.field_city, 'w-[210px] shrink-0')}
                        placeholder="Регион"
                    />
                    <AsyncSelect
                        withClearButton
                        onSelect={fields.district.onChange}
                        //inputProps={{mode: 'stroke'}}
                        value={fields.district.value}
                        loadData={districtSelectApi}
                        //className={classNames(s.field_city, 'w-[210px] shrink-0')}
                        placeholder="Округ"
                    />*/}
                </>
            ) : (
                <>
                    <Select
                        placeholder="Готовность"
                        data={urgencyTypeSelectValues}
                        //@ts-ignore
                        value={fields.urgency_type?.value}
                        onSelect={fields.urgency_type.onChange}
                    />
                    <Select
                        placeholder="Тип обьявления"
                        data={dealTypeSelectValues}
                        onSelect={fields.deal_type.onChange}
                        value={fields.deal_type?.value}
                    />
                    <AsyncSelect
                        placeholder="Категория"
                        value={fields.recyclables__category?.value}
                        loadData={recyclablesSelectApi}
                        onSelect={fields.recyclables__category.onChange}
                    />
                    <BaseInput
                        placeholder="Обьём"
                        className="grow"
                        value={fields.weight?.value}
                        onChange={fields.weight.onChange}
                    />
                    <AsyncSelect
                        placeholder="Город"
                        value={fields.city?.value}
                        loadData={citySelectApi}
                        onSelect={fields.city.onChange}
                    />
                    <AsyncSelect
                        withClearButton
                        onSelect={fields.region.onChange}
                        //inputProps={{mode: 'stroke'}}
                        value={fields.region.value}
                        loadData={regionSelectApi}
                        //className={classNames(s.field_city, 'w-[210px] shrink-0')}
                        placeholder="Регион"
                    />
                    <AsyncSelect
                        withClearButton
                        onSelect={fields.district.onChange}
                        //inputProps={{mode: 'stroke'}}
                        value={fields.district.value}
                        loadData={districtSelectApi}
                        //className={classNames(s.field_city, 'w-[210px] shrink-0')}
                        placeholder="Округ"
                    />
                </>
            )}
            <Button
                onClick={() => {
                    applyFilters(type?.value);
                }}
                className="grow"
            >
                Применить
            </Button>
            <button
                type="button"
                onClick={() => {
                    reset();
                    resetType(type?.value);
                }}
            >
                <div className="flex gap-3 m-2 justify-center items-center">
                    <Reset/>
                    <p className="text-grey-60">Сбросить</p>
                </div>
            </button>
        </div>
    );
};
