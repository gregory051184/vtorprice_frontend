import React, { useState } from "react";
import { useEvent } from "effector-react";
import classNames from "classnames";
import {
  AsyncSelect,
  Button,
  DatePicker,
  Drawer,
  SearchInput,
} from "@box/shared/ui";
import { IWithClass } from "@types";
import FilterIcon from "@assets/icons/24_filter.svg";
import {
  useBoolean,
  useDebounce,
  useEffectAfterMount,
} from "@box/shared/hooks";
import {
  collectionTypeSelectApi,
  recyclablesSelectApi,
} from "@box/entities/company";
import { citySelectApi } from "@box/entities/city";
import { useField, useForm } from "@box/shared/effector-forms";
import { applyFavoritesFilters, filters } from "../model";

import s from "./style.module.scss";

const Search: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.search);
  const [val, setVal] = useState("");
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return (
    <SearchInput
      value={val}
      onChange={setVal}
      className={className}
      mode="stroke"
    />
  );
};

export const UsersFavoritesCompaniesListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(applyFavoritesFilters);

  return (
    <div>
      <Drawer
        disableClickOutside
        bottomActions={
          <div className="flex gap-[15px]">
            <Button
              onClick={() => {
                applyFilters();
                toggle();
              }}
              className="grow"
            >
              Применить
            </Button>
            <Button
              onClick={() => {
                reset();
                toggle();
              }}
              className="grow"
              mode="light"
            >
              Сбросить
            </Button>
          </div>
        }
        title="Фильтр"
        visible={value}
        close={toggle}
      >
        <div className="grid grid-cols-1 auto-rows-auto gap-[25px]">
          <DatePicker
            mode="stroke"
            value={fields.createdAt.value}
            className="grow"
            onChange={fields.createdAt.onChange}
          />
          <AsyncSelect
            placeholder="Тип компании"
            value={fields.activity_types__rec_col_types.value}
            inputProps={{ mode: "stroke" }}
            loadData={collectionTypeSelectApi}
            onSelect={fields.activity_types__rec_col_types.onChange}
          />
          <AsyncSelect
            placeholder="Вторсырье"
            value={fields.recyclables.value}
            inputProps={{ mode: "stroke" }}
            loadData={recyclablesSelectApi}
            onSelect={fields.recyclables.onChange}
          />
          <AsyncSelect
            placeholder="Город"
            value={fields.company__city.value}
            inputProps={{ mode: "stroke" }}
            loadData={citySelectApi}
            onSelect={fields.company__city.onChange}
          />
        </div>
      </Drawer>
      <div className={classNames("mt-[30px] flex gap-[20px]", s.buttons)}>
        <Search className="grow" />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
