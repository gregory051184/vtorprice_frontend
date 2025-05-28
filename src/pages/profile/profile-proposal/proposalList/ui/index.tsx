import React, {useEffect, useState} from "react";
import {useGate, useStore} from "effector-react";
import {$proposals, deleteProposalFx, gate} from "@box/pages/profile/proposals/proposal";
import {useRouter} from "next/router";
import {Button, Checkbox} from "@box/shared/ui";
import {IProposalListForSending} from "@box/pages/profile/profile-proposal/proposalList/ui/type";
import s from './styles.module.scss';
import TrashIcon from "@assets/icons/24_delete.svg";
import {useUnit} from "effector-react/compat";
import {useScreenSize} from "@box/shared/hooks";

export const ProposalList: React.FC<IProposalListForSending> = ({
                                                                    onChange,
                                                                }) => {
    const router = useRouter();

    const proposals = useStore($proposals);

    const deleteProposal = useUnit(deleteProposalFx);

    const [checkingList, setCheckingList] = useState<Array<number>>([]);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const removeProposalHandler = async (proposalId: number) => {
        await deleteProposal(proposalId);
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
    }, [proposals, checkingList]);

    return (
        <div className="mt-6 h-auto">
            {!isMobile && <div className={s.proposal_div}>
                <h3 className={s.title}>
                    Сформированные предложения
                </h3>
                <div className="mt-5 inline-flex">
                    <h4 className="ml-[5vw]">Организации</h4>
                    <h4 style={{marginLeft: '10vw'}} className="ml-[10vw]">Ваши объявления в предложение</h4>
                </div>
                {proposals.map(proposal => (
                    <div key={proposal.id}
                         className={s.proposal}>
                        <div>
                            <Checkbox checked={checkingList.includes(proposal.id)}
                                      onChange={(b) => makeChoice(proposal.id)}/>
                        </div>
                        <div className="mt-5 w-[13vw]">
                            {proposal.companies.map(company => (
                                <div
                                    key={company.id}
                                    className="inline-flex"
                                    onClick={() => router.push(`/companies/${company.id}`)}>
                                    <p className="ml-3 w-[4vw]">{company.name}</p>
                                    <p style={{/*marginLeft: '10px', width: '8vw'*/}} className="ml-3 w-[8vw]">
                                        {company.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="ml-5 mt-5 w-[16vw]">
                            {proposal.applications.map((application) => (
                                <div
                                    key={application.id}
                                    className="inline-flex"
                                    onClick={() => router.push(`/applications/${application.id}`)}>
                                    <div>
                                        <img
                                            className="rounded-[10px] w-[100px] h-[100px] object-cover cursor-pointer"
                                            src={
                                                application.images[0] ? application.images[0].image
                                                    : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p>{application.recyclables.name}</p>
                                        <p>Вес {application.totalWeight ? `${application.totalWeight} кг` : '--'}</p>
                                        <p style={{/*marginTop: '10px'*/}}
                                           className="mt-3">{application.price} руб/кг</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 w-auto">
                            <Button
                                mode='light'
                                onClick={() => router.push(`/profile/proposals/${proposal.id}/`)}
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
                {proposals.map(proposal => (
                    <div className={s.proposal_mobile} key={proposal.id}>
                        <div className="inline-flex"/*className={s.proposal}*/>
                            <div>
                                <Checkbox checked={checkingList.includes(proposal.id)}
                                          onChange={(b) => makeChoice(proposal.id)}/>
                            </div>
                            <div className="mt-5 w-44">
                                {proposal.companies.map(company => (
                                    <div
                                        key={company.id}
                                        /*className="inline-flex"*/
                                        onClick={() => router.push(`/companies/${company.id}`)}>
                                        <p className="w-[28vw]">{company.name}</p>
                                        <p className="w-[28vw]">
                                            {company.address}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="ml-4 w-44">
                                {proposal.applications.map((application) => (
                                    <div
                                        key={application.id}
                                        onClick={() => router.push(`/applications/${application.id}`)}>
                                        <div>
                                            <img
                                                className="rounded-[10px] w-[100px] h-[100px] object-cover cursor-pointer"
                                                src={
                                                    application.images[0] ? application.images[0].image
                                                        : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div>
                                            <p>{application.recyclables.name}</p>
                                            <p>Вес {application.totalWeight ? `${application.totalWeight} кг` : '--'}</p>
                                            <p >{application.price} руб/кг</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5">
                            <Button
                                fullWidth={true}
                                mode='light'
                                onClick={() => router.push(`/profile/proposals/${proposal.id}/`)}
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