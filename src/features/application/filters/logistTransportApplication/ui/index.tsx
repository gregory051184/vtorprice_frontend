import React from "react";
import {
  AsyncSelect,
  Button,
  DatePicker,
  Drawer,
  Select,
} from "@box/shared/ui";
import { useEvent, useStore } from "effector-react";
import FilterIcon from "@assets/icons/24_filter.svg";
import { useBoolean } from "@box/shared/hooks";
import { citySelectApi } from "@box/entities/city";
import { useForm } from "@box/shared/effector-forms";
import { SearchDebounce } from "@box/shared/ui/input/searchDebounce";
import {
  logistTransportApplicationStatusSelectValues,
  transportApplicationStatusSelectValues,
} from "@box/entities/logistics/lib/selects";
import { filters, applyTableFilters } from "../model";
import { $authStore } from "@box/entities/auth";
import { ROLE } from "@box/types";
import classNames from "classnames";
import s from './style.module.scss';


export const LogistTransportApplicationListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(applyTableFilters);
  const { user } = useStore($authStore);

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
            placeholder="Дата создания"
            className="grow"
            value={[fields.createdAt.value[0], fields.createdAt.value[1]]}
            onChange={fields.createdAt.onChange}
          />
          {user?.role.id === ROLE.LOGIST ? (
            <Select
              placeholder="Статус"
              inputProps={{ mode: "stroke" }}
              data={logistTransportApplicationStatusSelectValues}
              value={fields.logistStatus.value}
              onSelect={fields.logistStatus.onChange}
            />
          ) : (
            <Select
              placeholder="Статус"
              inputProps={{ mode: "stroke" }}
              data={transportApplicationStatusSelectValues}
              value={fields.status.value}
              onSelect={fields.status.onChange}
            />
          )}
          <AsyncSelect
            placeholder="Откуда"
            inputProps={{ mode: "stroke" }}
            loadData={citySelectApi}
            value={fields.shipping_city.value}
            onSelect={fields.shipping_city.onChange}
          />
          <AsyncSelect
            placeholder="Куда"
            inputProps={{ mode: "stroke" }}
            loadData={citySelectApi}
            value={fields.delivery_city.value}
            onSelect={fields.delivery_city.onChange}
          />
        </div>
      </Drawer>
      <div className={classNames("mt-[30px] flex gap-[20px]", s.filters)}>
        <SearchDebounce
          className="grow"
          onChange={fields.search.onChange}
          value={fields.search.value}
        />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
