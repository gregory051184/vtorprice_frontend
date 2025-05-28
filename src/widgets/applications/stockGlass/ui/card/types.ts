import { IRecyclableApplication } from "@box/entities/application/model";

interface ICard {
  application: IRecyclableApplication,
  priceColor: 'red' | 'green',
}

export type { ICard };
