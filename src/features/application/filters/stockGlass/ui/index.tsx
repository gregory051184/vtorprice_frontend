import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  AsyncSelect, BaseInput, DatePicker
} from '@box/shared/ui';
import { citySelectApi } from '@box/entities/city';
import { useField, useForm } from '@box/shared/effector-forms';
import { IWithClass } from '@types';
import { useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { filters } from '../model';
import s from './styles.module.scss';

const WeightField: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.total_weight__gte);
  const [val, setVal] = useState('');
  const debounce = useDebounce(val, 300);

  useEffectAfterMount(() => {
    onChange(debounce);
  }, [debounce]);
  return (
    <BaseInput
      placeholder="Общий вес, т"
      mode="stroke"
      className={className}
      value={val}
      onChange={setVal}
    />
  );
};

const PriceGteField: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.price__gte);
  const [val, setVal] = useState('');
  const debounce = useDebounce(val, 300);

  useEffectAfterMount(() => {
    onChange(debounce);
  }, [debounce]);
  return (
    <BaseInput
      placeholder="Цена, от"
      mode="stroke"
      className={className}
      value={val}
      onChange={setVal}
    />
  );
};

const PriceLteField: React.FC<IWithClass> = ({ className }) => {
  const { onChange } = useField(filters.fields.price__lte);
  const [val, setVal] = useState('');
  const debounce = useDebounce(val, 300);

  useEffectAfterMount(() => {
    onChange(debounce);
  }, [debounce]);
  return (
    <BaseInput
      placeholder="Цена, до"
      mode="stroke"
      className={className}
      value={val}
      onChange={setVal}
    />
  );
};

export const StockGlassFilters:React.FC<IWithClass & {
  urgencyType: number
}> = ({
  className,
  urgencyType
}) => {
  const { fields } = useForm(filters);
  useEffect(() => {
    fields.urgency_type.onChange(urgencyType);
  }, [urgencyType]);
  return (
    <div className={classNames('flex items-center gap-[10px]', s.container, className)}>
      <div className={classNames('flex gap-[10px]', s.top)}>
        <AsyncSelect
          inputProps={{
            mode: 'stroke',
          }}
          className="grow"
          withClearButton
          onSelect={fields.city.onChange}
          value={fields.city.value}
          placeholder="Город"
          loadData={citySelectApi}
        />
        <DatePicker mode="stroke" value={fields.createdAt.value} onChange={fields.createdAt.onChange} />
        <WeightField className="grow" />
      </div>
      <div className={classNames('flex gap-[10px] items-center', s.bottom)}>
        <PriceGteField className="grow" />
        <span className={s.separator}>-</span>
        <PriceLteField className="grow" />
      </div>
    </div>
  );
};
