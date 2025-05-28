import React, { useId, useRef } from 'react';
import classNames from 'classnames';
import Checkmark from '@assets/icons/Checkmark.svg';
import { CSSTransition } from 'react-transition-group';
import { ICheckbox } from './types';

export const Checkbox: React.FC<ICheckbox> = ({
  checked,
  onChange,
  description,
  className,
  ...props
}) => {
  const id = useId();
  const checkRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className={classNames(className)}>
      <label htmlFor={id} className="flex gap-2 cursor-pointer">
        <input id={id} checked={checked} onChange={(ev) => onChange(ev.target.checked)} type="checkbox" className='hidden' {...props} />
        <div className={classNames('w-[24px] shrink-0 h-[24px] border-2 rounded-md border-primaryGreen-main cursor-pointer flex items-center justify-center')}>
          <CSSTransition in={checked} timeout={200} classNames="fade" unmountOnExit nodeRef={checkRef}>
            <div ref={checkRef}>
              <Checkmark />
            </div>
          </CSSTransition>
        </div>
        {description}

      </label>
    </div>
  );
};
