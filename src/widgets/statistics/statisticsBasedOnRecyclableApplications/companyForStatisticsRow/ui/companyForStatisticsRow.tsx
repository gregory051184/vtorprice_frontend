import {CompaniesWithFractionsType} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications";
import React, {useEffect, useState} from "react";
import classNames from "classnames";
import s from "@box/widgets/recyclable/stockMarketRecyclableTables/ui/styles.module.scss";
import {useRouter} from "next/router";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import StarImg from "@box/shared/ui/starImg";
import {useGate, useStore, useUnit} from "effector-react";
import {Button} from "@box/shared/ui";
import {
    $favoritesCompaniesList,
    gate,
    updateCompanyInFavoriteFx
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";


type CompanyForStatisticsRowType = {
    companiesWithRecyclable: CompaniesWithFractionsType
}

export const CompanyForStatisticsRow: React.FC<CompanyForStatisticsRowType> = ({
                                                                                   companiesWithRecyclable,
                                                                               }) => {
    const favouriteCompanies = useStore($favoritesCompaniesList);
    const [favoriteCompany, setFavoriteCompany] = useState<number>(0);
    const updateInFavorite = useUnit(updateCompanyInFavoriteFx);

    const router = useRouter()
    const applicationsCount = (fractionId: number): number => {
        return companiesWithRecyclable.applications
            .filter(app => app.recyclables.id === fractionId).length
    }

    const applicationsVolume = (fractionId: number): string => {
        return (companiesWithRecyclable.applications
            .filter(app => app.recyclables.id === fractionId)
            .reduce((a, b) => a + b.totalWeight, 0) / 1000).toFixed(2) + 'т';
    }


    const buyAndSellVolume = (fractionId: number, applications: IRecyclableApplicationShortForAll[]) => {
        const buyVolume = (applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.BUY)
            .reduce((a, b) => a + b.totalWeight, 0) / 1000).toFixed(2);

        const buyPriceSum = applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.BUY).map(app => app?.price).reduce((a, b) => a + b, 0)
        const buyPriceCount = applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.BUY).length

        const sellPriceSum = applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.SELL).map(app => app?.price).reduce((a, b) => a + b, 0)
        const sellPriceCount = applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.SELL).length

        const sellVolume = (applications
            .filter(app => app.recyclables.id === fractionId
                && app?.dealType?.id === BuyOrSellDeals.SELL)
            .reduce((a, b) => a + b.totalWeight, 0) / 1000).toFixed(2);
        return {
            buy: buyVolume,
            sell: sellVolume,
            buyMiddlePrice: buyPriceSum > 0 ? +(buyPriceSum / buyPriceCount).toFixed() : 0,
            sellMiddlePrice: sellPriceSum > 0 ? +(sellPriceSum / sellPriceCount).toFixed() : 0
        };
    }

    const handleOnClickInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if(favoriteCompany === 0) {
            setFavoriteCompany(id)
        }else {
            setFavoriteCompany(0)
        }
        if (event) {
            event.stopPropagation();
        }
        updateInFavorite({id});
    };
    useGate(gate);

    useEffect(() => {
    }, [companiesWithRecyclable, favoriteCompany, favouriteCompanies]);

    return (
        <div className="border-b border-grey-30">
            <tbody>
            <tr className="inline-flex text-sm">
                <td
                    onClick={() => router.push(`/companies/${companiesWithRecyclable?.company?.id}`)}
                    className={classNames(s.table_string, "font-bold w-80")}>
                    {companiesWithRecyclable?.company?.name}
                </td>
                <td className="ml-20 w-96">
                    {companiesWithRecyclable?.company?.city?.name}
                </td>
                <td className="ml-20 w-36">
                    <Button
                        type='micro'
                        onClick={(event) => handleOnClickInFavorite(companiesWithRecyclable?.company?.id, event)}
                        mode="notFilled"
                        iconLeft={<StarImg width={20}
                                           style={/*{fill: `${application?.isFavorite ? '' : 'none'}`}*/ {
                                               fill: `${(favoriteCompany === companiesWithRecyclable?.company?.id ||
                                                   favouriteCompanies.map(app => app.id).includes(companiesWithRecyclable?.company?.id))  ? '' : 'none'}`
                                           }}/>}
                    >
                    </Button>
                </td>
            </tr>
            </tbody>
            <div className="mt-4 w-[600px]">
                {companiesWithRecyclable.fractions.length > 0 &&
                    companiesWithRecyclable.fractions.map(fraction =>
                        <tr className="inline-flex mt-4 p-1 text-[13px]">
                            <td className="w-[250px]">{fraction?.name}</td>
                            <td className="ml-10 w-[100px]">
                                {applicationsVolume(fraction?.id)}
                            </td>
                            <td className="ml-10 w-[40px]">
                                {applicationsCount(fraction?.id)}
                            </td>
                            <td className={buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).buyMiddlePrice > 0 ? "ml-10 w-[150px] text-green-dark" : "ml-10 w-[150px] text-grey-50"}>
                                {`Покупка - ${buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).buy}т`}
                            </td>
                            <td className={buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).buyMiddlePrice > 0 ? "ml-10 w-[110px] text-green-dark" : "ml-10 w-[110px] text-grey-50"}>
                                {`Ср. - ${buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).buyMiddlePrice}₽`}
                            </td>
                            <td className={buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).sellMiddlePrice > 0 ? "ml-10 w-[150px] text-red-dark" : "ml-10 w-[150px] text-grey-50"}>
                                {`Продажа - ${buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).sell}т`}
                            </td>
                            <td className={buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).sellMiddlePrice > 0 ? "ml-10 w-[110px] text-red-dark" : "ml-10 w-[110px] text-grey-50"}>
                                {`Ср. - ${buyAndSellVolume(fraction.id, companiesWithRecyclable.applications).sellMiddlePrice}₽`}
                            </td>

                        </tr>
                    )}
            </div>
        </div>
    )
}