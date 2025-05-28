import {Button} from "@box/shared/ui";
import Verified from "@assets/icons/16_verified.svg";
import Reliable from "@assets/icons/16_reliable.svg";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {companiesFavoritesListModel} from "@box/widgets/companies/companiesFavoritesList";
import {useGate, useStore, useUnit} from "effector-react";
import {$favoritesCompaniesList, gate} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";

interface ICardCompany {
    name: string,
    dealType: string,
    value: number,
    company_id: number,
    isFavorite: boolean,
    price: number
}

type CompaniesCardForStatisticsType = {
    company: ICardCompany
}

export const CompaniesCardForStatistics: React.FC<CompaniesCardForStatisticsType> = ({
                                                                                         company
                                                                                     }) => {
    const router = useRouter();
    const updateInFavorite = useUnit(
        companiesFavoritesListModel.updateCompanyInFavoriteFx
    );
    const companies = useStore($favoritesCompaniesList);
    const [favoriteCompany, setFavoriteCompany] = useState<number>(0);

    const handleChangeisFavorite = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        id: number
    ) => {
        if (favoriteCompany === 0) {
            setFavoriteCompany(id);
        } else {
            setFavoriteCompany(0)
        }
        e.stopPropagation();
        updateInFavorite({id});
    };

    useGate(gate)

    useEffect(() => {
    }, [company, favoriteCompany, companies]);

    return (
        <div className="mt-7">
            <tbody>
            <tr>
                <td
                    className="cursor-pointer w-[450px]"
                    onClick={() => {
                        router.push(`/companies/${company.company_id}`)
                    }}>
                    <div className="flex items-center gap-6">
                        <p>
                            {company.name}
                            <>
                                <Verified className="inline"/>
                                <Reliable className="inline"/>
                            </>
                        </p>
                    </div>
                </td>
                <td className="w-[100px]">
                    <div className="flex items-center gap-6">
                        <p>
                            {`${company.value} ₽`}
                        </p>
                    </div>
                </td>
                <td className="w-[200px]">
                    <Button
                        onClick={(e) => handleChangeisFavorite(e, company.company_id)}
                        className="w-[130px]"
                        type="mini"
                    >
                        {/*company.isFavorite ? 'Отписаться' : 'В избранное'*/ favoriteCompany === company.company_id ||
                        companies.map(company => company?.id).includes(company?.company_id) ? 'Отписаться' : 'В избранное'}
                    </Button>
                </td>
            </tr>
            </tbody>
        </div>
    )
}