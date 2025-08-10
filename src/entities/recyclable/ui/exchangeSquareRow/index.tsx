import React, {useEffect} from "react";
import s from './styles.module.scss';
import classNames from "classnames";
import {IExchangeSquareRow} from "@box/entities/recyclable/ui/exchangeSquareRow/types";
import {useRouter} from "next/router";
import {useForm} from "@box/shared/effector-forms";
import {exchangeRecyclablesListFiltersModel} from "@box/features/recyclable";

export const ExchangeSquareRow: React.FC<IExchangeSquareRow> = ({
                                                                    currentBlock,
                                                                    recyclable,
                                                                    urgencyType
                                                                }) => {
    const router = useRouter();
    const filters = useForm(exchangeRecyclablesListFiltersModel.filters);
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

    const categoryPercent = (lastPrice: number, preLastPrice: number) => {

        const percentage = (lastPrice - preLastPrice) / lastPrice * 100;

        if (lastPrice === 0) {
            return 'Нет данных'
        }

        if (preLastPrice === 0) {
            return 'Без изменений'
        }

        if (percentage > 0) {

            return `Изм. цены ▲ ${Math.abs(percentage).toFixed(2)}%`
        }
        if (percentage < 0) {

            return `Изм. цены ▼ ${Math.abs(percentage).toFixed(2)}%`
        }
    };

    const recyclableVolumePercent = (lastPrice: number, preLastPrice: number) => {

        const percentage = (lastPrice - preLastPrice) / lastPrice * 100;

        if (lastPrice === 0) {
            return 'Нет данных'
        }

        if (preLastPrice === 0) {
            return 'Без изменений'
        }

        if (percentage > 0) {

            return `+${Math.abs(percentage).toFixed(2)}%`
        }
        if (percentage < 0) {

            return `-${Math.abs(percentage).toFixed(2)}%`
        }
    };

    useEffect(() => {
    }, [currentBlock]);
    return (
        <div>
            <div
                onClick={() => {
                    const params = new URLSearchParams({
                        type: filters.values.urgency_type?.value

                    });
                    router.push(`/exchange/${recyclable.id}?${params}`);
                }}
                className={s.parent_block}>
                <p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)} break-words wrapper`)}>{recyclable.name}</p>
                <p className={classNames(s.square_row_bold, `${currentBlockHandler(currentBlock)}`)}>{urgencyType === 1 ? `Посл. цена - ${recyclable.readyForShipmentPrices.lastPrice} ₽` :
                    `Посл. цена - ${recyclable.supplyContractsPrices.lastPrice} ₽`}</p>
                <p className={classNames(s.square_row, `${currentBlockHandler(currentBlock)}`)}>{urgencyType === 1 ? categoryPercent(recyclable.readyForShipmentPrices.lastPrice,
                    recyclable.readyForShipmentPrices.preLastPrice) : categoryPercent(recyclable.supplyContractsPrices.lastPrice,
                    recyclable.supplyContractsPrices.preLastPrice)}</p>
                <p className={classNames(s.square_row, `${currentBlockHandler(currentBlock)}`)}>{recyclable.purchaseSupplyContractTotalVolume - recyclable.salesSupplyContractTotalVolume < 0 ?
                    `Дефицит ${recyclableVolumePercent(recyclable.purchaseSupplyContractTotalVolume, recyclable.salesSupplyContractTotalVolume)}` :
                    `Профицит ${recyclableVolumePercent(recyclable.purchaseSupplyContractTotalVolume, recyclable.salesSupplyContractTotalVolume)}`}</p>
            </div>
        </div>
    )
}