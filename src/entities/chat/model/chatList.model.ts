import { createEffect, createStore } from 'effector';
import { AxiosError, AxiosResponse } from 'axios';
import { $authHost } from '@box/shared/api';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { ExternalListParams } from '@box/types';

export interface IChatResult {
  id: number;
  isDeleted: boolean;
  lastMessage: {
    isRead: boolean;
    content: string;
    chat: null;
    createdAt: Date;
    author: {
      email: string;
      role: null;
    }
  };
  unreadCount: number;
  createdAt: string;
  name: string;
}

export interface IChatModel {
  count: number;
  next: string;
  previous: string;
  results: IChatResult[];
}

export const getChatListFx = createEffect<ExternalListParams, {
  currentPage: number,
  data: IChatModel
}, AxiosError>({
  handler: async (params) => {
    const res: AxiosResponse = await $authHost.get('/chats/', {
      params
    });

    return {
      currentPage: params.page,
      data: res.data
    };
  }
});

export const $chatsLoading = createLoaderStore(false, getChatListFx);

export const $chatList = createStore<IChatResult[]>([])
  .on(getChatListFx.doneData, (state, data) => {
    if (data.currentPage === 1) {
      return data.data.results; 
    }

    return [...state, ...data.data.results];
  });
