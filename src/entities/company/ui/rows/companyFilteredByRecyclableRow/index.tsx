import React, {useEffect, useState} from 'react';
import {Button, Table} from '@box/shared/ui';
import {useRouter} from 'next/router';
import StarImg from '@box/shared/ui/starImg';
import {ICompanyWithLastPriceAndVolumeRow} from './types';
import dotenv from 'dotenv';
import {useGate, useStore, useUnit} from "effector-react";
import {
    $favoritesCompaniesList, gate,
    updateCompanyInFavoriteFx
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";
import {$authStore} from "@box/entities/auth";


dotenv.config();

export const CompanyFilteredByRecyclableRow: React.FC<ICompanyWithLastPriceAndVolumeRow> = (
    {
        company,
        lastPrice,
        volume
    }) => {
    const favouriteCompanies = useStore($favoritesCompaniesList);
    const [favoriteCompany, setFavoriteCompany] = useState<number>(0);
    const updateInFavorite = useUnit(updateCompanyInFavoriteFx);
    const user = useStore($authStore);
    const router = useRouter();

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
    }, [company, lastPrice, lastPrice]);
    return (
        <Table.Row
            className="cursor-pointer"
            onClick={() => {
                router.push(`/companies/${company?.id}`);
            }}
        >
            <Table.Cell className="pr-8 w-[350px]">
                <div className="flex items-center  gap-6">
                    <div>
                        {company?.name}
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className="pr-6">
                {
                    // eslint-disable-next-line react/no-array-index-key
                    <p>{volume}</p>
                }
            </Table.Cell>
            <Table.Cell className="pr-6">
                <p>{`${lastPrice}₽`}</p>
            </Table.Cell>
            <Table.Cell className="">
                <p>{company.city ? company.city.name : ''}</p>
                <p className="text-sm font-light text-primaryGreen-main underline">
                    Адрес
                </p>
            </Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
        </Table.Row>
    );
};
