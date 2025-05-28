import React, {useEffect, useRef, useState} from 'react';
import {AppSelect} from '@box/shared/ui';
import {IAsyncSelect} from './types';
import {ISelectValue} from '../types';

export function AsyncSelect<T>({
                                   name,
                                   value,
                                   className,
                                   onSelect = () => null,
                                   placeholder,
                                   withSearch,
                                   loadData,
                                   selectFirstValue = false,
                                   selectFirstOfFirstValue = false,
                                   onInput = () => null,
                                   notNull = false,
                                   ...props
                               }: IAsyncSelect<T> & { notNull?: boolean }) {
    const [results, setResults] = useState<Array<ISelectValue<T>>>([]);
    const [queryString, setQueryString] = useState<string>('');
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);



    const fetchData = async (val: string, id?: number) => {
        const res = await loadData(val);
        //ДОБАВИЛ
        //@ts-ignore
        const final = !name ? res : res.filter(item => item.label.split(' ').includes(name))
        setResults(final);
        if (selectFirstValue) {
            onSelect(res[0]);
        }
        if (selectFirstOfFirstValue) {
            //@ts-ignore
            onSelect(res[0].children[0] || res[1].children[0] || res[2].children[0] || res[3].children[0]);
        }
    };

    const inputHandler = async (val: string) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        onInput(val);
        setQueryString(val);
        !notNull && onSelect(null);

        timeoutId.current = setTimeout(() => fetchData(val), 300);
    };

    const selectHandler = (res: ISelectValue<T> | null) => {
        onSelect(res);
        if (res) {
            setQueryString(res.label);
            onInput(res.label);
            return;
        }
        setQueryString('');
        onInput('');
    };

    useEffect(() => {
        fetchData('');
    }, []);

    useEffect(() => {
        if (!value) {
            setQueryString('');
        }
    }, [value]);


    return (
        <AppSelect
            withSearch={withSearch}
            onSelect={selectHandler}
            onInput={inputHandler}
            placeholder={placeholder}
            value={value}
            data={results}
            className={className}
            inputValue={value ? value.label : queryString}
            {...props}
        />
    );
}
