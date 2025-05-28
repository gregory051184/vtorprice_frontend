import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import React from "react";
import {AppShell} from '@box/layouts';
import {BackButton, Container} from '@box/shared/ui';
import {useRouter} from "next/router";
import {CompaniesOffersTable} from "@box/widgets/companies/compsniesOffersList";


export const StockGlassOffer: React.FC = () => {
    const router = useRouter();
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>{router.asPath}</title>
            </Head>
            <Container>
                <div>
                    <BackButton className='mb-[10px] text-sm'/>
                </div>
                <CompaniesOffersTable className="mt-3" />
            </Container>
        </AppShell>
    )
}