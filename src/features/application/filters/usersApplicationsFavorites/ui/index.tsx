import React, { useState } from 'react';
import { useEvent } from 'effector-react';
import FilterIcon from '@assets/icons/24_filter.svg';

import { IWithClass } from '@types';
import {
  AsyncSelect, Button, DatePicker, Drawer, SearchInput, Select 
} from '@box/shared/ui';
import { useBoolean, useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { collectionTypeSelectApi, recyclablesSelectApi } from '@box/entities/company';
import {
    applicationRecyclableStatusSelectValues,
    dealTypeSelectValues,
    urgencyTypeSelectValues
} from '@box/entities/application';
import { citySelectApi } from '@box/entities/city';
import { useField, useForm } from '@box/shared/effector-forms';

import { applyFavoritesFilters, filters } from '../model';

import s from './style.module.scss';
import classNames from 'classnames';

const Search: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.search);
  const [val, setVal] = useState('');
  const debouncedVal = useDebounce(val, 500);

  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};

export const UsersFavoritesApplicationListFilters = () => {
  const { value, toggle } = useBoolean(false);
  const { fields, reset } = useForm(filters);
  const applyFilters = useEvent(applyFavoritesFilters);
  
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
            className="grow"
            onChange={fields.createdAt.onChange}
          />
          <AsyncSelect 
            placeholder="Тип компании"
            value={fields.activity_types__rec_col_types.value}
            inputProps={{ mode: 'stroke' }}
            loadData={collectionTypeSelectApi} 
            onSelect={fields.activity_types__rec_col_types.onChange}
          />
          <AsyncSelect
            placeholder="Вторсырье"
            value={fields.recyclables.value}
            inputProps={{ mode: 'stroke' }}
            loadData={recyclablesSelectApi} 
            onSelect={fields.recyclables.onChange}
          />
          <Select 
            value={fields.deal_type.value}
            onSelect={fields.deal_type.onChange}
            placeholder="Тип заявки"
            inputProps={{ mode: 'stroke' }}
            data={dealTypeSelectValues} 
          />

            <Select
                value={fields.application_recyclable_status.value}
                onSelect={fields.application_recyclable_status.onChange}
                placeholder="Тип сырья"
                inputProps={{ mode: 'stroke' }}
                data={applicationRecyclableStatusSelectValues}
            />

          <Select
            placeholder="Срочность"
            value={fields.urgency_type.value}
            onSelect={fields.urgency_type.onChange}
            data={urgencyTypeSelectValues}
          />
          <AsyncSelect
            placeholder="Город"
            value={fields.company__city.value}
            inputProps={{ mode: 'stroke' }}
            loadData={citySelectApi}
            onSelect={fields.company__city.onChange}
          />
        </div>
      </Drawer>
      <div className={classNames("mt-[30px] flex gap-[20px]", s.buttons )}>
        <Search className="grow" />
        <Button onClick={toggle} mode="stroke" iconRight={<FilterIcon />}>
          Фильтр
        </Button>
      </div>
    </div>
  );
};
