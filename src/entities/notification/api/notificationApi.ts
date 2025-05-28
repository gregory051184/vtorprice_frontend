import { AxiosResponse } from 'axios';
import { Paginationable } from '@box/types';
import { $authHost } from '@box/shared/api';
import { INotification } from '../model';
import {IRecyclableApplication} from "@box/entities/application/model";

type GetNotificationsParams = {
  search: string,
  page: number,
  size: number,
};

class NotificationApi {
  getNotificationsUnreadCount(): Promise<AxiosResponse<
    {unreadCount: number}
   & Paginationable>> {
    return $authHost.get('/notification/unread_count/');
  }
  getNotifications(params: Partial<GetNotificationsParams>): Promise<AxiosResponse<{
    results: Array<INotification>
  } & Paginationable>> {
    return $authHost.get('/notification/', { params });
  }
  // For changing flag isRead 
  getOneNotification(id: number): Promise<AxiosResponse<{
    results: INotification
  } & Paginationable>> {
    return $authHost.get(`/notification/${id}`);
  }
  removeNotification(id: number): Promise<AxiosResponse<IRecyclableApplication>> {
    return $authHost.delete(`/notification/${id}/`);
  }
}

export const notificationApi = new NotificationApi();
