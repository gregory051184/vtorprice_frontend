import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import {AppShell, SidebarLayout} from "@box/layouts";
import React from "react";
import {useStoreMap} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@types";
import {LogistSettings} from "@box/widgets/settings/logistSettings";
import {StaffCreateForm} from "@box/widgets/settings/companyStaffSettings";


export const CompanyStaffManagement = () => {
    const user = useStoreMap({
        store: $authStore,
        keys: ['user'],
        fn: (val) => val.user
    });

    let element: JSX.Element;
    switch (user?.role.id as ROLE) {
        case ROLE.MANAGER:
        case ROLE.ADMIN:
            element = <StaffCreateForm/>;
            break;
        case ROLE.LOGIST:
            element = <LogistSettings/>;
            break;
        default:
            element = <StaffCreateForm/>;
    }

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Персонал компании</title>
            </Head>

            <SidebarLayout>{element}</SidebarLayout>
        </AppShell>
    )
}