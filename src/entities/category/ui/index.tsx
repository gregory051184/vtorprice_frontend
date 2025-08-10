import React, {useEffect} from "react";
import {ICategoryWithStatisticsRow} from "@box/entities/category/ui/types";
import classNames from "classnames";
import s from "@box/entities/recyclable/ui/exchangeSquareRow/styles.module.scss";


export const CategoryWithStatisticsRow: React.FC<ICategoryWithStatisticsRow & { currentBlock: number }> = ({
                                                                                                               category,
                                                                                                               currentBlock
                                                                                                           }) => {

    const recyclableVolumePercent = (purchaseTotalVolume: number, salesTotalVolume: number) => {

        const percentage = (purchaseTotalVolume - salesTotalVolume) / purchaseTotalVolume * 100;

        if (purchaseTotalVolume === 0) {
            return 'Нет данных'
        }

        if (salesTotalVolume === 0) {
            return 'Без изменений'
        }

        if (percentage > 0) {

            return `+${Math.abs(percentage).toFixed(2)}%`
        }
        if (percentage < 0) {

            return `-${Math.abs(percentage).toFixed(2)}%`
        }
    };

    const currentBlockHandler = (currentBlock: number) => {
        if (currentBlock === 1) {
            return "text-lg"
        }
        if (currentBlock === 2) {
            return "text-sm"
        } else {
            return "text-xs"
        }
    }

    // const categoryPercent = (purchaseTotalVolume: number, salesTotalVolume: number) => {
    //     const percentage = (purchaseTotalVolume - salesTotalVolume) / purchaseTotalVolume * 100;
    //     if (percentage > 0) {
    //
    //         return `+ ${Math.abs(percentage).toFixed(2)}%`
    //     }
    //     if (percentage < 0) {
    //
    //         return `- ${Math.abs(percentage).toFixed(2)}%`
    //     }
    // };

    useEffect(() => {
    }, [currentBlock]);

    return (
        <div
            className={s.parent_block}/*"pb-2 pt-2 pl-2 pr-4"*/>
            <p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)} break-words wrapper`)}>{category.name}</p>
            {/*<p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)}`)}>{`${category.contracts.lastPrice} ₽`}</p>*/}
            <p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)}`)}>{`Покупка - ${category.purchaseTotalVolume} т`}</p>
            {/*<p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)}`)}>{`Продажа - ${category.salesTotalVolume} т`}</p>*/}
            {/*<p className="text-lg ml-4 mt-3">{categoryPercent(category.contracts.lastPrice, category.contracts.preLastPrice)}</p>*/}
            <p className={classNames(s.square_row, `${currentBlockHandler(currentBlock)}`)}>{category.purchaseTotalVolume - category.salesTotalVolume < 0 ?
                `Дефицит ${recyclableVolumePercent(category.purchaseTotalVolume, category.salesTotalVolume)}` :
                `Профицит ${recyclableVolumePercent(category.purchaseTotalVolume, category.salesTotalVolume)}`}</p>
        </div>
    )
}