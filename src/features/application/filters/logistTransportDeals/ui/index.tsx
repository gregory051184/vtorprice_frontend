import React from "react";
import {
  BaseInput,
  Button,
  DatePicker,
  Drawer,
  Select,
} from "@box/shared/ui";
import { useEvent } from "effector-react";
import FilterIcon from "@assets/icons/24_filter.svg";
import { useBoolean } from "@box/shared/hooks";
import { useForm } from "@box/shared/effector-forms";
import { SearchDebounce } from "@box/shared/ui/input/searchDebounce";
import {
  transportApplicationStatusSelectValues,
} from "@box/entities/logistics/lib/selects";
import { filters, applyTableFilters } from "../model";

export const LogistActiveTransportApplicationListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(applyTableFilters);

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
            placeholder="Дата создания"
            className="grow"
            value={[fields.createdAt.value[0], fields.createdAt.value[1]]}
            onChange={fields.createdAt.onChange}
          />
          <div className="flex gap-[14px] items-center">
            <BaseInput
              placeholder="Цена доставка от"
              mode="stroke"
              type="number"
              value={fields.price__gte.value}
              onChange={fields.price__gte.onChange}
            />
            <p className="text-grey-30">-</p>
            <BaseInput
              placeholder="Цена доставки до"
              mode="stroke"
              type="number"
              value={fields.price__lte.value}
              onChange={fields.price__lte.onChange}
            />
          </div>
          <Select
            placeholder="Статус"
            inputProps={{ mode: "stroke" }}
            data={transportApplicationStatusSelectValues.filter((item) => item.id !== 1)}
            value={fields.status.value}
            onSelect={fields.status.onChange}
          />
        </div>
      </Drawer>
      <div className="mt-[30px] flex gap-[20px]">
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
