import { createEffect, createEvent, createStore } from 'effector';
import { AxiosError, AxiosResponse } from 'axios';
import { $authHost } from '@box/shared/api';
import { createLoaderStore } from '@box/shared/lib/helpers';
import {IAuthUser} from "@box/entities/auth";

export interface IChatResult {
  id: number;
  chat: number;
  author: IAuthUser//IUser;
  content: string;
  createdAt: Date;
  unreadCount: number;
}

export interface IChatMessages {
  results: IChatResult[]
}

export interface IChatModel {
  count: number;
  next: string;
  previous: string;
  results: IChatResult[];
  message: string;
  name: string;
}

export const getMessagesFx = createEffect<number, IChatMessages, AxiosError>({
  handler: async (id) => {
    const res: AxiosResponse = await $authHost.get(`/chats/${id}/messages/`);

    return res.data;
  }
});

export const sendMessageFx = createEffect<{ id: number; content: string }, IChatModel, AxiosError>({
  handler: async ({ id, content }) => {
    const res: AxiosResponse = await $authHost.post(`/chats/${id}/messages/`, {
      chat: id,
      content
    });

    return res.data;
  }
});

export const readChatFx = createEffect<number, IChatModel, AxiosError>({
  handler: async (id) => {
    const res: AxiosResponse = await $authHost.get(`/chats/${id}/`);

    return res.data;
  }
});

export const $messagesLoading = createLoaderStore(false, getMessagesFx);

export const pushNewMessage = createEvent<IChatResult>();

export const $chatMessages = createStore<IChatResult[]>([])
  .on(getMessagesFx.doneData, (state, data) => data.results.sort((a,b) => a.id - b.id))
  .on(pushNewMessage, (state, data) => (state ? [...state, data] : []));

export const $chatModel = createStore<IChatModel | null>(null)
  .on(readChatFx.done, (state, data) => (data.result || null));

export const changeInputMessage = createEvent<string>();
export const chatInputReset = createEvent();

export const $chatMessageInput = createStore<string>('')
  .on(changeInputMessage, (_, val) => val)
  .reset(chatInputReset);
