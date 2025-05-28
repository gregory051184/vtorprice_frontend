import {
    IShortRecyclableApplicationPrice
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import s from "@box/widgets/recyclable/stockMarketRecyclableTables/ui/styles.module.scss";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";

type RecyclableMainPageRowType = {
    fraction: IShortRecyclableApplicationPrice
    applications: IRecyclableApplicationShortForAll[]
    averagePrice: number,
    priceStatistics: string,
}

export const RecyclableMainPageRow: React.FC<RecyclableMainPageRowType> = ({
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
                className={list[0] < lastMiddlePrice && show ? s.table_string_plus : list[0] > lastMiddlePrice && show ? s.table_string_minus : s.table_string}
                onClick={() => router.push(`/applications/category/recyclable/${fraction?.id}`)}
            >

                <td>
                    <div
                        className="w-[210px] pt-3 break-words"
                        title={fraction?.name}>
                        {fraction?.name}
                    </div>
                </td>

                <td
                    className={s.fraction}>
                    {applications.length > 0 && applications
                        .filter(app => app?.recyclables?.id === fraction?.id)
                        .length > 0 ? `${averagePrice}₽` : '--'}
                </td>
                <td
                    className={s.fraction}>
                    {applications.length > 0 && applications
                        .filter(app => app?.recyclables?.id === fraction?.id)
                        .length > 0 ? priceStatistics : '--'}
                </td>
            </tr>
            </tbody>
        )
    }


    return (
        <tbody>
        <tr
            className={list[0] < lastMiddlePrice && show ? s.table_string_plus : list[0] > lastMiddlePrice && show ? s.table_string_minus : s.table_string}
            onClick={() => router.push(`/applications/category/recyclable/${fraction?.id}`)}
        >

            <td>
                <div
                    className="w-[250px] pt-3 overflow-ellipsis whitespace-nowrap overflow-hidden"
                    title={fraction?.name}>
                    {fraction?.name}
                </div>
            </td>

            <td
                className={s.fraction}>
                {applications.length > 0 && applications
                    .filter(app => app?.recyclables?.id === fraction?.id)
                    .length > 0 ? `${averagePrice}₽` : '--'}
            </td>
            <td
                className={s.fraction}>
                {applications.length > 0 && applications
                    .filter(app => app?.recyclables?.id === fraction?.id)
                    .length > 0 ? priceStatistics : '--'}
            </td>
            </tr>
        </tbody>
    )
}