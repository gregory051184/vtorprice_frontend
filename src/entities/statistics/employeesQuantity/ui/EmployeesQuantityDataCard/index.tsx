import classNames from "classnames";
import { IEmployeesQuantityDataCard } from "./types";

export const EmployeesQuantityDataCard: React.FC<IEmployeesQuantityDataCard> = ({
    Icon,
    nEmployee,
    employeeType,
    className
  }) => { 

    return(
        <div className={classNames('flex gap-[10px] flex-col justify-center items-start border border-grey-20 rounded-lg px-[25px] py-[30px]', className)}>
            <div>
                <Icon className="ml-[-5px]"/>
            </div>
            <div className="text-sm">
                <p>{nEmployee}</p>
            </div>
            <div className="flex gap-[10px]">
                <p className="text-sm font-medium text-gray-40">{employeeType}</p>
            </div>
        </div>
   );
  };