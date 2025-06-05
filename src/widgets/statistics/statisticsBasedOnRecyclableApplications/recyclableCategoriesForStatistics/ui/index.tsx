import React, {useEffect, useState} from "react";
import {useGate, useStore} from "effector-react";
import {
    $allApplicationsWithoutPages
} from "@box/entities/application/model";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";

import {BuyOrSellDeals} from "@box/entities/deal/model";
import s from "@box/widgets/recyclable/stockMarketRecyclableTables/ui/styles.module.scss";
import {
    RecyclableApplicationsForStatistics
} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications/recyclableFractionsForStatistics";
import classNames from "classnames";
import {ICompanyShortForAll} from "@box/entities/company/model";
import {
    CompanyForStatisticsRow
} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications/companyForStatisticsRow";
import {AsyncSelect, Tip} from "@box/shared/ui";
import {recyclablesSelectApi} from "@box/entities/company";
import {useForm} from "@box/shared/effector-forms";
import {filters} from "@box/features/company/filters/companies/model";
import {citySelectApi} from "@box/entities/city";
import {
    CompaniesWithFractionsType,
    RecyclableCategoriesForStatisticsType,
    RecyclableColorType, VolumesType
} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications";


export const RecyclableCategoriesForStatistics: React.FC<RecyclableCategoriesForStatisticsType> = ({
                                                                                                       categories,
                                                                                                   }) => {
    const applications = useStore($allApplicationsWithoutPages);
    useGate(applicationsWithPeriodWithoutPagesGate);

    const [currentCategory, setCurrentCategory] = useState<number>(0);
    const [currentCompaniesCategory, setCurrentCompaniesCategory] = useState<number>(0);

    const [cityFilter, setCityFilter] = useState<string>('');
    const [fractionFilter, setFractionFilter] = useState<string>('');

    const {fields} = useForm(filters);

    const recyclableCategoryVolume = (categoryId: number): VolumesType => {
        const filtered_apps = applications
            .filter(app => app.recyclables.category.id === categoryId);

        const filtered_buy = applications
            .filter(app => app.recyclables.category.id === categoryId && app?.dealType?.id === BuyOrSellDeals.BUY);
        const filtered_sell = (applications
            .filter(app => app.recyclables.category.id === categoryId && app?.dealType?.id === BuyOrSellDeals.SELL));

        return {
            totalVolume: +(filtered_apps
                .map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
            buyVolume: +(filtered_buy.map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
            sellVolume: +(filtered_sell.map(app => app.totalWeight)
                .reduce((sum, a) => sum + a, 0) / 1000)
                .toFixed(),
        };
    };

    const uniqCompanies = (categoryId: number) => {
        const uniqCompaniesList = applications
            .filter(app => app.recyclables.category?.id === categoryId)
            .map(app => app.company)
        //.map(app => app.company.id)
        //.filter((item, index, arr) => arr
        //.indexOf(item) === index)
        const list: ICompanyShortForAll[] = []
        for (let i = 0; i < uniqCompaniesList.length; i++) {
            if (!list.map(company => company.id).includes(uniqCompaniesList[i].id)) {
                list.push(uniqCompaniesList[i])
            }
        }
        return list;
    }

    const applicationsCount = (categoryId: number) => {
        return applications.filter(app => app.recyclables.category?.id === categoryId).length;
    }

    const filtered_recyclableCategory = (str?: string): Array<RecyclableColorType> => {
        const result = []
        for (let i = 0; i < categories.length; i++) {
            const recCat = categories[i];
            const totalVolume = recyclableCategoryVolume(recCat.id);
            if (str) {
                let dealType: number
                if (str === "BUY") {
                    dealType = BuyOrSellDeals.BUY
                }
                if (str === "SELL") {
                    dealType = BuyOrSellDeals.SELL
                }
                const allVolume = applications
                    .filter(app => app.recyclables.category.id === recCat.id && app?.dealType?.id === dealType).length > 0 ? applications
                    .filter(app => app.recyclables.category.id === recCat.id && app?.dealType?.id === dealType)
                    .map(app => app.totalWeight)
                    .reduce((sum, a) => sum + a, 0) / 1000 : 0;
                const percents = allVolume > 0 ? `${((allVolume / totalVolume.totalVolume) * 100).toFixed(2)}%` : '--'
                result.push({
                    recyclableCategory: recCat,
                    totalVolume: {
                        totalVolume: totalVolume.totalVolume,
                        buyVolume: totalVolume.buyVolume,
                        sellVolume: totalVolume.sellVolume,
                    },
                    percents: percents
                })
            } else {
                result.push({
                    recyclableCategory: recCat,
                    totalVolume: {
                        totalVolume: totalVolume.totalVolume,
                        buyVolume: totalVolume.buyVolume,
                        sellVolume: totalVolume.sellVolume,
                    },
                    percents: '--'
                })
            }
        }
        return result.sort((a, b) => b.totalVolume.totalVolume - a.totalVolume.totalVolume);
    }


    const companiesWithTheirFractionsList = (categoryId: number): Array<CompaniesWithFractionsType> => {
        const list: Array<CompaniesWithFractionsType> = [];
        const currentApplications = applications.filter(app => app.recyclables.category?.id === categoryId);
        for (let i = 0; i < uniqCompanies(categoryId).length; i++) {
            const recs = currentApplications
                .filter(app => app.company.id === uniqCompanies(categoryId)[i].id)
                .map(app => app.recyclables)
            const apps = currentApplications
                .filter(app => app.company.id === uniqCompanies(categoryId)[i].id)
            list.push({company: uniqCompanies(categoryId)[i], fractions: [...recs], applications: [...apps]});
        }
        return list;
    };

    useEffect(() => {
    }, [categories, currentCategory, currentCompaniesCategory, cityFilter, fractionFilter, applications]);

    return (
        <div className="mt-6">
            <Tip>
                <p>
                    Фильтры вторсырья и городов осуществляют фильтрацию именно компаний, так при фильтрации по
                    вторсырью остаются компании, у которые занимаются данным сырьём
                </p>
            </Tip>
            <div className="mt-6 inline-flex">
                <div>
                    <AsyncSelect
                        withClearButton
                        loadData={recyclablesSelectApi}
                        inputProps={{mode: 'stroke'}}
                        //value={fields.recyclables__recyclables.value}
                        onSelect={(e) => {
                            //@ts-ignore
                            setFractionFilter(e?.value?.name)
                        }}
                        className={classNames(s.field, 'w-[400px] shrink-0')}
                        placeholder="Тип вторсырья"
                    />
                </div>
                <div className="ml-24">
                    <AsyncSelect
                        withClearButton
                        onSelect={(e) => {
                            //@ts-ignore
                            setCityFilter(e?.value?.name)
                        }}
                        inputProps={{mode: 'stroke'}}
                        //value={fields.city.value}
                        loadData={citySelectApi}
                        className={classNames(s.field_city, 'w-[400px] shrink-0')}
                        placeholder="Город"
                    />
                </div>
            </div>
            {categories?.length > 0 && filtered_recyclableCategory()
                .map((recyclableCategory) => (
                    <div
                        className={s.category_main_page}
                        key={recyclableCategory?.recyclableCategory?.id}>
                        <tbody>
                        <tr className="inline-flex">
                            <td
                                onClick={() => {
                                    setCurrentCategory(currentCategory !== recyclableCategory.recyclableCategory.id ?
                                        recyclableCategory.recyclableCategory.id : 0)
                                    setCurrentCompaniesCategory(0)
                                }}
                                className={classNames(s.category_title_statistics, recyclableCategory?.recyclableCategory?.id === currentCategory ?
                                    "bg-black text-white p-2 rounded-[10px]" : "")}>
                                {recyclableCategory?.recyclableCategory?.name}
                            </td>


                            <td className="ml-6 text-lg mt-[3px] w-36">
                                {`Покупка ${recyclableCategory?.totalVolume.buyVolume}т`}
                            </td>
                            <td className="ml-4 text-lg mt-[3px] w-36">
                                {`Продажа ${recyclableCategory?.totalVolume.sellVolume}т`}
                            </td>


                            <td className="ml-4 text-lg mt-[3px] w-36">
                                {`Общий ${recyclableCategory?.totalVolume.totalVolume}т`}
                            </td>
                            <td
                                onClick={() => {
                                    setCurrentCompaniesCategory(currentCompaniesCategory !== recyclableCategory.recyclableCategory.id ?
                                        recyclableCategory.recyclableCategory.id : 0)
                                    setCurrentCategory(0)
                                }}
                                className={classNames(s.category_title_statistics, recyclableCategory?.recyclableCategory?.id === currentCompaniesCategory ?
                                    "bg-black text-white p-2 rounded-[10px] ml-16 w-44" : "ml-6 w-40")}>
                                {`Компаний - ${uniqCompanies(recyclableCategory?.recyclableCategory?.id)?.length}`}
                            </td>
                            <td className="ml-6 text-lg mt-[3px] w-48">
                                {`Контрактов на поставку - ${applicationsCount(recyclableCategory?.recyclableCategory?.id)}`}
                            </td>
                        </tr>
                        </tbody>
                        {(currentCategory === recyclableCategory.recyclableCategory.id && categories && currentCompaniesCategory === 0) &&
                            <div className="inline-flex">
                                <div className="mt-6">
                                    <p>ПОКУПКА</p>
                                    <div className="mt-4 w-[500px]" key={recyclableCategory?.recyclableCategory?.id}>
                                        <RecyclableApplicationsForStatistics
                                            buy={true}
                                            sell={false}
                                            applications={applications}
                                            categoryId={recyclableCategory?.recyclableCategory?.id}></RecyclableApplicationsForStatistics>
                                    </div>
                                </div>
                                <div className="mt-6 ml-20">
                                    <p>ПРОДАЖА</p>
                                    <div className="mt-4 w-[500px]" key={recyclableCategory?.recyclableCategory?.id}>
                                        <RecyclableApplicationsForStatistics
                                            buy={false}
                                            sell={true}
                                            applications={applications}
                                            categoryId={recyclableCategory?.recyclableCategory?.id}></RecyclableApplicationsForStatistics>
                                    </div>
                                </div>
                            </div>}
                        {(companiesWithTheirFractionsList(recyclableCategory.recyclableCategory.id)?.length > 0 &&
                                currentCompaniesCategory === recyclableCategory.recyclableCategory.id && currentCategory === 0) &&
                            companiesWithTheirFractionsList(recyclableCategory.recyclableCategory.id)
                                .filter(item => cityFilter?.length > 0 ? item.company?.city?.name === cityFilter : item)
                                .filter(item => fractionFilter?.length > 0 ? item.fractions
                                    .map(fraction => fraction?.name).includes(fractionFilter) : item)
                                .map(item => (
                                    <div className="mt-6">
                                        <CompanyForStatisticsRow
                                            companiesWithRecyclable={{
                                                company: item.company,
                                                fractions: item.fractions,
                                                applications: item.applications
                                            }}></CompanyForStatisticsRow>
                                    </div>
                                ))

                        }
                    </div>))}
        </div>
    )
}