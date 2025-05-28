import React, {useEffect} from "react";
import {useGate, useStore} from "effector-react";
import {$applications} from "@box/entities/application/model";
import {Container, Pagination, Table} from "@box/shared/ui";
import {AppCardForShortListForMainPage,} from '@box/entities/application';
import {useScreenSize} from "@box/shared/hooks";
import {gate, mainPagePagination} from "@box/widgets/applications/applicationsListForMainPage/model";



export const ShortListOfApplicationsForMainPage = () => {
    const applications = useStore($applications);
    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    useEffect(() => {
    }, [applications]);

    //useGate(forMainPageGate);
    useGate(gate);

    return (
        <Container>
            <Table pagination={<Pagination pagination={mainPagePagination}/>}>
                <div className="inline-flex">
                    <div>
                        {applications
                            //@ts-ignore
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(application => (
                                <AppCardForShortListForMainPage application={application} key={application.id}/>))}
                    </div>
                </div>
            </Table>
        </Container>
    )
}