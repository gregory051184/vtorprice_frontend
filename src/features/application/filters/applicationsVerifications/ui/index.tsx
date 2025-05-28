import React, { useState } from 'react';
import {
  AsyncSelect, BaseInput,
  Button, DatePicker, Drawer, SearchInput, Select
} from '@box/shared/ui';
import { IWithClass } from '@types';
import FilterIcon from '@assets/icons/24_filter.svg';
import { useBoolean, useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import {
    applicationRecyclableStatusSelectValues,
    applicationStatusSelectValues,
    dealTypeSelectValues
} from '@box/entities/application';
import { recyclablesSelectApi } from '@box/entities/company';
import { citySelectApi } from '@box/entities/city';
import { useField, useForm } from '@box/shared/effector-forms';
import { useEvent } from 'effector-react';
import { filters, applyApplicationsVerificationTableFilters } from '../model';
import classNames from 'classnames';
import s from './style.module.scss'

const Search: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};
export const ApplicationsVerificationsListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(applyApplicationsVerificationTableFilters);
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
          <DatePicker
            mode="stroke"
            value={fields.createdAt.value}
            onChange={fields.createdAt.onChange}
            inputStyle={s.filters_drawerDataFilter}
          />
          <Select
            value={fields.deal_type.value}
            onSelect={fields.deal_type.onChange}
            placeholder="Тип заявки"
            inputProps={{ mode: 'stroke' }}
            data={dealTypeSelectValues} 
          />
          <Select
              data={applicationRecyclableStatusSelectValues}
              onSelect={fields.application_recyclable_status.onChange}
              value={fields.application_recyclable_status.value}
              inputProps={{ mode: 'stroke' }}
              placeholder="Тип сырья"
          />
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
              placeholder="Вес от, тонны"
            />
            <BaseInput
              value={fields.total_weight__lte.value}
              onChange={fields.total_weight__lte.onChange}
              mode="stroke"
              placeholder="Вес до, тонны"
            />
          </div>
          <AsyncSelect
            placeholder="Город"
            inputProps={{ mode: 'stroke' }}
            loadData={citySelectApi}
            value={fields.city.value}
            onSelect={fields.city.onChange}
          />
          <Select
            value={fields.status.value}
            onSelect={fields.status.onChange}
            placeholder="Статус"
            inputProps={{ mode: 'stroke' }}
            data={applicationStatusSelectValues}
          />
        </div>

      </Drawer>

      <div className={classNames("flex gap-[20px]", s.filters_filters)}>
        <Search className="grow" />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
