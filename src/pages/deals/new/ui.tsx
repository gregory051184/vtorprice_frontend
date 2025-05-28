import React, {useEffect} from 'react';
import {AppShell} from '@box/layouts';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {
    BackButton, Badge, Container, Paper
} from '@box/shared/ui';
import {DealCreateForm} from '@box/features/deal';
import {useStore} from 'effector-react';
import {$application} from './model';
import s from './style.module.scss';
import classNames from 'classnames';
import {NotAuthAlert} from '@box/entities/notAuthAlert/ui';
import {NotVerificatedAlert} from '@box/entities/notVerificatedAlert/ui';
import {BreadCrumbs} from "@box/shared/ui/breadCrumbs";
import {$deals} from "@box/widgets/deal";

export const NewDeal = () => {
    const application = useStore($application);
    const deals = useStore($deals);
    useEffect(() => {

    }, [deals]);
    useEffect(() => {

    }, []);

    return (
        (
            <AppShell
                header={<Header/>}
                footer={<Footer/>}
            >
                <Container>
                    <BackButton/>
                    <h1 className="text-2xl font-medium mt-[10px]">Создать сделку</h1>
                    {application && (
                        <>
                            <BreadCrumbs
                                className="mt-[10px]"
                                breadcrumbs={[
                                    {
                                        text: "Биржа",
                                        href: "/exchange",
                                    },
                                    {
                                        text: application?.recyclables?.name,
                                        href: `/exchange/${application?.recyclables?.id}?type=${application?.dealType?.id}`
                                    },
                                    {
                                        text: application?.recyclables?.name,
                                        href: `/applications/${application.id}`
                                    },
                                    {
                                        text: 'Создать сделку'
                                    }
                                ]}
                            />
                            <Paper className="mt-[20px]">
                                <div className={classNames("flex justify-between items-center gap-[16px]", s.header)}>
                                    <div className="flex gap-[20px] items-center">
                                        {!!application.images.length && <div className="w-[156px] relative">
                                            <img src={application.images[0].image} alt="Вторсырье"
                                                 className="rounded-[10px]"/>
                                        </div>}
                                        <div className="">
                                            <h2 className="text-base">{application.recyclables.name}</h2>
                                            <p className="text-sm text-grey-50">{application.recyclables.category.name}</p>
                                        </div>

                                    </div>

                                    {application.dealType.id === 2 && (
                                        <Badge color="red">
                                            Продажа
                                        </Badge>
                                    )}
                                    {application.dealType.id === 1 && (
                                        <Badge color="green">
                                            Покупка
                                        </Badge>
                                    )}
                                </div>
                                <DealCreateForm className="mt-[24px]" dealType={application.dealType.id}/>

                            </Paper>
                        </>
                    )}

                </Container>
                <NotAuthAlert/>
                <NotVerificatedAlert/>
            </AppShell>
        )
    );
};
