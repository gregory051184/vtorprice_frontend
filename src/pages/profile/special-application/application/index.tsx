import React from 'react';
import {useStore} from 'effector-react';
import { BackButton, Paper } from '@box/shared/ui';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import s from "@box/pages/profile/applications/application/style.module.scss";
import {$specialApplication} from "@box/entities/special-application";
import {SpecialApplicationUpdateForm} from "@box/widgets/special-applications";
import {$authStore} from "@box/entities/auth";

export const UsersSpecialApplication = () => {
    const application = useStore($specialApplication);
    const user = useStore($authStore)
    return (
        <AppShell
            header={<Header />}
            footer={<Footer />}
        >
            <SidebarLayout>
                <div className={s.back}>
                    <BackButton />
                </div>
                {
                    //@ts-ignore
                    application && application?.specialApplication?.companies[0].id === user.user?.company?.id
                    && (
                        <div className={s.title}>
                            <h1 className="text-2xl">
                                Редактирование специального объявления
                            </h1>
                            <Paper className="mt-[30px]">
                                <SpecialApplicationUpdateForm/>
                            </Paper>
                        </div>
                    )}
            </SidebarLayout>
        </AppShell>
    );
};
