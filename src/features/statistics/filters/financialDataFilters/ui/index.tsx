import classNames from "classnames";

import {DatePicker, SearchInput, TabSelect} from "@box/shared/ui";
import {useField, useForm} from "@box/shared/effector-forms";
import { selectValues } from "@box/entities/statistics/api/selects";
import { IWithClass } from "@box/types";

import { filters } from "../model";

import s from "./style.module.scss";
import React, {useState} from "react";
import {useDebounce, useEffectAfterMount} from "@box/shared/hooks";

const CompanySearchForInvoices = () => {
  const search = useField(filters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 300);

  useEffectAfterMount(() => {
    search.onChange(debouncedVal);
  }, [debouncedVal]);
  return (
      <SearchInput
          value={val}
          onChange={setVal}
          className={classNames('grow', s.field)}
          mode="stroke"
          placeholder="Введите название компании.."
      />
  );
};


export const FinancialDataFilters: React.FC<IWithClass> = ({ className }) => {
  const { fields } = useForm(filters);

  return (
      <div>
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
        value={[fields.created_at.value[0], fields.created_at.value[1]]}
        onChange={fields.created_at.onChange}
      />
    </div>
        <CompanySearchForInvoices/>
      </div>
  );
};
