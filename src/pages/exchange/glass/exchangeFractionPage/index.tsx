import {Header} from "@box/widgets/header";
import {AppShell} from '@box/layouts';
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {useStore} from "effector-react";
import {recyclableModel} from '@box/entities/recyclable';
import {ExchangeFiltersLayout} from "@box/layouts/filters_layout";
import {ExchangePurchaseList, ExchangeSalesList} from "@box/widgets/applications";
import {Container} from "@box/shared/ui";

export const ExchangeFractionPage = () => {
    const recyclable = useStore(recyclableModel.$recyclable);
    const [active, setActive] = useState(1);
    const activeHandler = (num: number) => {
        setActive(num);
        return active
    }
    useEffect(() => {
    }, [active]);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>{recyclable?.name}</title>
            </Head>
            <ExchangeFiltersLayout
                active={activeHandler}>
                <Container>
                    {active === 2 && <ExchangeSalesList show={active === 2} active={active}/>}
                    {active === 1 && <ExchangePurchaseList show={active === 1} active={active}/>}
                </Container>
            </ExchangeFiltersLayout>
        </AppShell>
    )
}