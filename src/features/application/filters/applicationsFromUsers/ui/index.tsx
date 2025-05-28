import React, { useState } from 'react';
import {
  AsyncSelect, BaseInput,
  Button, Drawer, SearchInput, TabSelect,
} from '@box/shared/ui';
import { IWithClass } from '@types';
import FilterIcon from '@assets/icons/24_filter.svg';
import { useBoolean, useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { recyclablesSelectApi } from '@box/entities/company';
import { citySelectApi } from '@box/entities/city';
import { useField, useForm } from '@box/shared/effector-forms';
import { useEvent } from 'effector-react';
import { urgencyTypeSelectValues } from '@box/entities/application';
import { filters, applyFilters as apFilters } from '../model';
import s from './style.module.scss';

const Search: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};
export const ApplicationsFromUsersListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(apFilters);
  return (
    <div>
      <Drawer
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
          <AsyncSelect
            value={fields.recyclables.value}
            placeholder="Тип вторсырья"
            inputProps={{ mode: 'stroke' }}
            loadData={recyclablesSelectApi}
            onSelect={fields.recyclables.onChange}
          />
          <div className="flex gap-[14px]">
            <BaseInput
              value={fields.price__gte.value}
              onChange={fields.price__gte.onChange}
              mode="stroke"
              placeholder="Цена от"
            />
            <p className='self-center text-grey-40'>–</p>
            <BaseInput
              value={fields.price__lte.value}
              onChange={fields.price__lte.onChange}
              mode="stroke"
              placeholder="Цена до"
            />
          </div>
          <div className="flex gap-[14px]">
            <BaseInput
              value={fields.total_weight__gte.value}
              onChange={fields.total_weight__gte.onChange}
              mode="stroke"
              placeholder="Вес, т от"
            />
            <p className='self-center text-grey-40'>–</p>
            <BaseInput
              value={fields.total_weight__lte.value}
              onChange={fields.total_weight__lte.onChange}
              mode="stroke"
              placeholder="Вес, т до"
            />
          </div>
          <AsyncSelect
            placeholder="Город"
            inputProps={{ mode: 'stroke' }}
            loadData={citySelectApi}
            value={fields.city.value}
            onSelect={fields.city.onChange}
          />
        </div>

      </Drawer>

      <TabSelect 
        onChange={fields.urgency_type.onChange} 
        values={urgencyTypeSelectValues} 
        value={fields.urgency_type.value}
        className={s.tabs}
      />
      <div className={`flex gap-[20px] mt-[24px] ${s.adaptiveXXSM}`}>
        <Search className="grow" />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
