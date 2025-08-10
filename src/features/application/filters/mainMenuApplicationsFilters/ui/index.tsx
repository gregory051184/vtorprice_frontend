import React, {useEffect, useState} from 'react';
import {
    AsyncSelect, BaseInput,
    Button, DatePicker, ISelectValue, Select,
} from '@box/shared/ui';
import {IWithClass} from '@types';
import {useBoolean, useScreenSize} from '@box/shared/hooks';
import {
    applicationRecyclableStatusSelectValues,
    applicationStatusForUsersSelectValues, companyRatingSelectValues,
    dealTypeSelectValues, ndsTaxSelectValues,
    TimeframeTypes,
    urgencyTypeSelectValues
} from '@box/entities/application';
import {
    collectionTypeSelectApi,
    companyStatusSelectValues,
    recyclablesSelectApi
} from '@box/entities/company';
import {citySelectApi} from '@box/entities/city';
import {useForm} from '@box/shared/effector-forms';
import {useEvent} from 'effector-react';
import s from './style.module.scss';
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {
    applyMainMenuApplicationFilters,
} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {regionSelectApi} from "@box/entities/region";
import classNames from "classnames";
import {districtSelectApi} from "@box/entities/district";


export const MainMenuApplicationsListFilters: React.FC<IWithClass> = () => {
    const {value, toggle} = useBoolean(false);
    const {fields, reset} = useForm(mainMenuApplicationFilters);
    const applyFilters = useEvent(applyMainMenuApplicationFilters);
    //Состояния для открытия/закрытия фильтров
    const [locationFilters, setLocationFilters] = useState<boolean>(false);
    const [appConditionsFilters, setAppConditionsFilters] = useState<boolean>(false);
    const [companyParametersFilters, setCompanyParametersFilters] = useState<boolean>(false);
    const [appStatusFilters, setAppStatusFilters] = useState<boolean>(false);
    const [fractionStatus, setFractionStatus] = useState<Array<ISelectValue<unknown>>>([]);

    const router = useRouter();
    const queries = router.query

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const defaultFilters = (queries: ParsedUrlQuery) => {
        if (queries['application_type']) {
            //@ts-ignore
            const dealType = dealTypeSelectValues.filter(dealType => +dealType?.id === +queries['deal_type'])[0];
            fields.deal_type_select.onChange(dealType)
            //@ts-ignore
            const applicationRecyclableStatus = applicationRecyclableStatusSelectValues.filter(appRecStatus => +appRecStatus?.id === +queries['application_recyclable_status'])[0];
            fields.application_recyclable_status_tab.onChange(applicationRecyclableStatus);
            //@ts-ignore
            recyclablesSelectApi().then(data => {
                //@ts-ignore
                const item = data.filter(item => item?.id === +queries['category'])[0]
                fields.recyclables.onChange(item);
            })

            //@ts-ignore
            const urgencyType = urgencyTypeSelectValues.filter(urgencyType => +urgencyType?.id === +queries['urgency_type'])[0];
            fields.urgency_type_select.onChange(urgencyType);

            //@ts-ignore
            const period = TimeframeTypes.filter(period => period?.label === queries['period'])[0];
            fields.period.onChange(period);

            //@ts-ignore
            fields.total_weight__gte.onChange(+queries['total_weight__gte']);

            //@ts-ignore
            fields.total_weight__lte.onChange(+queries['total_weight__lte']);

            //@ts-ignore
            fields.price__gte.onChange(+queries['price__gte']);

            //@ts-ignore
            fields.price__lte.onChange(+queries['price__lte']);

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
    }, [fractionStatus]);

    return (
        <div className={(!isLaptop && !isMobile) ? 'shrink-0 w-[230px]' : "w-full"}>
            <div className={(!isLaptop && !isMobile) ? "sticky z-10 top-[100px]" : "mt-5"}>
                <Button
                    onClick={() => {

                        reset();
                        toggle();
                    }}
                    className="grow"
                    fullWidth={true}
                >
                    Сбросить
                </Button>
                <Button
                    onClick={() => {
                        applyFilters();
                        toggle();
                    }}
                    className="grow mt-[15px]"
                    fullWidth={true}
                >
                    Применить
                </Button>
            </div>
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setCompanyParametersFilters(!companyParametersFilters)}
                >
                    Фильтры по параметрам компании
                </h4>
            </div>
            {(companyParametersFilters && (isLaptop || isMobile)) &&
                <div className="mt-6">
                    <div>
                        <AsyncSelect
                            withClearButton
                            value={fields.activity_types__rec_col_types.value}
                            onSelect={fields.activity_types__rec_col_types.onChange}
                            withSearch={false}
                            wide
                            inputProps={{mode: 'stroke'}}
                            loadData={collectionTypeSelectApi}
                            withSpecialWideAndCloseButton={true}
                            placeholder="Тип компании"
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.company_rating.value}
                            placeholder="Рейтинг компании"
                            onSelect={fields.company_rating.onChange}
                            data={companyRatingSelectValues}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            onSelect={fields.companies_trust.onChange}
                            value={fields.companies_trust.value}
                            inputProps={{mode: 'stroke'}}
                            placeholder="Доверие к компании"
                            data={companyStatusSelectValues}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            value={fields.nds.value}
                            onSelect={fields.nds.onChange}
                            withClearButton
                            placeholder="НДС"
                            inputProps={{mode: 'stroke'}}
                            data={ndsTaxSelectValues}
                        />
                    </div>
                </div>}
            {(!isLaptop && !isMobile) &&
                <div className="mt-6">
                    <div>
                        <AsyncSelect
                            withClearButton
                            value={fields.activity_types__rec_col_types.value}
                            onSelect={fields.activity_types__rec_col_types.onChange}
                            withSearch={false}
                            wide
                            inputProps={{mode: 'stroke'}}
                            loadData={collectionTypeSelectApi}
                            withSpecialWideAndCloseButton={true}
                            placeholder="Тип компании"
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.company_rating.value}
                            placeholder="Рейтинг компании"
                            onSelect={fields.company_rating.onChange}
                            data={companyRatingSelectValues}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            onSelect={fields.companies_trust.onChange}
                            value={fields.companies_trust.value}
                            inputProps={{mode: 'stroke'}}
                            placeholder="Доверие к компании"
                            data={companyStatusSelectValues}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            value={fields.nds.value}
                            onSelect={fields.nds.onChange}
                            withClearButton
                            placeholder="НДС"
                            inputProps={{mode: 'stroke'}}
                            data={ndsTaxSelectValues}
                        />
                    </div>
                </div>}
            <div className={s.title_for_filters}>
                <h4>Базовые фильтры</h4>
            </div>
            <div className="mt-6">
                <div>
                    <DatePicker
                        inputStyle={"w-auto"}
                        mode="stroke"
                        value={fields.created_at.value}
                        onChange={fields.created_at.onChange}
                    />
                </div>
                <div className="mt-5">
                    <Select
                        value={fields.period.value}
                        onSelect={fields.period.onChange}
                        placeholder="Период"
                        inputProps={{mode: 'stroke'}}
                        data={TimeframeTypes}
                    />
                </div>
                <div className="mt-5">
                    <Select
                        withClearButton
                        placeholder="Тип сырья"
                        inputProps={{mode: 'stroke'}}
                        data={applicationRecyclableStatusSelectValues}
                        onSelect={fields.application_recyclable_status_tab.onChange}
                        value={fields.application_recyclable_status_tab.value}
                    />

                </div>
                <div className="mt-5">
                    <Select
                        withClearButton
                        value={fields.deal_type_select.value}
                        //@ts-ignore
                        onSelect={fields.deal_type_select.onChange}
                        placeholder="Тип заявки"
                        inputProps={{mode: 'stroke'}}
                        data={dealTypeSelectValues}
                    />
                </div>
                <div className="mt-5">
                    <Select
                        value={fields.urgency_type_select.value}
                        onSelect={fields.urgency_type_select.onChange}
                        placeholder="Тип срочности"
                        inputProps={{mode: 'stroke'}}
                        data={urgencyTypeSelectValues}
                    />
                </div>
                <div className="mt-5">
                    <AsyncSelect
                        value={fields.recyclables.value}
                        placeholder="Тип вторсырья"
                        inputProps={{mode: 'stroke'}}
                        loadData={recyclablesSelectApi}
                        onSelect={fields.recyclables.onChange}
                    />
                </div>

            </div>
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setLocationFilters(!locationFilters)}
                >Фильтры по локации
                </h4>
            </div>
            {(locationFilters && (isLaptop || isMobile)) &&
                <div className="mt-6">
                    <AsyncSelect
                        placeholder="Город"
                        inputProps={{mode: 'stroke'}}
                        withClearButton
                        onSelect={fields.city.onChange}
                        value={fields.city.value}
                        loadData={citySelectApi}
                    />
                    <div className="mt-5">
                        <AsyncSelect
                            value={fields.region.value}
                            withClearButton
                            onSelect={fields.region.onChange}
                            placeholder="Регион"
                            inputProps={{mode: 'stroke'}}
                            loadData={regionSelectApi}
                        />
                    </div>
                    <div className="mt-5">
                        <AsyncSelect
                            value={fields.district.value}
                            withClearButton
                            onSelect={fields.district.onChange}
                            placeholder="Округ"
                            inputProps={{mode: 'stroke'}}
                            loadData={districtSelectApi}
                        />
                    </div>
                </div>

            }
            {(!isLaptop && !isMobile) &&
                <div className="mt-6">
                    <AsyncSelect
                        placeholder="Город"
                        inputProps={{mode: 'stroke'}}
                        withClearButton
                        onSelect={fields.city.onChange}
                        value={fields.city.value}
                        loadData={citySelectApi}
                    />
                    <div className="mt-5">
                        <AsyncSelect
                            value={fields.region.value}
                            withClearButton
                            onSelect={fields.region.onChange}
                            placeholder="Регион"
                            inputProps={{mode: 'stroke'}}
                            loadData={regionSelectApi}
                        />
                    </div>
                    <div className="mt-5">
                        <AsyncSelect
                            value={fields.district.value}
                            withClearButton
                            onSelect={fields.district.onChange}
                            placeholder="Округ"
                            inputProps={{mode: 'stroke'}}
                            loadData={districtSelectApi}
                        />
                    </div>
                </div>
            }
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setAppConditionsFilters(!appConditionsFilters)}
                >
                    Фильтры по условиям объявления
                </h4>
            </div>
            {(appConditionsFilters && (isLaptop || isMobile)) && <div className="mt-6">
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.price__gte.value}
                        onChange={fields.price__gte.onChange}
                        mode="stroke"
                        placeholder="Цена за кг от"
                    />
                    <BaseInput
                        value={fields.price__lte.value}
                        onChange={fields.price__lte.onChange}
                        mode="stroke"
                        placeholder="Цена за кг до"
                    />
                </div>
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.total_weight__gte.value}
                        onChange={fields.total_weight__gte.onChange}
                        mode="stroke"
                        placeholder="Объём кг от"
                    />
                    <BaseInput
                        value={fields.total_weight__lte.value}
                        onChange={fields.total_weight__lte.onChange}
                        mode="stroke"
                        placeholder="Объём кг до"
                    />
                </div>
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.bale_weight__gte.value}
                        onChange={fields.bale_weight__gte.onChange}
                        mode="stroke"
                        placeholder="Вес одной кипы кг от"
                    />
                    <BaseInput
                        value={fields.bale_weight__lte.value}
                        onChange={fields.bale_weight__lte.onChange}
                        mode="stroke"
                        placeholder="Вес одной кипы кг до"
                    />
                </div>
            </div>}
            {(!isLaptop && !isMobile) && <div className="mt-6">
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.price__gte.value}
                        onChange={fields.price__gte.onChange}
                        mode="stroke"
                        placeholder="Цена за кг от"
                    />
                    <BaseInput
                        value={fields.price__lte.value}
                        onChange={fields.price__lte.onChange}
                        mode="stroke"
                        placeholder="Цена за кг до"
                    />
                </div>
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.total_weight__gte.value}
                        onChange={fields.total_weight__gte.onChange}
                        mode="stroke"
                        placeholder="Объём кг от"
                    />
                    <BaseInput
                        value={fields.total_weight__lte.value}
                        onChange={fields.total_weight__lte.onChange}
                        mode="stroke"
                        placeholder="Объём кг до"
                    />
                </div>
                <div className="flex gap-[14px] mt-5">
                    <BaseInput
                        value={fields.bale_weight__gte.value}
                        onChange={fields.bale_weight__gte.onChange}
                        mode="stroke"
                        placeholder="Вес одной кипы кг от"
                    />
                    <BaseInput
                        value={fields.bale_weight__lte.value}
                        onChange={fields.bale_weight__lte.onChange}
                        mode="stroke"
                        placeholder="Вес одной кипы кг до"
                    />
                </div>
            </div>}
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setAppStatusFilters(!appStatusFilters)}
                >
                    Фильтры по статусу объявлений
                </h4>
            </div>
            {(appStatusFilters && (isLaptop || isMobile)) && <div className="mt-6">
                <Select
                    onSelect={fields.status.onChange}
                    value={fields.status.value}
                    inputProps={{mode: 'stroke'}}
                    placeholder="Статус объявлений"
                    data={applicationStatusForUsersSelectValues}
                />
            </div>}
            {((!isLaptop && !isMobile)) && <div className="mt-6">
                <Select
                    onSelect={fields.status.onChange}
                    value={fields.status.value}
                    inputProps={{mode: 'stroke'}}
                    placeholder="Статус объявлений"
                    data={applicationStatusForUsersSelectValues}
                />
            </div>}
        </div>
    );
};
