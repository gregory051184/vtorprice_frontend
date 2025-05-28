import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@mantine/core";
import {useStore} from "effector-react";
import {useRouter} from "next/router";
import React from "react";
import {$applicationsForOffers} from "@box/entities/app-offer/model/store";
import s from "@box/pages/companies/company/ui/style.module.scss";
import {BackButton, Button, Pagination} from "@box/shared/ui";
import {applicationsPagination} from "@box/pages/companies";
import Head from "next/head";
import dotenv from 'dotenv';
import {authApi, ISendMessageData} from "@box/entities/auth";
import {OfferRow} from "@box/entities/offers";


dotenv.config();

export const ApplicationsOffersForCompany = () => {
    const applications = useStore($applicationsForOffers)
    const router = useRouter();
    const sendDataToEmail = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_email(data)
    }
    const sendDataToWhatsApp = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_whatsapp(data)
    }
    const sendDataToTelegram = async (data: ISendMessageData) => {
        return await authApi.send_offers_by_telegram(data)
    }
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            {applications.length > 0 ?
                <Head>
                    <title>Предложения
                        по {applications[0].recyclables.name} для {applications[0].offerCompanyName}</title>
                </Head> :
                <Head>
                    <title>Предложения по данному типу вторсырья пока нет.</title>
                </Head>
            }
            {applications.length > 0 &&
                <div className="pl-3.5">
                    <BackButton className='mb-[0px]'/>
                    <h1 className="text-3xl gap-[10px] font-medium">
                        Предложения по {applications[0].recyclables.name} для
                        компании {applications[0]?.offerCompanyName}</h1>
                    <div className="p-5" style={{display: 'inline-flex'}}>
                        <span className={s.button_left}>
                        <Button
                            disabled={applications[0]?.offerCompanyEmail?.length === 0}
                            type="mini"
                            mode="stroke"
                            onClick={() => {
                                sendDataToEmail({
                                    company: router.query.company_id ? +router.query.company_id : 0,
                                    link: process.env.NEXT_PUBLIC_OFFER_API + router.asPath
                                });
                                router.push('/profile/generate-list-of-offers');
                            }}
                        >
                            {applications[0]?.offerCompanyEmail?.length !== 0 ? 'Отправить на email' : 'Email отсутствует'}
                        </Button>
                        </span>
                        <span className={s.buttons_right}>
                        <Button
                            disabled={applications[0]?.offerCompanyEmail?.length === 0}
                            type="mini"
                            mode="stroke"
                            onClick={() => {
                                sendDataToWhatsApp({
                                    company: router.query.company_id ? +router.query.company_id : 0,
                                    link: process.env.NEXT_PUBLIC_OFFER_API + router.asPath
                                });
                                router.push('/profile/generate-list-of-offers');
                            }}
                        >
                            {applications[0]?.company?.phone?.length !== 0 ? 'Отправить в WhatsApp' : 'WhatsApp отсутствует'}
                        </Button>
                        </span>
                        <span className={s.buttons_right}>
                        <Button
                            disabled={applications[0]?.offerCompanyEmail?.length === 0}
                            type="mini"
                            mode="stroke"
                            onClick={() => {
                                sendDataToTelegram({
                                    company: router.query.company_id ? +router.query.company_id : 0,
                                    link: process.env.NEXT_PUBLIC_OFFER_API + router.asPath
                                });
                                router.push('/profile/generate-list-of-offers');
                            }}
                        >
                            {applications[0]?.company?.phone?.length !== 0 ? 'Отправить в Telegram' : 'Telegram отсутствует'}
                        </Button>
                        </span>
                    </div>
                    <div className={s.card_view_block}>
                        {applications.length > 0 && applications.map((rec) => (
                            <OfferRow application={rec}/>))}
                    </div>
                    <Pagination pagination={applicationsPagination}/>

                </div>
            }
        </AppShell>
    )
}