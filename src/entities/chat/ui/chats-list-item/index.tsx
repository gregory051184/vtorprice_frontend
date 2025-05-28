import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import AvatarIcon from '@assets/icons/User Groups.svg';
import { getHoursTime } from '@box/shared/lib/helpers';
import { IChatsListItem } from '../types';

export const ChatsListItem: React.FC<IChatsListItem> = ({
                                                          isRead, content, chatId, createdAt, name
                                                        }) => {
  const router = useRouter();

  const activeContainerStyles = ['bg-secondaryGreen-light'];
  const inActiveContainerStyles = ['border-[1px] border-grey-20'];
  return (
    <div
      className={classNames(
        'w-full h-[70px] rounded-[10px] flex items-center justify-between px-5 mb-2.5',
        !isRead ? activeContainerStyles : inActiveContainerStyles
      )}
      onClick={() => router.push(`chats/${chatId}`)}
    >
      <div className="flex items-center">
        {/* <Image src={SegezhaIcon} alt="SegezhaIcon" className="w-10 h-10 rounded-full" /> */}
        <AvatarIcon />
        <div className="pl-2.5">
          <span className="text-primaryGreen-main font-bold text-xs">{name}</span>
          <p className="text-black text-xs font-weight">{content}</p>
        </div>
      </div>
      <span className="text-grey-40 text-xs">{getHoursTime(createdAt)}</span>
    </div>
  );
};
