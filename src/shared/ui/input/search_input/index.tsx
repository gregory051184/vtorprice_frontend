import React from 'react';
import Search from '@assets/icons/icon_search.svg';
import { ISearchInput } from '../types';
import { AppInput } from '../app_input';

export const SearchInput: React.FC<ISearchInput> = (props) => (
  <AppInput
    placeholderPlain
    placeholder="Поиск"
    iconLeft={<Search />}
    {...props}
  />
);
