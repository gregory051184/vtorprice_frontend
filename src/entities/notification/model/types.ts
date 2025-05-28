export type Alert = {
  title: string,
  message: string,
};

export type Confirm = {
  title: string,
  message: string,
};

export type INotification = {
  id: number,
  isDeleted: boolean,
  objectUrl:string,
  createdAt: Date,
  name: string,
  objectId: number,
  isRead: boolean,
  company: number,
  contentType: string,
};
