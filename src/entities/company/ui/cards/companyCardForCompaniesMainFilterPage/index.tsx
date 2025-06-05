import {Button, Rating} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/widgets/companies/companiesMainMenu/ui/style.module.scss";
import StarImg from "@box/shared/ui/starImg";
import React, {useState} from "react";
import {ICompany} from "@box/entities/company/model";
import {useRouter} from "next/router";
import {useGate, useStore, useUnit} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {companyModel} from "@box/entities/company";
import {
    $favoritesCompaniesList, gate,
    updateCompanyInFavoriteFx
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";

type CompanyCardForCompaniesMainFilterPageType = {
    company: ICompany
}

export const CompanyCardForCompaniesMainFilterPage: React.FC<CompanyCardForCompaniesMainFilterPageType> = ({
                                                                                                               company
                                                                                                           }) => {
    const favouriteCompanies = useStore($favoritesCompaniesList);
    const [favoriteCompany, setFavoriteCompany] = useState<number>(0);
    const updateInFavorite = useUnit(updateCompanyInFavoriteFx);
    const router = useRouter();
    const user = useStore($authStore);

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

    // const handleChangeInFavorite = (
    //     id: number,
    //     event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    // ) => {
    //     if (event) {
    //         event.stopPropagation();
    //     }
    //     updateInFavorite({id});
    // };
    return (
        <div key={company?.id}
             className="mt-6 inline-flex"
             onClick={() => router.push(`/companies/${company?.id}`)}>
            <div>
                <div>
                    {company?.id !== user.user?.company?.id ?
                        <div>
                            <Button
                                type='micro'
                                onClick={(event) => handleOnClickInFavorite(company?.id, event)}
                                mode="notFilled"
                                iconLeft={<StarImg width={20}
                                                   style={/*{fill: `${application?.isFavorite ? '' : 'none'}`}*/ {
                                                       fill: `${(favoriteCompany === company?.id ||
                                                           favouriteCompanies.map(app => app.id).includes(company?.id))  ? '' : 'none'}`
                                                   }}/>}
                            >
                            </Button>
                        </div> :
                        <div>
                            <p className="text-red-dark mt-[8px] whitespace-nowrap w-52">{"Ваша компания"}</p>
                        </div>
                    }
                </div>
                <div>
                    <img
                        className="rounded-[10px] w-[250px] h-[250px] object-cover cursor-pointer"
                        src={
                            company?.image ? company?.image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />
                </div>
            </div>
            <div className="ml-20 mt-20 cursor-pointer">
                <h4 className="text-base font-medium">{company?.name}</h4>
                <p className="text-xs text-grey-40 mt-[6px]"/*className="text-primaryGreen-main font-semibold mt-[10px]"*/>
                    {company?.address}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {`Дата создания на на бирже: ${new Date(company?.createdAt).toLocaleDateString()}`}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]"
                    //@ts-ignore
                   style={company?.withNds ? {color: 'green'} : {color: 'red'}}>
                    {
                        //@ts-ignore
                        `Налогообложение: ${company?.withNds ? 'НДС' : 'Без НДС'}`
                    }</p>
                <p className="text-xs mt-[6px]">
                    <Rating
                        className="ml-2"
                        rating={company?.averageReviewRate}
                        total={company?.dealsCount || 0}
                    />
                </p>
            </div>
        </div>
    )
}