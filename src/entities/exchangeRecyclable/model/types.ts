export interface IExchangeRecyclable {
  id: number;
  isDeleted: boolean;
  salesApplicationsCount: number;
  purchaseApplicationsCount: number;
  publishedDate?: Date,
  lotSize?: number,
  createdAt: Date;
  name: string;
  description: string;
  category: number;
  latestDealPrice?: number
  deviation: number
  //ДОБАВИЛ
  urgency_type: number
}
