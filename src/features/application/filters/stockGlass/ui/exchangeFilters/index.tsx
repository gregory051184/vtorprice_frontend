import React, {useEffect, useState} from 'react';
import {
    AsyncSelect, BaseInput, DatePicker
} from '@box/shared/ui';
import {citySelectApi} from '@box/entities/city';
import {useField, useForm} from '@box/shared/effector-forms';
import {IWithClass} from '@types';
import {useDebounce, useEffectAfterMount, useScreenSize} from '@box/shared/hooks';
import {filters} from '../../model/store';
import {regionSelectApi} from "@box/entities/region";
import {districtSelectApi} from "@box/entities/district";


const WeightFieldGte: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(filters.fields.total_weight__gte);
    const [val, setVal] = useState('');
    const debounce = useDebounce(val, 300);

    useEffectAfterMount(() => {
        onChange(debounce);
    }, [debounce]);
    return (
        <BaseInput
            placeholder="Общий вес от, т"
            mode="stroke"
            className={className}
            value={val}
            onChange={setVal}
        />
    );
};

const WeightFieldLte: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(filters.fields.total_weight__lte);
    const [val, setVal] = useState('');
    const debounce = useDebounce(val, 300);

    useEffectAfterMount(() => {
        onChange(debounce);
    }, [debounce]);
    return (
        <BaseInput
            placeholder="Общий вес до, т"
            mode="stroke"
            className={className}
            value={val}
            onChange={setVal}
        />
    );
};


const PriceGteField: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(filters.fields.price__gte);
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

const PriceLteField: React.FC<IWithClass> = ({className}) => {
    const {onChange} = useField(filters.fields.price__lte);
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

export const ExchangeFractionFilters: React.FC<IWithClass & {
    urgencyType: number
}> = ({
          className,
          urgencyType
      }) => {
    const {fields} = useForm(filters);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    useEffect(() => {
        fields.urgency_type.onChange(urgencyType);
    }, [urgencyType]);
    return (
        <div className={(!isLaptop && !isMobile) ? 'shrink-0 w-[230px]' : "w-full"}>
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
            <AsyncSelect
                inputProps={{
                    mode: 'stroke',
                }}
                className="grow mt-5"
                withClearButton
                onSelect={fields.region.onChange}
                value={fields.region.value}
                placeholder="Регион"
                loadData={regionSelectApi}
            />
            <AsyncSelect
                inputProps={{
                    mode: 'stroke',
                }}
                className="grow mt-5"
                withClearButton
                onSelect={fields.district.onChange}
                value={fields.district.value}
                placeholder="Федеральный округ"
                loadData={districtSelectApi}
            />
            <DatePicker
                className="mt-5"
                mode="stroke"
                value={fields.createdAt.value}
                onChange={fields.createdAt.onChange}/>
            <WeightFieldGte
                className="grow mt-5"/>
            <WeightFieldLte
                className="grow mt-5"/>
            <PriceGteField
                className="grow mt-5"/>
            <PriceLteField
                className="grow mt-5"/>
        </div>
    )
}