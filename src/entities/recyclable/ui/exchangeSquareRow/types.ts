import {IExchangeRecyclable} from "@box/entities/exchangeRecyclable/model";

export interface IExchangeSquareRow {
    currentBlock: number,
    urgencyType: number,
    recyclable: IExchangeRecyclable,
}