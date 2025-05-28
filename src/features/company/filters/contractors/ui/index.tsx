import React from 'react';
import { AsyncSelect } from '@box/shared/ui';
import { citySelectApi } from '@box/entities/city';
import { SearchDebounce } from '@box/shared/ui/input/searchDebounce';
import { useForm } from '@box/shared/effector-forms';
import { filters } from '../model';

import s from './style.module.scss'

export const LogistContractorsListFilters = () => {
  const { fields } = useForm(filters);

  return (
    <div className={s.fields}>
      <SearchDebounce 
        className={s.searchField} 
        onChange={fields.search.onChange} 
        value={fields.search.value} 
      />
      <AsyncSelect
        placeholder="Город"
        value={fields.city.value}
        inputProps={{ mode: 'stroke' }}
        loadData={citySelectApi}
        onSelect={fields.city.onChange}
      />
    </div>
  );
};
