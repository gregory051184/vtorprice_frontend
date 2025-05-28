import React from "react";
import { Select } from "@box/shared/ui";
import classNames from "classnames";
import { IUserRoleCard } from "./types";
import { userRoleValues } from "@box/entities/statistics/api/selects";

export const UserRoleCard: React.FC<IUserRoleCard> = ({
  user,
  onRoleChange,
  className
}) => (
  <div className={classNames("border border-grey-20 border-solid rounded-[10px] p-4 text-sm font-medium", className)}>
    <p className="mb-4">{user.first_name ? `${user.first_name} ${user.last_name}` : '-'}</p>
    <div className="flex justify-between mb-4">
      <p>{user.company?.name || '-'}</p>
      <p>{user.id}</p>
    </div>
    <Select
      value={{
        id: user.role.id,
        label: user.role.label,
        value: user.role.id,
      }}
      onSelect={onRoleChange}
      placeholder="Права"
      inputProps={{ mode: "stroke" }}
      data={userRoleValues}
    />
  </div>
);
