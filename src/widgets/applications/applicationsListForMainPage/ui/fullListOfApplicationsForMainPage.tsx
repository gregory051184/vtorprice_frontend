import React, {useEffect, useState} from "react";
import {useGate, useStore} from "effector-react";
import {
    $applicationsForMain,
} from "@box/entities/application/model";
import {Container, Pagination, Table, Tip} from "@box/shared/ui";
import s from "./style.module.scss"
import {
    AppCardForMainPage,
    applicationStatusSelectValues,
} from '@box/entities/application';
import {useScreenSize} from "@box/shared/hooks";
import {
    forMainPageGate, forMainPagePagination,
} from "@box/widgets/applications/applicationsListForMainPage/model";



export const FullListOfApplicationsForMainPage = () => {
    const applications = useStore($applicationsForMain);
    const [showDeletedApplications, setShowDeletedApplications] = useState<boolean>(false);
    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    // const router = useRouter();
    //
    // const filteredApps = (type: any, apps?: IRecyclableApplication[]) => {
    //     if (type === "buy") {
    //         return !apps ? applications.filter(app => app?.dealType?.id === BuyOrSellDeals.BUY) :
    //             apps.filter(app => app?.dealType?.id === BuyOrSellDeals.BUY)
    //     }
    //     if (type === "sell") {
    //         return !apps ? applications.filter(app => app?.dealType?.id === BuyOrSellDeals.SELL) :
    //             apps.filter(app => app?.dealType?.id === BuyOrSellDeals.SELL)
    //     }
    //     return !apps ? applications : apps
    // }

    useGate(forMainPageGate);

    useEffect(() => {
    }, [applications]);
    return (
        <Container>
            <div
                onClick={() => setShowDeletedApplications(!showDeletedApplications)}
                className={s.switch_button}>
                {!showDeletedApplications ?
                    <p>Показать архивные объявления</p> :
                    <p>Вернуться к текущим объявлениям</p>
                }
            </div>
            {!showDeletedApplications &&
                <Table
                    pagination={<Pagination pagination={forMainPagePagination}/>}
                >

                    <h3 className='mt-5'>Текущие объявления</h3>

                    <div className="inline-flex">
                        <div className='flex h-auto flex-wrap'>
                            {applications.filter(app => !app.isDeleted || +app?.status?.id < +applicationStatusSelectValues[2]?.id)
                                //@ts-ignore
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map(application => (
                                    <AppCardForMainPage application={application} key={application.id}/>))}

                        </div>
                    </div>
                </Table>
            }
            {showDeletedApplications &&
                <Table
                    pagination={<Pagination pagination={forMainPagePagination}/>}
                >
                    <h3 className="mt-5">Архивные объявления</h3>
                    <Tip>
                        Архивные объявления по долгосрочным контрактам - это объявления,
                        по которым уже созданы сделки, но Вы можете связаться с владельцем объявления и предложить ему
                        свои условия.
                    </Tip>
                    <div className="inline-flex">
                        <div className='flex h-auto flex-wrap'>
                            {applications.filter(app => app?.isDeleted || +app?.status?.id >= +applicationStatusSelectValues[2]?.id)
                                //@ts-ignore
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map(application => (
                                    <AppCardForMainPage application={application} key={application.id}/>))}
                        </div>
                    </div>
                </Table>}
        </Container>
    )
}