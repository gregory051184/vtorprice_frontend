import {FC, FocusEventHandler, useEffect, useRef, useState} from "react";
import {geocodeSelectApi} from "./api";
import {IGeocode, IGeoSelect, IGeoSelectValueField} from "./types";
import {AppInput, Popover} from "@box/shared/ui";
import classNames from "classnames";
import {useBoolean} from "@box/shared/hooks";
import InputCross from "@assets/icons/input_wipe_icon.svg";
import s from '../app_select/style.module.scss';

const GeoSelectValue: FC<IGeoSelectValueField> = ({
                                                      value,
                                                      onClick,
                                                  }) => (
    <div
        className={s.value}
        onClick={(ev) => {
            ev.stopPropagation();
            onClick();
        }}
    >
        <p>{value}</p>
    </div>
);

const GeoSelect: FC<IGeoSelect> = ({
                                       placeholder = '',
                                       className,
                                       error = false,
                                       required = false,
                                       withSearch = true,
                                       inputValue,
                                       inputProps = {},
                                       onInput = () => null,
                                       containerSize,
                                       onSelect
                                   }) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        value: showSelect,
        setValue: setShowSelect,
    } = useBoolean(false);

    const [data, setData] = useState<Array<IGeocode>>([]);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = async (val: string) => {
        const res = await geocodeSelectApi(val);
        setData(res)
    };

    const inputHandler = (val: string) => {
        !showSelect && setShowSelect(true);
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        onInput && onInput(val);
        onSelect({address: val, latitude: '', longitude: '', city: ''})

        if (val) {
            timeoutId.current = setTimeout(() => fetchData(val), 300);
        } else {
            setData([])
        }
    };
    const onInputClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setShowSelect(true);
    };

    const onInputFocus: FocusEventHandler<HTMLInputElement> = (ev) => {
        if (inputProps?.onFocus) inputProps.onFocus(ev);
    };

    const onClearClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        onInput('');
        onSelect({address: '', latitude: '', longitude: '', city: ''})
        setData([]);
    };

    useEffect(() => {
        !!inputValue && fetchData(inputValue);
    }, []);

    return (
        <div
            className={classNames(s.body, className)}
            ref={selectRef}
        >
            {/* eslint-disable-next-line no-nested-ternary */}
            <Popover containerSize={containerSize} center={true} width='target' opened={showSelect}
                     close={() => setShowSelect(false)}>
                <Popover.Target>
                    <AppInput
                        error={error}
                        required={required}
                        onClick={onInputClick}
                        onFocus={onInputFocus}
                        active={showSelect}
                        inputRef={inputRef}
                        inputInactive={!withSearch}
                        value={inputValue}
                        className={classNames(s.inputField, inputProps?.className)}
                        iconRight={
                            <InputCross
                                key={1}
                                className={classNames(
                                    'transition',
                                    {'opacity-100': !!inputValue && document?.activeElement === inputRef?.current},
                                    {'opacity-0': !inputValue || (!!inputValue && document?.activeElement !== inputRef.current)},
                                )}
                                onClick={onClearClick}
                            />}
                        placeholder={placeholder}
                        onChange={inputHandler}
                        {...inputProps}
                    />
                </Popover.Target>
                <Popover.Dropdown>
                    <div
                        className={classNames('shadow max-h-[300px] rounded-[10px] bg-white overflow-auto', {'border border-grey-20': inputProps?.mode === 'stroke'})}
                    >
                        {
                            !data.length ? (
                                    <div className={s.value}>
                                        <p>Ничего не найдено</p>
                                    </div>
                                ) :
                                data.map(e =>
                                    <GeoSelectValue
                                        key={e.address}
                                        onClick={() => {
                                            onSelect({
                                                address: e.address,
                                                latitude: e.latitude,
                                                longitude: e.longitude,
                                                city: e.city
                                            });
                                            setShowSelect(false);
                                        }}
                                        value={e.address}
                                    />
                                )
                        }
                    </div>
                </Popover.Dropdown>
            </Popover>

        </div>
    );
}

export {GeoSelect}
