import {IGraph} from "@box/entities/statistics/applicationsStats/model";

export interface IMainPageStatistics {
    id: number,
    isDeleted: boolean,
    salesApplicationsCount?: number, //кол-во предложений на продажу
    purchaseApplicationsCount?: number, //кол-во предложений на покупку
    publishedDate: Date,
    lotSize: number,
    latestDealPrice: number,
    deviationPercent: number, //процент отклонённых заявок
    deviation: number, //отклонённые заявки
    createdAt: Date,
    name: string,
    description: string,
    category: number,
    deal_type: number
    dealType?: number
    //Добавил
    graph: IGraph,
    total: number
}