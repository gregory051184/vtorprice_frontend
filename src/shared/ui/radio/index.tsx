import React, { useId, useRef } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { IRadio } from './types';

export const Radio: React.FC<IRadio> = ({
  checked,
  onChange,
  className,
  ...props
}) => {
  const id = useId();
  const checkRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className={classNames(className)}>
      <label htmlFor={id}>
        <input id={id} checked={checked} onChange={(ev) => onChange(ev.target.checked)} type="radio" className='hidden' {...props} />
        <div className={classNames('w-[24px] shrink-0 h-[24px] border-2 rounded-full border-primaryGreen-main cursor-pointer flex items-center justify-center')}>
          <CSSTransition in={checked} timeout={200} classNames="fade" unmountOnExit nodeRef={checkRef}>
            <div ref={checkRef} className="w-[10px] h-[10px] bg-primaryGreen-main rounded-full" />
          </CSSTransition>
        </div>
      </label>
    </div>
  );
};
