import {useStore} from "effector-react";
import {$allApplicationsWithoutPages, IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import {$recyclablesApplicationsPrices} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {$recyclablesCategory} from "@box/entities/category/model";
import {CompaniesStatsCircleGraphics} from "@box/entities/statistics";
import s from './style.module.scss';
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Select} from "@box/shared/ui";
import {
    applicationRecyclableStatusSelectValues,
    companyActivityTypesSelectValues,
    TimeframeTypes
} from "@box/entities/application";
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {IGraphicsData} from "@box/entities/statistics/recyclablesVolumeStats/ui/types";


export const RecyclablesCircleMainStatisticsCart = () => {
    const applications = useStore($allApplicationsWithoutPages);
    const recyclables = useStore($recyclablesApplicationsPrices);
    const recyclablesCategory = useStore($recyclablesCategory);

    const [subCategory, setSubCategory] = useState<IGraphicsData>({name: '', id: 0, value: 0});
    const [category, setCategory] = useState<IGraphicsData>({name: '', id: 0, value: 0});

    const f = useForm(applicationFiltersForMainPageChart);

    const router = useRouter();


    const colors = [
        '#F5005A',
        '#D3FF3D',
        '#0068C3',
        '#C3005B',
        '#E41818',
        '#19CAEE',
        '#FFE91C',
        '#BC1CFF',
        '#1CFF3B',
        '#FF1C59',
        '#11FF00',
        '#4039FF',
        '#E5FF39',
        '#FF39D8',
        '#FF5500',
        '#00FF6F',
        '#5BFFDF',
        '#C4FF5B',
        '#5B77FF',
        '#A85BFF',
        '#13C300',
        '#C30027',
        '#2BFF00',
        '#CD57FF',
        '#FF5784',
        '#FAD900',
    ]

    //для получения категорий для графиков
    const dataCategories = (applications: IRecyclableApplicationShortForAll[]/*IRecyclableApplication[]*/) => {
        const list = []
        for (let i = 0; i < recyclablesCategory.length; i++) {
            const category = {
                value: 0,
                name: recyclablesCategory[i]?.name,
                fill: colors[i],
                id: recyclablesCategory[i]?.id,
            }
            for (let j = 0; j < applications.length; j++) {
                if (!list.map(elem => elem.id).includes(category.id)) {
                    if (applications[j].recyclables?.category?.id === recyclablesCategory[i]?.id) {
                        category.value += +(applications[j].totalWeight / 1000).toFixed(1)
                    }
                }
            }
            list.push(category);
        }
        return list.filter(category => category.value > 0).sort((a, b) => b.value - a.value);
    }

    //для получения фракций конкретной категории для графиков
    const dataFractions = (applications: IRecyclableApplicationShortForAll[], categoryId: number) => {
        const list = []
        const currentRecyclable = recyclables
            .filter(recyclable => recyclable.category === categoryId)
        for (let i = 0; i < currentRecyclable.length; i++) {
            const category = {
                value: 0,
                name: currentRecyclable[i]?.name,
                fill: colors[i],
                id: currentRecyclable[i]?.id,
                subCategory: true
            }
            for (let j = 0; j < applications.length; j++) {
                if (!list.map(elem => elem.id).includes(category.id)) {
                    if (applications[j].recyclables?.id === currentRecyclable[i]?.id) {
                        category.value += +(applications[j].totalWeight / 1000).toFixed(1)
                    }
                }
            }
            list.push(category);
        }
        return list.filter(category => category.value > 0).sort((a, b) => b.value - a.value);
    }

    //для получения фракций конкретной категории для графиков
    const dataCompanies = (applications: IRecyclableApplicationShortForAll[], subCategoryId: number/*, companyTypeId: number*/) => {
        const list = []

        const currentCompanies = applications
            .filter(app => app.recyclables?.id === subCategoryId)
            .map(app => app.company)
        for (let i = 0; i < currentCompanies.length; i++) {
            const company = {
                value: 0,
                name: currentCompanies[i]?.name,
                fill: colors[i],
                id: currentCompanies[i]?.id,
                company: true
            }
            for (let j = 0; j < applications.length; j++) {
                if (!list.map(elem => elem.id).includes(company.id)) {
                    if (applications[j].company?.id === currentCompanies[i]?.id) {
                        company.value += +(applications[j].totalWeight / 1000).toFixed(1)
                    }
                }
            }
            list.push(company);
        }
        return list.filter(company => company.value > 0).sort((a, b) => b.value - a.value);
    }

    const categoryHandler = (data: IGraphicsData) => {
        setCategory(data)
        return category
    }
    const subCategoryHandler = (data: IGraphicsData) => {
        setSubCategory(data)
        return subCategory
    }

    useEffect(() => {
    }, [category, subCategory]);

    return (
        <div>
            <div className="block">
            <div className='w-auto ml-5 inline-flex'>
                <Select
                    inputProps={{mode: "stroke"}}
                    placeholder={'Период'}
                    className="w-130"
                    onSelect={f.fields.period_tab.onChange}
                    data={TimeframeTypes}
                    value={f.fields.period_tab.value}
                />
                <Select
                    className="w-130 ml-5"
                    withClearButton
                    inputProps={{mode: 'stroke'}}
                    value={f.fields.company_activity_types.value}
                    placeholder="Тип компании"
                    onSelect={f.fields.company_activity_types.onChange}
                    data={companyActivityTypesSelectValues}
                />
                <Select
                    inputProps={{mode: "stroke"}}
                    placeholder={'Тип продукции'}
                    className="w-130 ml-5"
                    onSelect={f.fields.application_recyclable_status_tab.onChange}
                    data={applicationRecyclableStatusSelectValues}
                    value={f.fields.application_recyclable_status_tab.value}
                />
            </div>
            </div>
            <div className="mt-8 inline-flex">
                {category.id > 0 &&
                    <div>
                        <Button
                            onClick={() => {
                                setCategory({name: '', id: 0, value: 0});
                                setSubCategory({name: '', id: 0, value: 0});
                            }}
                            mode='light'>{`Объём категории ${category.name} ${category.value} тонн`}</Button>
                    </div>
                }
                {category.id > 0 && subCategory.id > 0 &&
                    <div className="ml-7">
                        <Button
                            onClick={() => {
                                setSubCategory({name: '', id: 0, value: 0});
                            }}
                            mode='light'>{`Объём фракции ${subCategory.name} ${subCategory.value} тонн`}</Button>
                    </div>
                }
            </div>
            {category.id === 0 &&
                <div className="mt-10 inline-flex w-full">
                    <div className="w-2/3">
                        <CompaniesStatsCircleGraphics
                            category={categoryHandler}
                            subCategory={subCategoryHandler}
                            data={dataCategories(applications)}></CompaniesStatsCircleGraphics>
                    </div>
                    <div className="ml-4 w-1/3 h-auto">
                        {dataCategories(applications).map(category => (
                            <div
                                onClick={() => setCategory({id: category.id, value: category.value, name: category.name})}
                                style={{background: category.fill}}
                                className={s.item}>
                                <p>
                                    {`${category.name} ${category.value}т`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {(category.id > 0 && subCategory.id === 0) &&
                <div className="mt-10 inline-flex w-full">
                    <div className="w-3/4">
                        <CompaniesStatsCircleGraphics
                            category={categoryHandler}
                            subCategory={subCategoryHandler}
                            //companyType={companyTypeHandler}
                            data={dataFractions(applications, category.id)}></CompaniesStatsCircleGraphics>
                    </div>
                    <div className="ml-4 w-2/3 h-auto">
                        {dataFractions(applications, category.id).map(subCategory => (
                            <div
                                onClick={() => setSubCategory({id: subCategory.id, value: subCategory.value, name: subCategory.name})}
                                style={{background: subCategory.fill}}
                                className={s.item}>
                                <p>
                                    {`${subCategory.name} ${subCategory.value}т`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {(category.id > 0 && subCategory.id > 0) &&
                <div className="mt-10 inline-flex w-full">
                    <div className="w-3/4">
                        <CompaniesStatsCircleGraphics
                            category={categoryHandler}
                            subCategory={subCategoryHandler}
                            //companyType={companyTypeHandler}
                            data={dataCompanies(applications, subCategory.id)}></CompaniesStatsCircleGraphics>
                    </div>
                    <div className="ml-4 w-2/3 h-auto">
                        {dataCompanies(applications, subCategory.id).map(company => (
                            <div
                                onClick={() => router.push(`/companies/${company.id}/`)}
                                style={{background: company.fill}}
                                className={s.item}>
                                <p>
                                    {`${company.name} ${company.value}т`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}