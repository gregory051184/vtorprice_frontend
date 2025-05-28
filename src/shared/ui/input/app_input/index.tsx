import React, {forwardRef, useCallback, useRef} from 'react';
import classNames from 'classnames';
import {Skeleton} from '@box/shared/ui/skeleton';
import {IAppInput} from '../types';
import s from './style.module.scss';

export const AppInput = forwardRef<HTMLDivElement, IAppInput>(({
                                                                   inputAfterFloat = null,
                                                                   width,
                                                                   placeholder = '',
                                                                   placeholderPlain = false,
                                                                   required = false,
                                                                   error = false,
                                                                   disabled = false,
                                                                   inputInactive = false,
                                                                   active = false,
                                                                   loading = false,
                                                                   iconLeft,
                                                                   iconRight,
                                                                   mode = 'normal',
                                                                   onClick = () => null,
                                                                   onChange = () => null,
                                                                   inputRef,
                                                                   className,
                                                                   sx,
                                                                   ...inputProps
                                                               }, ref) => {
    const inputFocusControllerRef = useRef<HTMLInputElement | null>(null);
    const onPlaceholderClick = useCallback(() => {
        if (inputFocusControllerRef.current) {
            inputFocusControllerRef.current.focus();
        }
    }, []);
    if (loading) {
        return <Skeleton className={classNames('h-[56px] rounded-[10px] overflow-hidden', className)}/>;
    }

    const adjustingOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            if (inputAfterFloat !== null && inputAfterFloat !== undefined) {
                let value = event.target.value;
                if (value.includes('.')) {
                    const parts = value.split('.');
                    if (parts[1] && parts[1].length > inputAfterFloat) {
                        value = `${parts[0]}.${parts[1].slice(0, inputAfterFloat)}`;
                    }
                }
                return onChange(value);
            } else {
                return onChange(event.target.value)
            }
        }
        return null
    }

    return (
        <div
            onClick={(ev) => {
                onPlaceholderClick();
                onClick(ev);
            }}
            ref={ref}
            className={classNames(
                'bg-white shadow',
                s.wrapper,
                {[s.wrapper_error]: error},
                {[s.wrapper_disabled]: disabled},
                {[s.wrapper_stroke]: mode === 'stroke'},
                {[s.wrapper_default]: placeholderPlain},
                className,
            )}
            style={{
                ...(width && {width: typeof width === 'string' ? width : `${width}px`}),
                ...sx
            }}
        >
            <div className={classNames(s.wrapper_disabled_view, 'bg-white-80')}/>
            {iconLeft && (
                <div className={s.icon}>
                    {iconLeft}
                </div>
            )}
            <div
                className={classNames(
                    s.editable,
                    {[s.editable_default]: placeholderPlain},
                )}
            >
                <input
                    disabled={disabled || inputInactive}
                    placeholder={placeholderPlain ? placeholder : ' '}
                    ref={(r) => {
                        inputFocusControllerRef.current = r;
                        if (inputRef) inputRef.current = r;
                    }
                    }
                    onChange={(event) => adjustingOnChange(event)}
                    className={classNames('text-black outline-0 text-sm', s.input, {[s.input_active]: active})}
                    {...inputProps}
                />
                {!placeholderPlain && (
                    <div className={s.placeholder}>
                        <p className={classNames('text-sm text-grey-40')}>
                            {placeholder}
                            <span className="text-xs text-red-dark align-top">{required ? ' *' : ''}</span>
                        </p>
                    </div>
                )}

            </div>
            {iconRight && (
                <div className={s.icon}>
                    {iconRight}
                </div>
            )}
        </div>
    );
});
