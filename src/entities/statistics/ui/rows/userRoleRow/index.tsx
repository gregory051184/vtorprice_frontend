import React from "react";
import { Select, Table } from "@box/shared/ui";
import { IUserRoleRow } from "./types";
import { userRoleValues } from "@box/entities/statistics/api/selects";

export const UserRoleRow: React.FC<IUserRoleRow> = ({ user, onRoleChange, className }) => {
  return (
    <Table.Row className={className}>
      <Table.Cell className="max-w-[300px] min-w-[200px]">
        <p className="">{user.id}</p>
      </Table.Cell>
      <Table.Cell className="">
        <p>
          {user.first_name ? `${user.first_name} ${user.last_name}` : '-'}
        </p>
      </Table.Cell>
      <Table.Cell className="">
        <p>{user.company?.name || '-'}</p>
      </Table.Cell>
      <Table.Cell>
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
      </Table.Cell>
    </Table.Row>
  );
};
