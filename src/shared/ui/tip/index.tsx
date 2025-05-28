import React from 'react';
import Alert from '@assets/icons/24_alert.svg';
import Timer from '@assets/icons/24_timer.svg';
import classNames from 'classnames';
import { ITip } from './types';

export const Tip:React.FC<ITip> = ({
  children,
  link,
  className,
  isBlue
}) => (
  <div
    className={
      classNames(
        'p-[10px] rounded-[10px] flex justify-between items-center',
        isBlue ? 'bg-deep_blue-light' : 'bg-orange-light',
        className
      )
    }
  >
    <div className="flex items-center gap-[10px]">
      {isBlue ? <Timer className="shrink-0"/> : <Alert className="shrink-0"/>}
      <p className={classNames("text-sm",  isBlue ? "text-deep_blue-dark" : "text-orange-dark")}>
        {children}
      </p>
    </div>
    {link && <p className="font-semibold cursor-pointer text-sm text-orange-dark underline" onClick={link.onClick}>{link.text}</p>}
  </div>
);
