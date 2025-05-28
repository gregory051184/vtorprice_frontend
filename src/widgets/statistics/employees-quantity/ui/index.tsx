import { IWithClass } from "@box/types";
import s from "./style.module.scss";
import classNames from "classnames";
import { gate } from "../model";
import { useGate, useStore } from "effector-react";
import { employeesQuantityModel } from "@box/entities/statistics";
import { EmployeesQuantityDataCard } from "@box/entities/statistics/employeesQuantity/ui/EmployeesQuantityDataCard";
import LogistIcon from "@assets/icons/lucide_truck.svg";
import ManagerIcon from "@assets/icons/Lorry.svg";

export const EmployeesQuantity: React.FC<IWithClass> = ({ className }) => {
  useGate(gate);
  const employeesQuantityData = useStore(
    employeesQuantityModel.$employeesQuantity
  );
  return (
    <div className={classNames("mt-[28px]", className)}>
      <div>
        <h1 className="font-normal text-2xl">
          Количество сотрудников VtorPrice:{" "}
          {employeesQuantityData?.logists + employeesQuantityData?.managers}
        </h1>
      </div>
      <div
        className={classNames(
          "grid gap-[16px] grid-cols-4 mt-[28px]",
          s.card_view,
          className
        )}
      >
        <EmployeesQuantityDataCard
          Icon={LogistIcon}
          nEmployee={employeesQuantityData?.logists}
          employeeType={"Количество логистов"}
        />
        <EmployeesQuantityDataCard
          Icon={ManagerIcon}
          nEmployee={employeesQuantityData?.managers}
          employeeType={"Количество менеджеров"}
        />
      </div>
    </div>
  );
};
