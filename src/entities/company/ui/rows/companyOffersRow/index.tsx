import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Table} from '@box/shared/ui';
import {Avatar} from '@box/entities/user';
import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import {useRouter} from 'next/router';
import {ICompanyOfferRow,} from '../companyRow/types';
import {Rating} from '@box/shared/ui';
import dotenv from 'dotenv';
import Head from "next/head";


dotenv.config();

export const CompanyOffersRow: React.FC<ICompanyOfferRow> = ({company, checking}) => {
    const router = useRouter();
    const link = process.env.NEXT_PUBLIC_OFFER_API + `/offers?recyclable_id=${router.asPath.split('/')[router.asPath.split('/').length - 1]}&company_id=${company.id}`
    const [faikChecked, setFaikChecked] = useState(false);
    const [checked, setChecked] = useState({
        id: company.id,
        checked: true,
        link: link
    });
    const make_choice = () => {
        setFaikChecked(!faikChecked)
        setChecked(() => ({id: company.id, checked: !checked.checked, link: link}))
        //@ts-ignore
        const list = checking.map(item => item.id)
        if (!list.includes(checked.id)) {
            //@ts-ignore
            checking.push(checked)
        } else {
            //@ts-ignore
            for (let i = 0; i < checking.length; i++) {
                //@ts-ignore
                if (checking[i].id === checked.id) {
                    //@ts-ignore
                    checking[i].checked = checked.checked
                }
            }
        }

        return checking
    }
    useEffect(() => {

    }, [checking, checked]);

    // @ts-ignore
    return (
        <>
            <Head>
                <title>Предложения для компаний</title>
            </Head>
            <Table.Row
                className="cursor-pointer"
            >
                <Table.Cell className="pr-8 w-[350px]"
                            onClick={() => {
                                router.push(`/companies/${company.id}`);
                            }}
                >
                    <div className="flex items-center  gap-6">
                        <Avatar className="shrink-0" size="sm"
                                url={process.env.NEXT_PUBLIC_API_URL + company?.image || null}/>
                        <div>
                            {company.name}
                            <Rating rating={company.averageReviewRate} total={company.dealsCount || 0}/>
                            {company.status?.id === 2 && <Verified className="inline"/>}
                            {company.status?.id === 3 && (
                                <>
                                    <Verified className="inline"/>
                                    <Reliable className="inline"/>
                                </>
                            )}
                            {company.status?.id === 4 && (<svg width="16" height="17" viewBox="0 0 24 24" fill="none"
                                                               xmlns="http://www.w3.org/2000/svg" className="inline">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604ZM16.1925 17.6067L6.39327 7.80749C4.33767 10.5493 4.55666 14.4562 7.05025 16.9497C9.54384 19.4433 13.4507 19.6623 16.1925 17.6067ZM16.9497 7.05025C19.4433 9.54384 19.6623 13.4507 17.6067 16.1925L7.80749 6.39327C10.5493 4.33767 14.4562 4.55666 16.9497 7.05025Z"
                                          fill="red"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </Table.Cell>
                <Table.Cell className="pr-8">
                    {company.dealsByRecyclableForOffers ? company?.dealsByRecyclableForOffers : 0}
                </Table.Cell>
                <Table.Cell className="pr-8">
                    {company.lastDealDate ? new Date(company?.lastDealDate).toLocaleDateString() : 'нет'}
                </Table.Cell>
                <Table.Cell className="pr-8">
                    {company.buyAppsByRecyclableForOffers ? company?.buyAppsByRecyclableForOffers : 0}
                </Table.Cell>
                <Table.Cell className="pr-8">
                    {company.lastBuyAppDate ? new Date(company?.lastBuyAppDate).toLocaleDateString() : 'нет'}
                </Table.Cell>
                <Table.Cell className="">
                    <p>{company.city ? company.city.name : ''}</p>
                    <p className="text-sm font-light text-primaryGreen-main underline">
                        Адрес
                    </p>
                </Table.Cell>
                <Table.Cell className="pr-8">
                    <Button
                        disabled={!company?.lastBuyAppDate || !company?.appOffersCount}
                        type="mini"
                        mode="stroke"
                        onClick={() => {
                            router.push({
                                pathname: '/offers/',
                                query: {
                                    recyclable_id: router.query?.id,
                                    company_id: company?.id,
                                }
                            });
                        }}
                    >
                        {(company?.appOffersCount && company?.appOffersCount > 0) ? `Сформировать предложение (всего предложений ${company?.appOffersCount})` : 'Нет предложений'}
                    </Button>
                </Table.Cell>
                <Table.Cell className="pr-8">
                    <Checkbox disabled={company.appOffersCount === 0 || !company.email} checked={faikChecked}
                              onChange={() => make_choice()}/>
                </Table.Cell>
            </Table.Row>
        </>
    );
};
