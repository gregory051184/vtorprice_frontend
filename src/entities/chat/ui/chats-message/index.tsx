import React from 'react';
import classNames from 'classnames';
import { getHoursTime } from '@box/shared/lib/helpers';
import { IChatMessage } from './types';

export const ChatsMessage: React.FC<IChatMessage> = ({ fromMe = true, children, createdAt, avatar, title}) => (
  <div className={classNames('w-full flex flex-col mb-4', {
    'items-end': fromMe
  })}
  >
    <div className={
      classNames(
        'max-w-[70%] p-4 mb-1.5',
        {
          'bg-grey-80': fromMe,
          'rounded-[20px] rounded-r-[6px] rounded-b-[20px]': fromMe,
          'rounded-[6px] rounded-b-[6px] rounded-r-[20px]': !fromMe,
          'bg-white': !fromMe,
        }
      )
    }
    >
        <span title={title}>{avatar}</span>
      <p className={
        classNames(
          'font-normal text-sm',
          {
            'text-white': fromMe,
            'whitespace-normal': true,
            'break-all': true,
          }
        )
      }
      >
        {children}
      </p>
    </div>
    <p className="text-grey-50 text-xs">{getHoursTime(createdAt)}</p>
  </div>
);
