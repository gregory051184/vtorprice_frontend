import React, { FC, useState } from 'react';
import {
  AsyncSelect, BaseInput,
  Button, Drawer, SearchInput, Select, DatePicker
} from '@box/shared/ui';
import { IWithClass } from '@types';
import FilterIcon from '@assets/icons/24_filter.svg';
import { useBoolean, useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { recyclablesCategoriesSelectApi, equipmentCategoriesSelectApi } from '@box/entities/company';
import { useField, useForm } from '@box/shared/effector-forms';
import { useEvent } from 'effector-react';
import { dealStatusSelectValues } from '@box/entities/deal';
import {
  applyUsersApplicationTableFilters,
  applyUsersEquipmentApplicationTableFilters,
  filters,
  equipmentFilters,
} from '../model';
import classNames from "classnames";
import s from './style.module.scss';

const Search: React.FC<IWithClass & { isRecyclables: boolean }> = ({ className, isRecyclables }) => {
  const { onChange } = useField(isRecyclables ? filters.fields.search: equipmentFilters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};
export const UsersDealsListFilters: FC<{ isRecyclables: boolean }> = ({ isRecyclables }) => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const { fields: equipmentFields, reset: equipmentReset } = useForm(equipmentFilters);
  const applyFilters = useEvent(isRecyclables ? applyUsersApplicationTableFilters : applyUsersEquipmentApplicationTableFilters);

  return (
    <div>
      <Drawer
        disableClickOutside
        bottomActions={(
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
                isRecyclables ? reset() : equipmentReset();
                toggle();
              }}
              className="grow"
              mode="light"
            >
              Сбросить
            </Button>
          </div>
        )}
        title="Фильтр"
        visible={value}
        close={toggle}
      >
        <div className="grid grid-cols-1 auto-rows-auto gap-[25px]">

          <DatePicker
            mode="stroke"
            value={isRecyclables ? fields.createdAt.value : equipmentFields.createdAt.value}
            className="grow"
            onChange={isRecyclables ? fields.createdAt.onChange : equipmentFields.createdAt.onChange}
          />
          <Select 
            value={isRecyclables ? fields.status.value : equipmentFields.status.value}
            onSelect={isRecyclables ? fields.status.onChange : equipmentFields.status.onChange}
            placeholder="Статус"
            inputProps={{ mode: 'stroke' }}
            data={dealStatusSelectValues} 
          />
         
          <div className="flex gap-[14px]">
            <BaseInput
              value={isRecyclables ? fields.price__gte.value : equipmentFields.price__gte.value}
              onChange={isRecyclables ? fields.price__gte.onChange : equipmentFields.price__gte.onChange}
              mode="stroke"
              className="grow"
              placeholder="Цена от"
            />
            <BaseInput
              value={isRecyclables ? fields.price__lte.value : equipmentFields.price__lte.value}
              onChange={isRecyclables ? fields.price__lte.onChange : equipmentFields.price__lte.onChange}
              mode="stroke"
              className="grow"
              placeholder="Цена до"
            />
          </div>
        
        </div>

      </Drawer>
      
      <div className={classNames("flex gap-[20px]", s.filters)}>
        <AsyncSelect
          value={isRecyclables ? fields.application__recyclables__category.value : equipmentFields.application__equipment__category.value}
          placeholder="Категория"
          inputProps={{ mode: 'stroke' }}
          wide
          loadData={isRecyclables ? recyclablesCategoriesSelectApi : equipmentCategoriesSelectApi}
          onSelect={isRecyclables ? fields.application__recyclables__category.onChange : equipmentFields.application__equipment__category.onChange}
          withClearButton
        />
        <Search className="grow" isRecyclables={isRecyclables} />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
