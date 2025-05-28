import { FC } from 'react';
import classNames from 'classnames';
import { IChatsInput } from '@box/entities/chat/ui/types';

export const ChatsInput: FC<IChatsInput> = ({ onChange, value, mini }) => (
  <div className={classNames('h-10 shadow-xl', {
    'w-[80%]': mini,
    'w-[93%]': !mini,
  })}
  >
    <input
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      type="text"
      className="w-full h-full px-2 rounded-full wfont-normal color-grey-30"
      placeholder="Ваше сообщение..."
    />
  </div>
);
