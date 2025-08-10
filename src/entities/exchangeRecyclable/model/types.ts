
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
    latestDealPrice?: number;
    deviation: number;
    urgency_type: number;
    purchaseReadyForShipmentTotalVolume: number;
    salesReadyForShipmentTotalVolume: number;
    purchaseSupplyContractTotalVolume: number;
    salesSupplyContractTotalVolume: number;
    supplyContractsPrices: {
        lastPrice: number,
        preLastPrice: number,
    };
    readyForShipmentPrices: {
        lastPrice: number,
        preLastPrice: number,
    };
}
