import React from "react";
import ManagerSvg from "@assets/icons/Manager.svg";
import AdminSvg from "@assets/icons/Admin.svg";
import UserSvg from "@assets/icons/User.svg";
import LogistSvg from "@assets/icons/Logist.svg";
import { useGate, useStore } from "effector-react";
import { $totalEmploy, gate } from "../model";
import s from "./style.module.scss";

const RoleCards = () => {
  const totalEmploy = useStore($totalEmploy);

  useGate(gate);

  return (
    <div className={s.wrapper}>
      <div className={s.card}>
        <UserSvg />
        <div>
          <h3 className="font-medium text-2xl">
            {totalEmploy?.users || "-"}
          </h3>
          <p className="text-grey-70">Пользователей</p>
        </div>
      </div>
      <div className={s.card}>
        <ManagerSvg />
        <div>
          <h3 className="font-medium text-2xl">
            {totalEmploy?.managers || "-"}
          </h3>
          <p className="text-grey-70">Менеджеров</p>
        </div>
      </div>
      <div className={s.card}>
        <LogistSvg />
        <div>
          <h3 className="font-medium text-2xl">
            {totalEmploy?.logists || "-"}
          </h3>
          <p className="text-grey-70">Логистов</p>
        </div>
      </div>
      <div className={s.card}>
        <AdminSvg />
        <div>
          <h3 className="font-medium text-2xl">
            {totalEmploy?.admins || "-"}
          </h3>
          <p className="text-grey-70">Администраторов</p>
        </div>
      </div>
    </div>
  );
};

export default RoleCards;
