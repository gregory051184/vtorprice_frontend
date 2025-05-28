import React, {FocusEventHandler, useRef} from "react";
import "dayjs/locale/ru";
import {RangeCalendar} from "@mantine/dates";
import CalendarIcon from "@assets/icons/24_calendar.svg";
import {useBoolean} from "@box/shared/hooks";
import {AppInput} from "../input";
import {Popover} from "../popover";
import {IDatePicker} from "./types";
import {humanizeDates} from "./lib";
import classNames from "classnames";
import InputCross from "@assets/icons/Close.svg";
import ArrowBottom from "@assets/icons/select_arrow_bottom.svg";

export const DatePicker: React.FC<IDatePicker> = ({
                                                      containerSize,
                                                      value,
                                                      onChange,
                                                      amountOfMonths = 2,
                                                      inputStyle = "w-[400px]",
                                                      maxDate,
                                                      ...inputProps
                                                  }) => {
    const {value: showCalendar, toggle, setValue} = useBoolean(false);
    const handleInputFocus = () => {
        setValue(true);
    };

    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const onInputClick = () => {
        if (inputRef.current && showCalendar) {
            inputRef.current.focus();
        }
        //было setShowSelect(true);
        setValue(!showCalendar);
        if (showCalendar) {
            inputRef.current ? inputRef.current.blur() : null
            setValue(false);
        }
    };


    const onInputFocus: FocusEventHandler<HTMLInputElement> = (ev) => {
        if (inputProps?.onFocus) inputProps.onFocus(ev)
    };

    return (
        <Popover
            width={amountOfMonths * 300}
            containerSize={containerSize}
            //center={wide ? !disableWideSelectWidth : true}
            opened={showCalendar}
            center
            close={() => {
                //setValue(false)
            }}
        >
            <Popover.Target>
                <AppInput
                    value={humanizeDates(value)}
                    inputInactive
                    className={inputStyle}
                    onClick={onInputClick}//{handleInputFocus}
                    active={showCalendar}
                    //onClick={handleInputFocus}
                    //onFocus={onInputFocus}
                    placeholder="Дата размещения"
                    //inputRef={inputRef}
                    iconRight={
                        (value[0] === null && !showCalendar && <CalendarIcon
                            onClick={(ev: MouseEvent) => {
                                setValue(true);
                                //ev.stopPropagation();
                                //toggle();
                            }}
                        />) ||
                        (showCalendar && <ArrowBottom
                            /*onChange={(ev: MouseEvent) => {
                                if(value[0] === null && value[1] === null) {
                                    onChange(value)
                                }
                            }}*/
                            onClick={(ev: MouseEvent) => {
                            setValue(true)
                        }}/>) ||
                        ((value[0] !== null && !showCalendar) && <InputCross
                            key={1}
                            className={classNames(
                                'transition',
                                {'opacity-100': value !== null},
                                {'opacity-0': value == null},
                            )}
                            onClick={(ev: MouseEvent) => {
                                value[0] = null
                                value[1] = null
                                onChange([null, null])
                                setValue(false)
                            }}
                        />)
                    }
                    {...inputProps}
                />
            </Popover.Target>
            <Popover.Dropdown>
                <div className="rounded-[10px] bg-white p-[20px] shadow">
                    <RangeCalendar
                        value={value}
                        onChange={onChange}
                        sx={{
                            maxWidth: "100%",
                        }}
                        locale="ru"
                        amountOfMonths={amountOfMonths}
                        maxDate={maxDate}
                    />
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};
