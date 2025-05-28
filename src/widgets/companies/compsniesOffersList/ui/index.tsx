import React, {useState, useEffect} from "react";
import {IWithClass} from "@types";
import {useEvent, useGate, useStore, useUnit} from "effector-react";
import {useOrdering, usePagination} from "@box/shared/lib/factories";
import {orderingForOffers, paginationForOffers} from "@box/widgets/companies/companiesList/model";
import {Button, Pagination, Table} from "@box/shared/ui";
import s from "@box/widgets/companies/companiesList/ui/style.module.scss";
import {headers} from "@box/widgets/companies/compsniesOffersList/lib";
import {companyModel, CompanyCard} from '@box/entities/company';
import classNames from "classnames";
import {dealsForOffersModel} from "@box/entities/generate-list-of-offers";
import {CompanyOffersRow} from "@box/entities/company/ui/rows/companyOffersRow";
import {IChecking} from "@box/entities/company/ui/rows/companyRow/types";
import {authApi, ISendMessageData} from "@box/entities/auth";
import {changeIdFx} from "@box/entities/generate-list-of-offers/offer/model";
import {useRouter} from "next/router";
import {gate} from '@box/entities/generate-list-of-offers/offer/model'


export const CompaniesOffersTable: React.FC<IWithClass> = ({className}) => {
    const companies = useStore(dealsForOffersModel.$dealsForOffers);
    const loading = useStore(companyModel.companiesLoading.$loaderStore);
    const updateInFavorite = useUnit(companyModel.updateCompanyInFavoriteEvent);
    const pag = usePagination(paginationForOffers);
    const ordering = useOrdering(orderingForOffers);
    const router = useRouter();
    const fetchId = useEvent(changeIdFx)
    const [checking, setChecking] = useState(Array<IChecking>);

    useGate(gate);

    const handleChangeInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event) {
            event.stopPropagation();
        }
        updateInFavorite({id});
    };

    const send_offers_by_email_to_many = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_email(data)
    }

    const send_offers_by_whatsapp_to_many = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_whatsapp(data)
    }

    const send_offers_by_telegram_to_many = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_telegram(data)
    }

    useEffect(() => {
        //@ts-ignore
        fetchId(+router.query?.id);
    }, [router.query?.id]);

    return (
        <div className={className} style={{width: 'auto'}}>
            <div className='p-5' style={{display: 'inline-flex'}}>
                <span className={s.button_left}>
                <Button
                    type="mini"
                    mode="stroke"
                    onClick={() => {
                        send_offers_by_whatsapp_to_many({companies: checking})
                        router.push('/profile/generate-list-of-offers')
                    }
                    }
                >
                    {'Разослать выбранным через WhatsApp'}
                </Button>
                </span>
                <span className={s.buttons_right}>
                <Button
                    type="mini"
                    mode="stroke"
                    onClick={() => {
                        send_offers_by_telegram_to_many({companies: checking})
                        router.push('/profile/generate-list-of-offers')
                    }
                    }
                >
                    {'Разослать выбранным через Telegram'}
                </Button>
            </span>
                <span className={s.buttons_right}>
                <Button
                    type="mini"
                    mode="stroke"
                    onClick={() => {
                        send_offers_by_email_to_many({companies: checking})
                        router.push('/profile/generate-list-of-offers')
                    }
                    }
                >
                    {'Разослать выбранным по email'}
                </Button>
            </span>
            </div>
            <Table
                pagination={
                    <Pagination pagination={paginationForOffers}/>

                }
                loading={loading && pag.currentPage === 1}
                empty={companies.length === 0}
                className={s.table_view}
            >
                <Table.Head
                    headers={headers}
                    ordering={ordering.ordering}
                    onOrderingChange={ordering.setOrdering}
                />
                <Table.Body>
                    {companies.map((company) => (
                        <CompanyOffersRow
                            checking={checking}
                            company={company}
                            key={company.id}
                        />

                    ))}
                </Table.Body>
            </Table>
            <div className={s.card_view}>
                <div className={classNames(s.card_view_block)}>
                    {companies.map((company) => (
                        <CompanyCard
                            className={s.card_view_card}
                            key={company.id}
                            company={company}
                            onClickInFavorite={() => handleChangeInFavorite(company.id)}
                        />
                    ))}
                </div>
                <Pagination pagination={paginationForOffers}/>
            </div>

        </div>
    )
};