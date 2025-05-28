import React, {useEffect, useState} from "react";
import {
    IShortRecyclableApplicationPrice
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import {useScreenSize} from "@box/shared/hooks";
import {useRouter} from "next/router";
import s from "@box/widgets/recyclable/stockMarketRecyclableTables/ui/styles.module.scss";
import {BuyOrSellDeals} from "@box/entities/deal/model";

type RecyclableMainPageBuyRowType = {
    fraction: IShortRecyclableApplicationPrice
    applications: IRecyclableApplicationShortForAll[]
    averagePrice: number,
    priceStatistics: string,
}

export const RecyclableMainPageBuyRow: React.FC<RecyclableMainPageBuyRowType> = ({
                                                                                     fraction,
                                                                                     applications,
                                                                                     averagePrice,
                                                                                     priceStatistics,
                                                                                 }) => {
    const [list, setList] = useState<Array<number>>([averagePrice]);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const [lastMiddlePrice, setLastMiddlePrice] = useState<number>(0);

    const [show, setShow] = useState<boolean>(false);

    const router = useRouter();

    const totalVolume = () => {
        if (applications
            .filter(application => application?.dealType?.id === BuyOrSellDeals.BUY && application.recyclables.id === fraction?.id).length > 0) {
            return `${(applications.filter(app => app.dealType.id === BuyOrSellDeals.BUY && app.recyclables.id === fraction?.id)
                .map(app => app?.totalWeight)
                .reduce((a, b) => a + b) / 1000).toFixed()} т`;
        } else {
            return "--";
        }

    }

    const AppCount = () => {
        if (applications
            .filter(application => application?.dealType?.id === BuyOrSellDeals.BUY && application.recyclables.id === fraction?.id).length > 0) {
            return applications.filter(app => app.dealType.id === BuyOrSellDeals.BUY && app.recyclables.id === fraction?.id).length;
        } else {
            return "--";
        }
    }

    const setListHandler = (value: number) => {
        if (value > 0) {
            setList([...list, value])
            if (list.length > 2) {
                list.shift();
                setList(list)
            }
            if (list.length == 2) {
                if (list[0] !== list[1]) {
                    setShow(!show)
                    return list
                }
            }
        }
        return list;
    }

    useEffect(() => {
        setListHandler(averagePrice)
        setLastMiddlePrice(averagePrice)
    }, [fraction, averagePrice, priceStatistics, applications, list, lastMiddlePrice]);

    if (isMobile) {
        return (
            <tbody>
            <tr
                key={averagePrice}
                className={list[0] < lastMiddlePrice && show ? s.table_string_plus : list[0] > lastMiddlePrice && show ? s.table_string_minus : s.table_string}
                onClick={() => router.push(`/applications/category/recyclable/${fraction?.id}?type=buy`)}
            >
                <td>
                    <div
                        className="w-[120px] pt-3 break-words"
                        title={fraction?.name}>
                        {fraction?.name}
                    </div>
                </td>
                <td className={s.fraction}>{AppCount()}</td>
                <td className={s.fraction}>{totalVolume()}</td>
                <td
                    className={s.fraction}>
                    {applications.length > 0 && applications
                        .filter(app => app?.recyclables?.id === fraction?.id && app?.dealType?.id === BuyOrSellDeals.BUY)
                        .length > 0 ? `${averagePrice}₽` : '--'}
                </td>
                <td
                    className={s.fraction}>
                    {applications.length > 0 && applications
                        .filter(app => app?.recyclables?.id === fraction?.id && app?.dealType?.id === BuyOrSellDeals.BUY)
                        .length > 0 ? priceStatistics : '--'}
                </td>
            </tr>
            </tbody>
        )
    }

    return (
        <tbody>
        <tr
            key={averagePrice}
            className={list[0] < lastMiddlePrice && show ? s.table_string_plus : list[0] > lastMiddlePrice && show ? s.table_string_minus : s.table_string}
            onClick={() => router.push(`/applications/category/recyclable/${fraction?.id}?type=buy`)}
        >
            <td className={s.fraction}>{AppCount()}</td>
            <td className={s.fraction}>{totalVolume()}</td>
            <td
                className={s.fraction}>
                {applications.length > 0 && applications
                    .filter(app => app?.recyclables?.id === fraction?.id && app?.dealType?.id === BuyOrSellDeals.BUY)
                    .length > 0 ? `${averagePrice}₽` : '--'}
            </td>
            <td
                className={s.fraction}>
                {applications.length > 0 && applications
                    .filter(app => app?.recyclables?.id === fraction?.id && app?.dealType?.id === BuyOrSellDeals.BUY)
                    .length > 0 ? priceStatistics : '--'}
            </td>
        </tr>
        </tbody>
    )
}