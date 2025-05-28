import {useRouter} from "next/router";
import {useGate, useStore, useUnit} from "effector-react";
import {Button, Container} from "@box/shared/ui";
import React, {useEffect} from "react";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@box/layouts";
import classNames from "classnames";
import s from "@box/widgets/applications/applicationsListForMainPage/ui/style.module.scss";
import StarImg from "@box/shared/ui/starImg";
import {useScreenSize} from "@box/shared/hooks";
import {$authStore} from "@box/entities/auth";
import {companyModel} from "@box/entities/company";
import {
    $equipmentProposalForCompanies,
    equipmentProposalForCompaniesGate
} from "@box/pages/profile/equipment_proposals";
import { EquipmentProposalRow } from "@box/entities/equipment_proposal/ui/row";


export const EquipmentProposalPageForCompanies = () => {
    const router = useRouter();
    const company = useStore($authStore);
    const equipmentProposal = useStore($equipmentProposalForCompanies);
    const updateInFavorite = useUnit(companyModel.updateCompanyInFavoriteEvent);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const handleChangeInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (event) {
            event.stopPropagation();
        }
        updateInFavorite({id});
    };

    useGate(equipmentProposalForCompaniesGate);
    useEffect(() => {
    }, [equipmentProposal]);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Container>
                <div className="mt-5 w-full">
                    {company.user?.company.id !== equipmentProposal?.applications[0]?.company?.id ?
                        <div>
                            <Button
                                className={classNames("shrink-0", s.favorite)}
                                //@ts-ignore
                                onClick={(event) => handleChangeInFavorite(proposal?.applications[0]?.company?.id, event)}
                                mode="notFilled"
                                iconLeft={<StarImg width={20}
                                                   style={{fill: `${equipmentProposal?.applications[0]?.company?.isFavorite ? '' : 'none'}`}}/>}
                            >
                            </Button>
                        </div> :
                        <div>
                            <p className="text-red-dark mt-[8px] whitespace-nowrap w-52">{"Ваша компания"}</p>
                        </div>
                    }
                    <h3
                        className="cursor-pointer"
                        onClick={() => router.push(`/companies/${company.user?.company.id}`)}
                    >
                        {`${equipmentProposal?.applications[0]?.company?.name} предлагает Вам сотрудничество`}
                    </h3>
                    {equipmentProposal && equipmentProposal.applications.map((application) => (
                        <EquipmentProposalRow application={application} key={application.id} />))}
                </div>
            </Container>
        </AppShell>
    )
}