/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useEffectAfterMount } from '@box/shared/hooks';
import classNames from 'classnames';
import styles from './style.module.scss';
import { IPartialInput } from '../types';
interface INativeEvent extends Event {
  inputType: 'insertText' | 'insertFromPaste';
}

export const PartialInput: React.FC<IPartialInput> = ({
  numCells,
  onInput,
  className: userClass = '',
  type,
  error = false,
}) => {
  const inputRef = useRef<HTMLInputElement[]>([]);
  const [inputValue, setInputValue] = useState<string[]>([]);
  const [currentInputId, setCurrentInputId] = useState<number>(0);

  const onInputHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    const chars: Array<string> = value.split('');
    const nativeEvent = ev.nativeEvent as INativeEvent;

    switch (nativeEvent.inputType) {
      case 'insertText':
        if (value.length > 1) {
          ev.target.value = value[0];
          if (currentInputId + 1 < numCells) {
            inputValue[currentInputId + 1] = value[1];
          }
        } else {
          inputValue[currentInputId] = value[0];
        }
        setInputValue(() => [...inputValue]);
        if (currentInputId + 1 < numCells) {
          setCurrentInputId((state) => state + 1);
        }
        break;
      case 'insertFromPaste':
        for (let i = 0; i < chars.length; i++) {
          if (i < numCells - currentInputId) {
            inputValue[currentInputId + i] = chars[i];
          } else {
            break;
          }
        }
        setInputValue(inputValue);
        if (currentInputId + value.length < numCells) {
          setCurrentInputId((state) => state + value.length);
        } else {
          setCurrentInputId(numCells - 1);
        }
        break;
    }
  };

  const onKeyDownHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Backspace') {
      inputValue[currentInputId] = '';
      setInputValue(() => [...inputValue]);
      if (currentInputId - 1 >= 0) {
        setCurrentInputId((state) => state - 1);
      }
    }
  };

  useEffectAfterMount(() => {
    inputRef.current.forEach((el, i) => {
      el.value = inputValue[i] ? inputValue[i] : '';
    });
    onInput(inputValue.join(''));
  }, [inputValue.toString()]);

  useEffect(() => {
    inputRef.current[currentInputId].focus();
  }, [currentInputId]);
  return (
    <div
      className={`${styles.input_container} ${userClass} ${
        error && styles.input_container_error
      }`}
    >
      {new Array(numCells).fill(0).map((el, i) => (
        <input
          className={classNames('pb-[8px] border-b-2', { 'border-grey-30': currentInputId !== i }, { 'border-primaryGreen-main': currentInputId == i })}
          onInput={onInputHandler}
          onKeyDown={onKeyDownHandler}
          maxLength={i < numCells - 1 ? numCells : 1}
          onFocus={() => setCurrentInputId(i)}
          key={i}
          value={inputValue[i]}
          ref={(el) => (el ? inputRef.current[i] = el : null)}
          type={type}
          style={{ width: `calc(100% / ${numCells} - 20px)` }}
        />
      ))}
    </div>
  );
};
