import React, {useRef, FocusEventHandler, useCallback, useState, useEffect} from 'react';
import {AppInput} from '@box/shared/ui/input';
import ArrowBottom from '@assets/icons/select_arrow_bottom.svg';
import {useBoolean} from '@box/shared/hooks';
import classNames from 'classnames';
import InputCross from '@assets/icons/Close.svg';
import {Button, Popover} from '@box/shared/ui';
import s from './style.module.scss';
import {
    IAppSelect,
    ISelectValue,
    ISelectValueField,
    IWideSelectDrawer,
} from '../types';
import Close from '@assets/icons/Close.svg';


const SelectValue: React.FC<ISelectValueField> = ({
                                                      value,
                                                      onClick,
                                                      selected,
                                                      disabled = false,
                                                  }) => (
        <div
            className={classNames(
                s.value,
                {[s.value_selected]: selected},
                {[s.value_disabled]: disabled},
            )}
            onClick={disabled ? () => null : (ev) => {
                ev.stopPropagation();
                onClick();
            }}
        >
            <p>{value.label}</p>
        </div>
    )
;

function WideSelectDrawer<T>({
                                 data,
                                 columnCount,
                                 onSelect,

                             }: IWideSelectDrawer<T>) {
    return (
        <div
            style={{
                columnCount,
            }}
            className={classNames(
                'shadow border border-grey-20 p-[32px] bg-white rounded-[10px]',
                s.wide_select
            )}
        >
            {data.map((el) => {
                if (el.isHeader) {
                    return (
                        <div key={el.id} className="mt-[-10px] mb-[40px] w-[300px] break-inside-avoid-column">
                            <p className=" text-black font-semibold mt-[10px] text-md">
                                {el.label}
                            </p>
                            {el.children?.map((child: ISelectValue) => (
                                <p
                                    key={child.id}
                                    onClick={() => {
                                        onSelect(child);
                                    }}
                                    className="text-sm text-black mt-[10px] cursor-pointer"
                                >
                                    {child.label}
                                </p>
                            ))}
                        </div>
                    );
                }
                return null;
            })}

        </div>
    );
}

function SpecialWideSelectDrawer<T>({
                                        data,
                                        columnCount,
                                        onSelect,
                                        closeFunc,

                                    }: IWideSelectDrawer<T>) {

    return (
        <div
            style={{
                columnCount,
            }}
            className={classNames(
                'shadow border border-grey-20 p-[32px] bg-white rounded-[10px]',
                s.special_wide_select
            )}
        >
            <div className={classNames(
                '',
                s.special_wide_select_inner
            )}>
                {data.map((el) => {
                    if (el.isHeader) {
                        return (
                            <div key={el.id} className="mt-[-10px] mb-[40px] w-[300px] break-inside-avoid-column">
                                <p
                                    onClick={() => onSelect(el)}
                                    className=" text-black font-semibold mt-[10px] text-md cursor-pointer">
                                    {el.label}
                                </p>
                                {el.children?.map((child: ISelectValue) => (
                                    <p
                                        key={child.id}
                                        onClick={() => {
                                            onSelect(child);
                                        }}
                                        className="text-sm text-black mt-[10px] cursor-pointer"
                                    >
                                        {child.label}
                                    </p>
                                ))}
                            </div>
                        );
                    }
                    return null;
                })}
                <Button mode='notFilled' iconLeft={<Close className={s.closeIcon}/>}
                        className={classNames("hidden  border rounded-[10px]", s.closeButton)}
                        childrenClassName={s.textButton} children={"Закрыть"} onClick={closeFunc}></Button>
            </div>
        </div>
    );
}

export function AppSelect<T>({
                                 //defaultValue,
                                 value,
                                 data,
                                 onSelect = () => null,
                                 placeholder = '',
                                 className,
                                 error = false,
                                 required = false,
                                 withSearch = true,
                                 inputValue,
                                 inputProps = {},
                                 onInput = () => null,
                                 wide = false,
                                 columnCount = 3,
                                 withClearButton = false,
                                 additionFuncOnClearClick = () => null,
                                 withSpecialWideAndCloseButton = false,
                                 sx,
                                 containerSize
                             }: IAppSelect<T>) {
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLBodyElement>(null);
    const {
        value: showSelect,
        setValue: setShowSelect,
        toggle,
    } = useBoolean(false);

    const onInputClick = () => {
        if (inputRef.current && showSelect) {
            inputRef.current.focus();
        }
        //было setShowSelect(true);
        setShowSelect(!showSelect);
        if (showSelect) {
            inputRef.current ? inputRef.current.blur() : null
        }
    };
    const onInputFocus: FocusEventHandler<HTMLInputElement> = (ev) => {
        if (inputProps?.onFocus) inputProps.onFocus(ev)
    };

    const onClearClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        onSelect(null);
        additionFuncOnClearClick();
    };

    const disableWideSelectWidth = typeof window !== 'undefined' ? window?.innerWidth < 1000 : false;

    return (
        <div
            className={classNames(s.body, className)}
            style={{
                ...sx
            }}
            ref={selectRef}
        >
            {/* eslint-disable-next-line no-nested-ternary */}
            <Popover containerSize={containerSize} center={wide ? !disableWideSelectWidth : true}
                     width={wide ? !disableWideSelectWidth ? 1000 : window?.innerWidth : 'target'} opened={showSelect}
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
                        //@ts-ignore
                        value={inputValue}//{defaultValue?.length > 0 && inputValue ? defaultValue: inputValue}

                        className={classNames(s.inputField, inputProps?.className)}
                        iconRight={[
                            withClearButton && (
                                <InputCross
                                    key={1}
                                    className={classNames(
                                        'transition',
                                        {'opacity-100': value !== null},
                                        {'opacity-0': value == null},
                                    )}
                                    onClick={onClearClick}
                                    //onClose={onClearClick}
                                />
                            ),
                            <ArrowBottom key={2} onClick={toggle}/>,
                        ]}
                        placeholder={placeholder}
                        onChange={onInput}
                        {...inputProps}
                    />
                </Popover.Target>
                <Popover.Dropdown>
                    {!wide ? (
                            <div
                                className={classNames('shadow max-h-[300px] rounded-[10px] bg-white overflow-auto', {'border border-grey-20': inputProps?.mode === 'stroke'})}>
                                {data.map((el) => (
                                    <SelectValue
                                        disabled={el.disabled}
                                        selected={el.id === value?.id}
                                        onClick={() => {
                                            onSelect(el);
                                            setShowSelect(false);
                                        }}
                                        key={el.id}
                                        value={el}
                                    />
                                ))}
                                {data.length === 0 && (
                                    <div className={s.value}>
                                        <p>Ничего не найдено</p>
                                    </div>
                                )}
                            </div>
                        )
                        : (withSpecialWideAndCloseButton ?
                                <SpecialWideSelectDrawer
                                    closeFunc={() => {
                                        setShowSelect(false)
                                    }}
                                    columnCount={columnCount}
                                    data={data}
                                    onSelect={(el) => {
                                        onSelect(el);
                                        setShowSelect(false);
                                    }}
                                />
                                :
                                <WideSelectDrawer
                                    columnCount={columnCount}
                                    data={data}
                                    onSelect={(el) => {
                                        onSelect(el);
                                        setShowSelect(false);
                                    }}
                                />
                        )}

                </Popover.Dropdown>
            </Popover>

        </div>
    );
}
