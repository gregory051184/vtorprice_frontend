import React, {useEffect, useState} from "react";
import {useGate, useStore} from "effector-react";
import {useRouter} from "next/router";
import {Button, Checkbox} from "@box/shared/ui";
import s from './styles.module.scss';
import TrashIcon from "@assets/icons/24_delete.svg";
import {useUnit} from "effector-react/compat";
import {
    IEquipmentProposalListForSending
} from "@box/pages/profile/profile-equipment-proposal/equipmentProposalList/ui/types";
import {$equipmentProposals, deleteEquipmentProposalFx, gate} from "@box/pages/profile/equipment_proposals";
import {useScreenSize} from "@box/shared/hooks";
import {
    EquipmentProposalApplicationRow
} from "@box/entities/equipment_proposal/ui/row/ui/equipmentProposalApplicationRow";
import {EquipmentProposalCompanyRow} from "@box/entities/equipment_proposal";

export const EquipmentProposalList: React.FC<IEquipmentProposalListForSending> = ({
                                                                                      onChange,
                                                                                  }) => {
    const router = useRouter();

    const equipmentProposals = useStore($equipmentProposals);

    const deleteEquipmentProposal = useUnit(deleteEquipmentProposalFx)

    const [checkingList, setCheckingList] = useState<Array<number>>([]);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const removeProposalHandler = async (proposalId: number) => {
        await deleteEquipmentProposal(proposalId);
    };

    const makeChoice = (proposalId: number) => {
        //@ts-ignore
        if (proposalId && !checkingList.includes(proposalId)) {
            //@ts-ignore
            checkingList.push(proposalId);
            //@ts-ignore
            onChange([...checkingList]);
        } else {
            //@ts-ignore
            const g = checkingList.filter(id => id !== +proposalId);
            setCheckingList([...g])
            //@ts-ignore
            onChange([...g]);
        }
        return
    }

    useGate(gate);

    useEffect(() => {
    }, [equipmentProposals, checkingList]);

    return (
        <div className="mt-6 h-auto">
            {!isMobile && <div className={s.proposal_div}>
                <h3 className={s.title}>
                    Сформированные предложения
                </h3>
                <div className="mt-5 inline-flex">
                    <h4 className="ml-[5vw]">Организации</h4>
                    <h4 className="ml-[10vw]">Ваши объявления в предложение</h4>
                </div>
                {equipmentProposals.map(proposal => (
                    <div key={proposal.id}
                         className={s.proposal}>
                        <div>
                            <Checkbox checked={checkingList.includes(proposal.id)}
                                      onChange={(b) => makeChoice(proposal.id)}/>
                        </div>
                        <div className="mt-5 w-[13vw]">
                            {proposal?.companies.map(company => (
                                <EquipmentProposalCompanyRow company={company} key={company.id} proposal={proposal}/>))}
                        </div>
                        <div className="ml-5 mt-5 w-[16vw]">
                            {proposal?.applications.map((application) => (
                                <EquipmentProposalApplicationRow application={application} key={application.id} proposal={proposal}/>))}
                        </div>
                        <div className="mt-5 w-auto">
                            <Button
                                mode='light'
                                onClick={() => router.push(`/profile/equipment-proposals/${proposal.id}/`)}
                            >{'>>>'}</Button>
                            <div
                                onClick={() => removeProposalHandler(proposal?.id)}
                                className="ml-8 mt-20"
                            >
                                <TrashIcon className="cursor-pointer" width={30} height={30}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>}
            {isMobile && <div className={s.proposal_div}>
                <h3 className={s.title}>
                    Сформированные предложения
                </h3>
                <div className="mt-5 inline-flex">
                    <h4>Организации</h4>
                    <h4 className="ml-28">Ваши объявления в предложение</h4>
                </div>
                {equipmentProposals.map(proposal => (
                    <div className={s.proposal_mobile} key={proposal.id}>
                        <div className="inline-flex"/*className={s.proposal}*/>
                            <div>
                                <Checkbox checked={checkingList.includes(proposal.id)}
                                          onChange={(b) => makeChoice(proposal.id)}/>
                            </div>
                            <div className="mt-5 w-44">
                                {proposal.companies.map(company => (
                                    <EquipmentProposalCompanyRow company={company} key={company.id}/>))}
                            </div>
                            <div className="ml-4 w-44">
                                {proposal.applications.map((application) => (
                                    <EquipmentProposalApplicationRow application={application} key={application.id}/>))}
                            </div>
                        </div>
                        <div className="mt-5">
                            <Button
                                fullWidth={true}
                                mode='light'
                                onClick={() => router.push(`/profile/equipment-proposals/${proposal.id}/`)}
                            >{'Подробнее'}</Button>
                            <Button
                                fullWidth={true}
                                className="mt-3"
                                mode='light'
                                onClick={() => removeProposalHandler(proposal?.id)}
                            >{'Удалить'}</Button>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    )
}