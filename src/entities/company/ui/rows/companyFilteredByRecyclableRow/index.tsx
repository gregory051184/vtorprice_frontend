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
import {useScreenSize} from "@box/shared/hooks";
import classNames from "classnames";


dotenv.config();

export const CompanyFilteredByRecyclableRow: React.FC<ICompanyWithLastPriceAndVolumeRow> = (
    {
        company,
        lastPrice,
        volume,
        className
    }) => {
    const favouriteCompanies = useStore($favoritesCompaniesList);
    const [favoriteCompany, setFavoriteCompany] = useState<number>(0);
    const updateInFavorite = useUnit(updateCompanyInFavoriteFx);
    const user = useStore($authStore);
    const router = useRouter();

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const handleOnClickInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (favoriteCompany === 0) {
            setFavoriteCompany(id)
        } else {
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

    if (isMobile) {
        return (
            <div
                className={classNames("p-[16px] bg-grey-10 rounded-[10px] mt-4", className)}
                onClick={() => {
                    router.push(`/companies/${company.id}`);
                }}
            >

                <div className="items-center w-full inline-flex">
                    <div className="max-w-[260px] min-w-[180px]">
                        {company?.name}
                    </div>
                    <div className="max-w-[140px] min-w-[80px]">
                        {company?.id !== user.user?.company?.id ?
                            <div>
                                <Button
                                    type='micro'
                                    onClick={(event) => handleOnClickInFavorite(company?.id, event)}
                                    mode="notFilled"
                                    iconLeft={<StarImg width={20}
                                                       style={{
                                                           fill: `${(favoriteCompany === company?.id ||
                                                               favouriteCompanies.map(app => app.id).includes(company?.id)) ? '' : 'none'}`
                                                       }}/>}
                                >
                                </Button>
                            </div> :
                            <div>
                                <p className="text-red-dark mt-[8px] whitespace-nowrap w-52">{"Ваша компания"}</p>
                            </div>
                        }
                    </div>
                </div>

                <div className="w-full mt-2">
                    <div className="inline-flex">
                        <p>Объём</p>
                        <p className="ml-4">{`${volume} тонн`}</p>
                    </div>

                    <div className="inline-flex ml-8">
                        <p>Цена за кг</p>
                        <p className="ml-4">{`${lastPrice}₽`}</p>
                    </div>
                </div>
                <div className="w-full mt-2 inline-flex">
                    <p>{company.city ? company.city.name : ''}</p>
                    <p className="text-sm font-light text-primaryGreen-main underline ml-4">
                        Адрес
                    </p>
                </div>

            </div>
        );
    }
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
                                                       favouriteCompanies.map(app => app.id).includes(company?.id)) ? '' : 'none'}`
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
