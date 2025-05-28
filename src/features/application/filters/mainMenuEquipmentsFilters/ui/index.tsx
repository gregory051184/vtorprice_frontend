import React, {useEffect, useState} from "react";
import {IWithClass} from "@types";
import {useBoolean, useScreenSize} from "@box/shared/hooks";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {
    companyRatingSelectValues,
    dealTypeSelectValues, ndsTaxSelectValues,
    TimeframeTypes,
    yesOrNo
} from "@box/entities/application";
import {citySelectApi} from "@box/entities/city";
import {useForm} from "@box/shared/effector-forms";
import {useEvent} from "effector-react";
import {equipmentSelectApi} from "@box/entities/application/api/selects/equipmentSelect";
import {AsyncSelect, BaseInput, Button, DatePicker, Select} from "@box/shared/ui";
import s from "@box/features/application/filters/mainMenuApplicationsFilters/ui/style.module.scss";
import {companyStatusSelectValues} from "@box/entities/company";
import {
    applyMainMenuApplicationFilters,
} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";

export const MainMenuEquipmentsListFilters: React.FC<IWithClass> = () => {

    const {value, toggle} = useBoolean(false);
    const {fields, reset} = useForm(mainMenuApplicationFilters);
    const applyFilters = useEvent(applyMainMenuApplicationFilters);

    const [companyParametersFilters, setCompanyParametersFilters] = useState<boolean>(false);
    const [locationFilters, setLocationFilters] = useState<boolean>(false);
    const [appConditionsFilters, setAppConditionsFilters] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const router = useRouter();
    const queries = router.query;

    const defaultFilters = (queries: ParsedUrlQuery) => {
        if (queries['application_type']) {

            //@ts-ignore
            const dealType = dealTypeSelectValues.filter(dealType => +dealType?.id === +queries['deal_type'])[0];
            fields.deal_type_select.onChange(dealType)

            //@ts-ignore
            const period = TimeframeTypes.filter(period => period?.label === queries['period'])[0];
            fields.period.onChange(period);

            //@ts-ignore
            equipmentSelectApi().then(data => {
                //@ts-ignore
                const category = data.filter(category => +category?.id === +queries['category'])[0];
                fields.equipment_category.onChange(category)
            })

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
    }, []);

    return (
        <div className={(!isLaptop && !isMobile) ? 'shrink-0 w-[230px]' : "w-full"}>
            <div className={(!isLaptop && !isMobile) ? "sticky z-10 top-[100px]" : "mt-5"}>
                <Button
                    onClick={() => {
                        reset();
                        toggle();
                    }}
                    className="grow"
                    //mode="light"
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
                <h4>Базовые фильтры</h4>
            </div>
            <div className="mt-6">
                <div>
                    <DatePicker
                        inputStyle={"w-auto"}
                        mode="stroke"
                        placeholder="Дата публикации"
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
                        value={fields.deal_type_select.value}
                        //@ts-ignore
                        onSelect={fields.deal_type_select.onChange}
                        placeholder="Тип заявки"
                        inputProps={{mode: 'stroke'}}
                        data={dealTypeSelectValues}
                    />
                </div>
                <div className="mt-5">
                    <AsyncSelect
                        placeholder="Категория оборудования"
                        inputProps={{mode: 'stroke'}}
                        withClearButton
                        onSelect={fields.equipment_category.onChange}
                        value={fields.equipment_category.value}
                        loadData={equipmentSelectApi}
                    />
                </div>
            </div>
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setLocationFilters(!locationFilters)}
                >Фильтры по локации</h4>
            </div>
            {(locationFilters && (isLaptop || isMobile)) &&
                <div className="mt-6">
                    <div>
                        <AsyncSelect
                            placeholder="Город"
                            inputProps={{mode: 'stroke'}}
                            withClearButton
                            onSelect={fields.city.onChange}
                            value={fields.city.value}
                            loadData={citySelectApi}
                        />
                    </div>
                </div>
            }
            {(!isLaptop && !isMobile) &&
                <div className="mt-6">
                    <div>
                        <AsyncSelect
                            placeholder="Город"
                            inputProps={{mode: 'stroke'}}
                            withClearButton
                            onSelect={fields.city.onChange}
                            value={fields.city.value}
                            loadData={citySelectApi}
                        />
                    </div>
                </div>
            }
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setAppConditionsFilters(!appConditionsFilters)}
                >Фильтры по условиям объявления
                </h4>
            </div>
            {(appConditionsFilters && (isLaptop || isMobile)) &&
                <div className="mt-6">
                    <div>
                        <BaseInput
                            value={fields.price__gte.value}
                            onChange={fields.price__gte.onChange}
                            mode="stroke"
                            placeholder="Цена от"
                        />
                    </div>
                    <div className="mt-5">
                        <BaseInput
                            value={fields.price__lte.value}
                            onChange={fields.price__lte.onChange}
                            mode="stroke"
                            placeholder="Цена до"
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.was_in_use.value}
                            placeholder="Б/У"
                            onSelect={fields.was_in_use.onChange}
                            data={yesOrNo}
                        />
                    </div>
                    <div className="mt-5">
                        <DatePicker
                            inputStyle={"w-auto"}
                            mode="stroke"
                            placeholder="Дата выпуска"
                            value={fields.manufacture_date.value}
                            onChange={fields.manufacture_date.onChange}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.sale_by_part.value}
                            placeholder="По частям"
                            onSelect={fields.sale_by_part.onChange}
                            data={yesOrNo}
                        />
                    </div>
                </div>
            }
            {(!isLaptop && !isMobile) &&
                <div className="mt-6">
                    <div>
                        <BaseInput
                            value={fields.price__gte.value}
                            onChange={fields.price__gte.onChange}
                            mode="stroke"
                            placeholder="Цена от"
                        />
                    </div>
                    <div className="mt-5">
                        <BaseInput
                            value={fields.price__lte.value}
                            onChange={fields.price__lte.onChange}
                            mode="stroke"
                            placeholder="Цена до"
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.was_in_use.value}
                            placeholder="Б/У"
                            onSelect={fields.was_in_use.onChange}
                            data={yesOrNo}
                        />
                    </div>
                    <div className="mt-5">
                        <DatePicker
                            inputStyle={"w-auto"}
                            mode="stroke"
                            placeholder="Дата выпуска"
                            value={fields.manufacture_date.value}
                            onChange={fields.manufacture_date.onChange}
                        />
                    </div>
                    <div className="mt-5">
                        <Select
                            className={s.field}
                            inputProps={{mode: 'stroke'}}
                            value={fields.sale_by_part.value}
                            placeholder="По частям"
                            onSelect={fields.sale_by_part.onChange}
                            data={yesOrNo}
                        />
                    </div>
                </div>
            }
            <div className={s.title_for_filters}>
                <h4
                    onClick={() => setCompanyParametersFilters(!companyParametersFilters)}>
                    Фильтры по параметрам компании
                </h4>
            </div>
            {(companyParametersFilters && (isLaptop || isMobile)) && <div className="mt-6">
                <div>
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
                        placeholder="НДС"
                        inputProps={{mode: 'stroke'}}
                        data={ndsTaxSelectValues}
                    />
                </div>
            </div>
            }
            {
                (!isLaptop && !isMobile) &&
                <div className="mt-6">
                    <div>
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
                            placeholder="НДС"
                            inputProps={{mode: 'stroke'}}
                            data={ndsTaxSelectValues}
                        />
                    </div>
                </div>
            }
        </div>
    )
}