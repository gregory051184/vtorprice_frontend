import React, { MouseEventHandler } from "react";
import { useConfirm } from "@box/entities/notification";
import { IApplicationDeleteButton } from "./types";

export const ApplicationDeleteButton: React.FC<IApplicationDeleteButton> = ({
  children,
  deleteApplication,
  applicationId,
  aplicationType,
  applicationDate,
  className,
}) => {
  const { confirm } = useConfirm();

  const onDeleteClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    let message = "";
    if (aplicationType && applicationDate) {
      const serializeDate = new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
      }).format(new Date(applicationDate));
      message = `Вы действительно хотите удалить заявку на "${aplicationType}" от ${serializeDate}?`;
    } else {
      message = "Вы действительно хотите удалить заявку?";
    }
    const shouldDelete = await confirm({
      title: "Удаление заявки",
      message,
    });

    if (shouldDelete) {
      deleteApplication(applicationId);
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
