import { TextLabel } from '@box/shared/ui/text-label';
import { ChatsListItem } from '@box/entities/chat';
import { Pagination } from '@box/shared/ui';
import { ChatListsModel } from '@box/entities/chat/model';
import { useGate, useStore } from 'effector-react';
import { gate, pagination } from '../model';

export const ChatsWidget = () => {
  const chatsLoading = useStore(ChatListsModel.$chatsLoading.$loaderStore);
  const chats = useStore(ChatListsModel.$chatList);
  const unreadChatsCount = chats?.filter((chat) => chat.unreadCount > 0).length;

  useGate(gate);

  if (chatsLoading) return null;

  return (
    <div className="overflow-y-auto bg-slate-500 cursor-pointer">
      <TextLabel className="mb-4 font-semibold">
        {unreadChatsCount}
        {' '}
        непрочитанных
      </TextLabel>
      <div>
        {
          chats?.map(
            (chat) => (
              <ChatsListItem
                key={chat.id}
                name={chat.name}
                chatId={chat.id}
                isRead={chat.unreadCount === 0}
                createdAt={chat.lastMessage.createdAt}
                content={chat.lastMessage.content || 'Сообщений нет'}
              />
            )
          )
        }
      </div>
      <Pagination pagination={pagination} />
    </div>
  );
};
