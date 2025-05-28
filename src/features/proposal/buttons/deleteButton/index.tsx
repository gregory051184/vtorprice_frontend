import React, { MouseEventHandler } from "react";
import { useConfirm } from "@box/entities/notification";
import { IProposalDeleteButton } from "./types";

export const ProposalDeleteButton: React.FC<IProposalDeleteButton> = ({
                                                                                children,
                                                                                deleteProposal,
                                                                                proposalId,
                                                                                proposalDate,
                                                                                className,
                                                                            }) => {
    const { confirm } = useConfirm();

    const onDeleteClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.stopPropagation();
        let message = "";
        if (proposalDate) {
            const serializeDate = new Intl.DateTimeFormat("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour12: false,
            }).format(new Date(proposalDate));
            message = `Вы действительно хотите удалить предложение на от ${serializeDate}?`;
        } else {
            message = "Вы действительно хотите удалить предложение?";
        }
        const shouldDelete = await confirm({
            title: "Удаление предложения",
            message,
        });

        if (shouldDelete) {
            deleteProposal(proposalId);
        }
    };
    return (
        <div className={className}>
            {React.cloneElement(children, {
                onClick: onDeleteClick,
            })}
        </div>
    );
};
