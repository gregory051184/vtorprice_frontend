import Head from 'next/head';
import {AppShell} from '@box/layouts';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {
    Container,
} from '@box/shared/ui';
import {LandingSlider} from '@box/widgets/landing';
import dynamic from 'next/dynamic';
import {useGate} from "effector-react";
import {gate} from "@box/entities/category/model";
import React, {useEffect, useState} from "react";
import {equipmentSelectApi} from "@box/entities/application/api/selects/equipmentSelect";
import {
    RecyclableCategoriesListForMainPage,
} from "@box/widgets/recyclableCategories/ui/recyclableCategoriesListForMainPage";

const LandingStats = dynamic(async () =>
    (await import('@box/widgets/landing/landingStats/ui')).LandingStats, {
    ssr: false,
});


export const Home = () => {
    useGate(gate)
    const [equipmentCategories, setEquipmentCategories] = useState(Array({id: 0, label: '', value: 0}));

    async function equipments() {
        const result = await equipmentSelectApi()
        return result
    }

    useEffect(() => {
        equipments().then(data => setEquipmentCategories(data))
    }, []);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Главная</title>
            </Head>
            <LandingSlider/> {/* <---------- Это сделал Савва. Если это убрать, то сломаются слайды стат
        сверху лендинга для мобильного адаптива.*/}
            <Container>
                <RecyclableCategoriesListForMainPage/>
            </Container>

        </AppShell>
    );
};
