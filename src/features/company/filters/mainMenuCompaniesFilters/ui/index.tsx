import React, {useEffect, useState} from 'react';
import {
    AsyncSelect, BaseInput,
    Button, DatePicker, Select,
} from '@box/shared/ui';
import {IWithClass} from '@types';
import {useBoolean} from '@box/shared/hooks';
import {
    companyRatingSelectValues,
    dealTypeSelectValues, isCompanyIsJurOrIp, ndsTaxSelectValues,
    TimeframeTypes,
    yesOrNo
} from '@box/entities/application';
import {
    collectionTypeSelectApi,
    companyStatusSelectValues,
    recyclablesSelectApi
} from '@box/entities/company';
import {citySelectApi} from '@box/entities/city';
import {useForm} from '@box/shared/effector-forms';
import {useEvent, useStore} from 'effector-react';
import classNames from "classnames";
import s from './style.module.scss';
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {
    applyMainMenuCompaniesFilters,
    mainMenuCompaniesFilters
} from "@box/features/company/filters/mainMenuCompaniesFilters";
import {regionSelectApi} from "@box/entities/region";
import {districtSelectApi} from "@box/entities/district";


export const MainMenuCompaniesListFilters: React.FC<IWithClass> = () => {

    const {value, toggle} = useBoolean(false);

    const {fields, reset} = useForm(mainMenuCompaniesFilters);

    const applyFilters = useEvent(applyMainMenuCompaniesFilters);
    //@ts-ignore
    const [rec, setRec] = useState<string>('');

    const router = useRouter();
    const queries = router.query

    const defaultFilters = (queries: ParsedUrlQuery) => {
        //@ts-ignore
        const dealType = dealTypeSelectValues.filter(dealType => +dealType?.id === +queries['deal_type'])[0];
        fields.deal_type_select.onChange(dealType)

        //@ts-ignore
        if (queries['category']) {
            recyclablesSelectApi().then(data => {
                //@ts-ignore
                const category = +queries['category']
                //@ts-ignore
                const item = data.filter(item => item?.id === category)[0]
                fields.recyclables.onChange(item);

            })
        }

        //@ts-ignore
        const period = TimeframeTypes.filter(period => period?.label === queries['period'])[0];
        fields.period.onChange(period);

        if (queries['city']) {
            //@ts-ignore
            citySelectApi().then(data => {
                //@ts-ignore
                const city = data.filter(city => +city?.id === +queries['city'])[0];
                fields.city.onChange(city)
            })
        }
        //@ts-ignore
        const nds = ndsTaxSelectValues.filter(n => n?.id === +queries['nds'])[0];
        fields.nds.onChange(nds);

        //@ts-ignore
        const company_trust = companyStatusSelectValues.filter(companyStatus => +companyStatus?.id === +queries['company_status'])[0];
        fields.companies_trust.onChange(company_trust);
        //}
        //@ts-ignore
        const company_rating = companyRatingSelectValues.filter(companyRating => +companyRating?.id === +queries['company_rating'])[0];
        fields.company_rating.onChange(company_rating);

    }

    useEffect(() => {
        defaultFilters(queries)
    }, [queries]);

    return (
        <div className={classNames('shrink-0 w-[230px]')}>
            <div className="sticky z-10 top-[100px]">
                <Button
                    onClick={() => {
                        reset();
                        toggle();
                    }}
                    className="grow"
                    mode="light"
                    fullWidth={true}
                >
                    Сбросить
                </Button>
                <Button
                    onClick={() => {
                        applyFilters();
                        //toggle();
                    }}
                    className="grow mt-[15px]"
                    fullWidth={true}
                >
                    Применить
                </Button>
            </div>
            <div className={s.title_for_filters}>
                <h4>Базовые фильтры</h4>
            </div>

            <div className="mt-5">
                <DatePicker
                    inputStyle={"w-auto"}
                    mode="stroke"
                    value={fields.created_at.value}
                    onChange={fields.created_at.onChange}
                    placeholder={'Дата создания на бирже'}
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
                    value={fields.deal_type_select.value}
                    onSelect={fields.deal_type_select.onChange}
                    placeholder="Тип заявки"
                    inputProps={{mode: 'stroke'}}
                    data={dealTypeSelectValues}
                />
            </div>
            <div className="mt-5">
                <AsyncSelect
                    value={fields.recyclables.value}
                    placeholder="Тип вторсырья"
                    inputProps={{mode: 'stroke'}}
                    loadData={recyclablesSelectApi}
                    onSelect={(e) => {
                        //@ts-ignore
                        setRec(e?.label)
                        fields.recyclables.onChange(e)
                    }}
                />
            </div>
            <div className={s.title_for_filters}>
                <h4>Фильтры по локации</h4>
            </div>
            <div className="mt-6">
                <AsyncSelect
                    placeholder="Город"
                    inputProps={{mode: 'stroke'}}
                    withClearButton
                    onSelect={fields.city.onChange}
                    value={fields.city.value}
                    loadData={citySelectApi}
                />
            </div>
            <div className="mt-5">
                <AsyncSelect
                    withClearButton
                    onSelect={fields.region.onChange}
                    inputProps={{mode: 'stroke'}}
                    value={fields.region.value}
                    loadData={regionSelectApi}
                    placeholder="Регион"
                />
            </div>
            <div className="mt-5">
                <AsyncSelect
                    withClearButton
                    onSelect={fields.district.onChange}
                    inputProps={{mode: 'stroke'}}
                    value={fields.district.value}
                    loadData={districtSelectApi}
                    placeholder="Округ"
                />
            </div>

            <div className={s.title_for_filters}>
                <h4>Фильтры по статусам компании на бирже</h4>
            </div>
            <div className="mt-6">
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
            <div className="mt-6">
                <Select
                    onSelect={fields.companies_trust.onChange}
                    value={fields.companies_trust.value}
                    inputProps={{mode: 'stroke'}}
                    placeholder="Доверие к компании"
                    data={companyStatusSelectValues}
                />
            </div>
            <div className="mt-6">
                <Select
                    className={s.field}
                    inputProps={{mode: 'stroke'}}
                    value={fields.company_rating.value}
                    placeholder="Рейтинг компании"
                    onSelect={fields.company_rating.onChange}
                    data={companyRatingSelectValues}
                />
            </div>
            <div className={s.title_for_filters}>
                <h4>Фильтры по сделкам компаний</h4>
            </div>
            <div className="flex gap-[14px] mt-5">
                <BaseInput
                    value={fields.company_deals_number.value}
                    onChange={fields.company_deals_number.onChange}
                    mode="stroke"
                    placeholder="Мин. кол-во сделок"
                />
            </div>
            <div className="flex gap-[14px] mt-5">
                <BaseInput
                    value={fields.company_volume.value}
                    onChange={fields.company_volume.onChange}
                    mode="stroke"
                    placeholder="Объём сделок"
                />
            </div>
            <div className="mt-5">
                <Select
                    value={fields.company_failed_deals.value}
                    onSelect={fields.company_failed_deals.onChange}
                    placeholder="Отменённые сделки"
                    inputProps={{mode: 'stroke'}}
                    data={yesOrNo}
                />
            </div>
            <div className={s.title_for_filters}>
                <h4>Фильтры по заявкам компаний</h4>
            </div>
            <div className="mt-5">
                <Select
                    value={fields.company_has_applications.value}
                    onSelect={fields.company_has_applications.onChange}
                    placeholder="Есть текущие заявки"
                    inputProps={{mode: 'stroke'}}
                    data={yesOrNo}
                />
            </div>
            <div className="mt-5">
                <Select
                    value={fields.company_has_supply_contract.value}
                    onSelect={fields.company_has_supply_contract.onChange}
                    placeholder="Контракт на поставку"
                    inputProps={{mode: 'stroke'}}
                    data={yesOrNo}
                />
            </div>
            <div className={s.title_for_filters}>
                <h4>Фильтры по параметрам компании</h4>
            </div>
            <div className="mt-5">
                <Select
                    value={fields.nds.value}
                    onSelect={fields.nds.onChange}
                    placeholder="НДС"
                    inputProps={{mode: 'stroke'}}
                    data={ndsTaxSelectValues}
                />
            </div>
            <div className="mt-5">
                <Select
                    value={fields.owner_has_companies.value}
                    onSelect={fields.owner_has_companies.onChange}
                    placeholder="Руководтель более 1 компании"
                    inputProps={{mode: 'stroke'}}
                    data={yesOrNo}
                />
            </div>
            <div className="mt-5">
                <Select
                    value={fields.is_jur_or_ip.value}
                    onSelect={fields.is_jur_or_ip.onChange}
                    placeholder="Юр. лицо или ИП"
                    inputProps={{mode: 'stroke'}}
                    data={isCompanyIsJurOrIp}
                />
            </div>
        </div>
    );
};
