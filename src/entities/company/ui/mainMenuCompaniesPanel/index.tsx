import React from "react";
import {useGate, useStore} from "effector-react";
import {$recyclablesCategory, gate} from "@box/entities/category/model";
import {$recyclablesApplicationsPrices} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {useScreenSize} from "@box/shared/hooks";
import {useForm} from "@box/shared/effector-forms";

import {AsyncSelect, SearchInput, Select, TabSelect} from "@box/shared/ui";
import {citySelectApi} from "@box/entities/city";
import {CompanyRowForCompaniesPanel, companyStatusSelectValues} from "@box/entities/company";
import s from "@box/pages/home/style.module.scss";
import {

    companyRatingSelectValues,
    dealTypeSelectValues,
    ndsTaxSelectValues,
    TimeframeTypes
} from "@box/entities/application";
import classNames from "classnames";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";


export const CompaniesMainMenuPanel = () => {

    useGate(gate);

    const recyclableCategories = useStore($recyclablesCategory);
    const recyclables = useStore($recyclablesApplicationsPrices);

    const {fields} = useForm(mainMenuApplicationFilters);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    return (
        <div className={s.filter_panel}>
            <div className={'fixed w-[350px]'}>
                <div className={'w-auto mt-6 mb-6'}>
                    <h1 className='text-white'>Компании</h1>
                </div>
                <h4 className="text-white mt-6">Базовые
                    фильтры</h4>
                <div className='w-auto mt-6'>
                    <TabSelect
                        onChange={fields.deal_type_tab.onChange}
                        values={dealTypeSelectValues}
                        value={fields.deal_type_tab.value}
                    />
                </div>
                <div className='w-auto mt-6'>
                    <TabSelect
                        onChange={fields.period_tab.onChange}
                        values={TimeframeTypes}
                        value={fields.period_tab.value}
                    />
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
                    <Select
                        onSelect={fields.companies_trust.onChange}
                        value={fields.companies_trust.value}
                        inputProps={{mode: 'stroke'}}
                        placeholder="Доверие к компании"
                        data={companyStatusSelectValues}
                    />
                </div>
                <h4 className="text-white mt-6">Фильтры по
                    статусам компании на бирже</h4>
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
                        className={s.field}
                        inputProps={{mode: 'stroke'}}
                        value={fields.company_rating.value}
                        placeholder="Рейтинг компании"
                        data={companyRatingSelectValues}
                        onSelect={fields.company_rating.onChange}
                    />
                </div>
            </div>
            <div className={!isMobile ? "relative left-[47%] w-[600px]" : ""}>
                <div className="mt-4 w-full mb-5">
                    <SearchInput mode="stroke"
                                 className={classNames('max-w-[400px] w-full', s.search)}
                                 value={fields.search.value}
                                 placeholder="Поиск по фракциям вторсырья..."
                                 onChange={fields.search.onChange}/>
                </div>
                    {recyclableCategories.length > 0 && recyclableCategories
                        .filter(recyclableCategory => fields.search?.value.length > 0 ?
                            recyclableCategory?.name.toLowerCase().indexOf(fields.search?.value.split(' ')[0].toLowerCase()) > -1 : recyclableCategory)
                        .map((recyclableCategory) => (
                            <CompanyRowForCompaniesPanel recyclableCategory={recyclableCategory}
                                                         recyclables={recyclables}
                                                         key={recyclableCategory.id}/>))}
            </div>
        </div>
    )
}