export interface IChatsListItem {
  isRead: boolean
  content: string;
  chatId: number;
  createdAt: Date;
  name: string;
}

export interface IChatsInput {
  onChange: (msg: string) => void;
  value: string;
  mini?: boolean;
}
