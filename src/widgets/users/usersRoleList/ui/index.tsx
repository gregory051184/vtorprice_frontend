import React from "react";
import { useGate, useStore, useUnit } from "effector-react";
import classNames from "classnames";

import { Pagination, Table } from "@box/shared/ui";
import { useScreenSize } from "@box/shared/hooks";
import { useOrdering } from "@box/shared/lib/factories";
import { SearchDebounce } from "@box/shared/ui/input/searchDebounce";

import { headers } from "../lib";
import { ITransportApplicationsList } from "./types";
import {
  $allUsers,
  allUsersLoading,
  filters,
  gate,
  ordering,
  pagination,
  updateUserRoleFx,
} from "../model";

import s from "./style.module.scss";
import { UserRoleRow } from "@box/entities/statistics/ui/rows/userRoleRow";
import { UserRoleCard } from "@box/entities/statistics/ui/rows/userRoleCard";
import { useForm } from "@box/shared/effector-forms";

export const UsersRoleList: React.FC<ITransportApplicationsList> = ({
  className,
}) => {
  const allUsers = useStore($allUsers);
  const loadingAllUsers = useStore(allUsersLoading.$loaderStore);
  const filtersForRole = useForm(filters);
  const changeRole = useUnit(updateUserRoleFx);
  const ord = useOrdering(ordering);

  const [, satisfies] = useScreenSize();

  useGate(gate);

  const handleRoleChange = (idUser: number, idRole?: number) => {
    idRole && changeRole({ idUser, roleId: idRole });
  };

  return (
    <div className={className}>
      <SearchDebounce
        value={filtersForRole.fields.search.value}
        onChange={filtersForRole.fields.search.onChange}
      />
      {satisfies("md") ? (
        <Table
          separate
          pagination={<Pagination pagination={pagination} />}
          loading={loadingAllUsers}
          empty={allUsers.length === 0}
          className={classNames("mt-[14px]", s.table_view, className)}
        >
          <Table.Head
            headers={headers}
            ordering={ord.ordering}
            onOrderingChange={ord.setOrdering}
          />
          <Table.Body>
            {allUsers.map((user) => (
              <UserRoleRow
                className="text-sm font-medium"
                user={user}
                key={user.id}
                onRoleChange={(val) => handleRoleChange(user.id, val?.value)}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className={s.card_view}>
          <div className={classNames(s.card_view_block)}>
            {allUsers.map((user) => (
              <UserRoleCard
                className={s.card_view_card}
                key={user.id}
                user={user}
                onRoleChange={(val) => handleRoleChange(user.id, val?.value)}
              />
            ))}
          </div>
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>
  );
};
