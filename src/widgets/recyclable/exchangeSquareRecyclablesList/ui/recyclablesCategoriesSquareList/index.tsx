import {Button, Container, Loader} from "@box/shared/ui";
import {useGate, useStore} from "effector-react";
import {
    $categoriesWithStatistics,
    categoriesWithStatisticsGate
} from "@box/entities/category/model";
import React, {useEffect, useState} from "react";
import {CategoryWithStatisticsRow} from "@box/entities/category";
import classNames from "classnames";
import s from '../styles.module.scss';
import {ICategoriesWithStatistics} from "@box/entities/recyclable/model";
import {RecyclablesSquareList} from "@box/widgets/recyclable/exchangeSquareRecyclablesList/ui";
import {useForm} from "@box/shared/effector-forms";
import {exchangeRecyclablesListFiltersModel} from "@box/features/recyclable";

export interface ICategoryForExchangeRow {
    id: number;
    category: string;
    salesTotalVolume: number;
    purchaseTotalVolume: number;
}

export const ExchangeSquareRecyclablesCategoryList = () => {
    const twoLastContracts = useStore($categoriesWithStatistics);
    useGate(categoriesWithStatisticsGate)
    const [currentCategory, setCurrentCategory] = useState<ICategoryForExchangeRow>({
        id: 0,
        category: '',
        salesTotalVolume: 0,
        purchaseTotalVolume: 0
    });
    const [curCategory, setCurCategory] = useState<ICategoriesWithStatistics | null>(null)
    const {fields} = useForm(exchangeRecyclablesListFiltersModel.filters);

    const categoryPercent = (category: ICategoriesWithStatistics) => {
        const percentage = (category.purchaseTotalVolume - category.salesTotalVolume) / category.purchaseTotalVolume * 100;
        if (percentage > 0) {

            return +(percentage).toFixed(0)
        }
        if (percentage < 0) {

            return +(percentage).toFixed(0)
        }
        return 0
    };

    const sortedCategoriesList = () => {
        return twoLastContracts
            .sort((a, b) => b.purchaseTotalVolume - a.purchaseTotalVolume)
    };

    const configHandler = (category: ICategoriesWithStatistics /*categoryId: number, categoryName: string, categorySales: number, categoryPurchase: number*/) => {
        // setCurrentCategory({
        //     id: categoryId,
        //     category: categoryName,
        //     salesTotalVolume: categorySales,
        //     purchaseTotalVolume: categoryPurchase,
        // });
        setCurCategory(category);
        fields.category.onChange({
            id: category.id,
            label: category.name,
            value: category.id
        });
        fields.urgency_type.onChange({
            id: 2,
            label: 'Контракт на поставку',
            value: 2
        });
    }

    useEffect(() => {
    }, [twoLastContracts, currentCategory, curCategory]);
    if (twoLastContracts.length === 0) {
        return (
            <div>
                <Loader center className="my-[100px]"/>
            </div>
        )

    }
    return (
        <Container>
            {
                curCategory === null &&
                <div>
                    <h3 className="font-bold">Категории</h3>
                    <div className="inline-flex mt-10">
                        {twoLastContracts.length >= 4 && sortedCategoriesList().slice(0, 4).map(category => (
                            <div
                                key={category.id}
                                onClick={() => configHandler(category)}
                                className={categoryPercent(category) < 0 &&
                                categoryPercent(category) > -10 ?
                                    classNames(s.category_block_1, "bg-[#FF8B8B]") :
                                    categoryPercent(category) < -10 ?
                                        classNames(s.category_block_1, "bg-[#EC5D5D]") :
                                        categoryPercent(category) >= 0 &&
                                        categoryPercent(category) < 10 ?
                                            classNames(s.category_block_1, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                            classNames(s.category_block_1, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                                <CategoryWithStatisticsRow category={category} currentBlock={1}/>
                            </div>
                        ))}
                    </div>
                    <div className="inline-flex mt-1">
                        {twoLastContracts.length >= 8 && sortedCategoriesList().slice(4, 9).map(category => (
                            <div
                                key={category.id}
                                onClick={() => configHandler(category)}
                                className={categoryPercent(category) < 0 &&
                                categoryPercent(category) > -10 ?
                                    classNames(s.category_block_2, "bg-[#FF8B8B]") :
                                    categoryPercent(category) < -10 ?
                                        classNames(s.category_block_2, "bg-[#EC5D5D]") :
                                        categoryPercent(category) >= 0 &&
                                        categoryPercent(category) < 10 ?
                                            classNames(s.category_block_2, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                            classNames(s.category_block_2, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                                <CategoryWithStatisticsRow category={category} currentBlock={2}/>
                            </div>
                        ))}
                    </div>
                    <div className="inline-flex mt-1">
                        {twoLastContracts.length >= 14 && sortedCategoriesList().slice(9, 15).map(category => (
                            <div
                                key={category.id}
                                onClick={() => configHandler(category)}
                                className={categoryPercent(category) < 0 &&
                                categoryPercent(category) > -10 ?
                                    classNames(s.category_block_3, "bg-[#FF8B8B]") :
                                    categoryPercent(category) < -10 ?
                                        classNames(s.category_block_3, "bg-[#EC5D5D]") :
                                        categoryPercent(category) >= 0 &&
                                        categoryPercent(category) < 10 ?
                                            classNames(s.category_block_3, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                            classNames(s.category_block_3, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                                <CategoryWithStatisticsRow category={category} currentBlock={3}/>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {curCategory !== null && curCategory.id > 0 &&
                <div>
                    <Button
                        onClick={() => setCurCategory(null)}
                        mode="light"
                        type="micro"
                        fullWidth>
                        Вернуться к категориям
                    </Button>
                    <RecyclablesSquareList category={curCategory}/>
                </div>
            }
        </Container>
    )
}