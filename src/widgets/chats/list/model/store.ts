import { createStore } from 'effector';
import { ChatListsModel } from '@box/entities/chat';
import { createList } from '@box/shared/lib/factories';

const { pagination, gate } = createList({
  effect: ChatListsModel.getChatListFx,
  filters: createStore(null),
  mapFilters: () => ({
    size: 10
  })
});

export {
  pagination,
  gate
};
