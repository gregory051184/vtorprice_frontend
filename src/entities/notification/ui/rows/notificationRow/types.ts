import { INotification } from '@box/entities/notification/model';

export interface INotificationRow {
  notification: INotification;
  onClick?: ()=> void;
}
