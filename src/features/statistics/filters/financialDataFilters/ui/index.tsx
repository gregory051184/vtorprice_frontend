import classNames from "classnames";

import { DatePicker, TabSelect } from "@box/shared/ui";
import { useForm } from "@box/shared/effector-forms";
import { selectValues } from "@box/entities/statistics/api/selects";
import { IWithClass } from "@box/types";

import { filters } from "../model";

import s from "./style.module.scss";

export const FinancialDataFilters: React.FC<IWithClass> = ({ className }) => {
  const { fields } = useForm(filters);

  return (
    <div
      className={classNames(
        "flex mt-[30px] justify-between items-center",
        className,
        s.box
      )}
    >
      <TabSelect
        value={fields.period.value}
        onChange={fields.period.onChange}
        values={selectValues}
      />
      <DatePicker
        placeholder="Выбрать диапазон"
        className={classNames("w-[240px]", s.dataPickerAdaptive)}
        value={[fields.createdAt.value[0], fields.createdAt.value[1]]}
        onChange={fields.createdAt.onChange}
      />
    </div>
  );
};
