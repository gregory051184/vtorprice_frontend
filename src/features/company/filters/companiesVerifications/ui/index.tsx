import { AsyncSelect, SearchInput } from '@box/shared/ui';
import React, { useState } from 'react';
import { useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import classNames from 'classnames';
import { collectionTypeSelectApi, recyclablesSelectApi } from '@box/entities/company/api/selects';
import { citySelectApi } from '@box/entities/city/api/selects';
import { useField, useForm } from '@box/shared/effector-forms';
import {
  filters
} from '../model';
import s from './style.module.scss';

const Search = () => {
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

export const CompaniesVerificationsListFilters = () => {
  const { fields } = useForm(filters);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className={classNames('flex items-center gap-[20px]', s.filter, s.filter_head)}>
        <AsyncSelect
          withClearButton
          value={fields.company__recyclables__recyclables__category.value}
          onSelect={fields.company__recyclables__recyclables__category.onChange}
          loadData={recyclablesSelectApi}
          className={classNames('w-[270px] shrink-0', s.field)}
          inputProps={{
            mode: 'stroke',
          }}
          placeholder="Категория"
        />
        <Search />
      </div>
      <div className={classNames('flex gap-[20px]', s.filter)}>
      <AsyncSelect
          withClearButton
          value={fields.collection_type.value}
          onSelect={fields.collection_type.onChange}
          withSearch={false}
          wide
          inputProps={{ mode: 'stroke' }}
          containerSize={1220}
          loadData={collectionTypeSelectApi}
          className={classNames(s.field, 'grow shrink-0')}
          placeholder="Тип компании"
        />
        <AsyncSelect
          withClearButton
          loadData={citySelectApi}
          inputProps={{ mode: 'stroke' }}
          onSelect={fields.company__city.onChange}
          value={fields.company__city.value}
          className={classNames('grow shrink-0')}
          placeholder="Расположение"
        />
      </div>
    </div>
  );
};
