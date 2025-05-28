import React from "react";
import {useRouter} from "next/router";
import {EquipmentProposalRowType} from "@box/entities/equipment_proposal";
import {useUnit} from "effector-react";
import TrashIcon from "@assets/icons/24_delete.svg";
import {updateEquipmentProposalFx} from "@box/pages/profile/equipment_proposals";

export const EquipmentProposalApplicationRow: React.FC<EquipmentProposalRowType> = ({
                                                                                        application,
                                                                                        proposal
                                                                                    }) => {
    const updateProposal = useUnit(updateEquipmentProposalFx);
    const router = useRouter();
    const removeApplicationFromProposalHandler = async (applicationId: number) => {
        //@ts-ignore
        await updateProposal({application_id: applicationId, id: proposal.id})
    }
    return (
        <div
            className="inline-flex mt-3">
            <div
                onClick={() => router.push(`/applications/${application.id}`)}
                className="inline-flex"
            >
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
                    <p>{application.equipment.name}</p>
                    <p>Вес {application.manufactureDate ? `${application.manufactureDate} кг` : '--'}</p>
                    <p className="ml-3">{application.price} руб/кг</p>
                </div>
            </div>

            {//@ts-ignore
                proposal.applications.length >= 2 &&
                <div
                    onClick={() => removeApplicationFromProposalHandler(application?.id)}
                    className="ml-8"
                >
                    <TrashIcon className="cursor-pointer" width={30} height={30}/>
                </div>
            }
        </div>
    )
}