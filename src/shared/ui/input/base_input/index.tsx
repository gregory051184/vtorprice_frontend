import React, { FocusEventHandler, MouseEventHandler, useRef } from 'react';
import InputCross from '@assets/icons/input_wipe_icon.svg';
import { useBoolean } from '@box/shared/hooks';
import classNames from 'classnames';
import { AppInput } from '../app_input';
import { IBaseInput } from '../types';

export const BaseInput: React.FC<IBaseInput> = ({
  onChange = () => null, onFocus = () => null, onBlur = () => null, ...props
}) => {
  const { setValue, value } = useBoolean(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onInputFocus:FocusEventHandler<HTMLInputElement> = (ev) => {
    setValue(true);
    onFocus(ev);
  };

  const onInputBlur: FocusEventHandler<HTMLInputElement> = (ev) => {
    setValue(false);
    onBlur(ev);
  };

  const onClear: MouseEventHandler<HTMLElement> = (ev) => {
    ev.stopPropagation();
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <AppInput
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      onChange={onChange}
      inputRef={inputRef}
      iconRight={
        <InputCross className={classNames('transition', { 'opacity-100': value }, { 'opacity-0': !value })} onClick={onClear} />
      }
      {...props}
    />
  );
};
