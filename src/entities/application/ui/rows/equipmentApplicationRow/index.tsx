import React from "react";
import { useRouter } from "next/router";

import { Rating, Table, TextClamp } from "@box/shared/ui";
import { Avatar } from "@box/entities/user";
import Varified from "@assets/icons/16_verified.svg";
import Reliable from "@assets/icons/16_reliable.svg";

import { IApplicationsFavoriteRow } from "./types";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";

export const EquipmentApplicationRow: React.FC<IApplicationsFavoriteRow> = ({
  application,
  buttons,
}) => {
  const router = useRouter();
  const authStore = useStore($authStore);
  return (
    <Table.Row
      className="cursor-pointer"
      onClick={() => {
        router.push(`/equipment-applications/${application.id}`);
      }}
    >
      <Table.Cell className="max-w-[300px] min-w-[200px]">
        <div className="flex items-center  gap-6">
          <Avatar
            className="shrink-0"
            size="sm"
            url={application?.images[0]?.image || null}
          />
          <p>{application.equipment.name}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="">
        <p className="mb-2">
          {application.company.name}
          <div className="mt-2 mb-2">
            {application.company.status?.id === 2 && (
              <Varified className="scale-150" />
            )}
            {application.company.status?.id === 3 && (
              <div className="flex gap-2">
                <Varified className="scale-150" />
                <Reliable className="scale-150" />
              </div>
            )}
          </div>
        </p>
        <Rating
          rating={application.company.averageReviewRate}
          total={application.company.dealsCount || 0}
        />
      </Table.Cell>
      <Table.Cell className="">
        <p>{`${application.price} ₽`}</p>
      </Table.Cell>
      <Table.Cell className="">
        <TextClamp>{authStore.isAuth ? application.address : "Недоступно для не авторизованных пользователей"}</TextClamp>
      </Table.Cell>
      <Table.Cell>
        <p>
          {new Intl.DateTimeFormat("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour12: false,
          }).format(new Date(application.manufactureDate))}
        </p>
      </Table.Cell>
      <Table.Cell>{buttons}</Table.Cell>
    </Table.Row>
  );
};
