import React, { useState } from 'react';
import {
  AsyncSelect, BaseInput,
  Button, DatePicker, Drawer, SearchInput, Select, TabSelect
} from '@box/shared/ui';
import { IWithClass } from '@types';
import FilterIcon from '@assets/icons/24_filter.svg';
import { useBoolean, useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { dealTypeSelectValues } from '@box/entities/application';
import { equipmentSelectApi } from '@box/entities/application/api/selects/equipmentSelect';
import { citySelectApi } from '@box/entities/city';
import { useField, useForm } from '@box/shared/effector-forms';
import { applyUsersEquipmentApplicationTableFilters, usersEquipmentApplicationsTableFilters } from '@box/features/application';
import { useEvent } from 'effector-react';
import { groupTypes } from '../../../lib';
import classNames from "classnames";
import s from './style.module.scss';

const Search: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(usersEquipmentApplicationsTableFilters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};
export const UsersEquipmentApplicationsListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(usersEquipmentApplicationsTableFilters);
  const applyFilters = useEvent(applyUsersEquipmentApplicationTableFilters);
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
                reset();
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
          <TabSelect label="Тип заявок" onChange={fields.status.onChange} values={groupTypes} value={fields.status.value} />
          <DatePicker
            mode="stroke"
            value={fields.created_at.value}
            onChange={fields.created_at.onChange}
            className="grow"
          />
          <Select 
            placeholder="Тип заявки"
            inputProps={{ mode: 'stroke' }}
            data={dealTypeSelectValues} 
            value={fields.deal_type.value}
            onSelect={fields.deal_type.onChange}
          />
          <AsyncSelect
            placeholder="Обуродование"
            inputProps={{ mode: 'stroke' }}
            loadData={equipmentSelectApi} 
            value={fields.equipment.value}
            onSelect={fields.equipment.onChange}
          />
          <div className="flex gap-[14px]">
            <BaseInput
              placeholder="Цена от"
              mode="stroke"
              value={fields.price__gte.value}
              onChange={fields.price__gte.onChange}
            />
            <BaseInput
              placeholder="Цена до"
              mode="stroke"
              value={fields.price__lte.value}
              onChange={fields.price__lte.onChange}
            />
          </div>
          <BaseInput 
            placeholder="Кол-во"
            mode="stroke"
            value={fields.count.value}
            onChange={fields.count.onChange}
          />
          <AsyncSelect
            placeholder="Город"
            inputProps={{ mode: 'stroke' }}
            loadData={citySelectApi}
            value={fields.city.value}
            onSelect={fields.city.onChange}
          />
        </div>

      </Drawer>
      <div className={classNames("mt-[30px] flex gap-[20px]", s.filters)}>
        <Search className="grow" />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
