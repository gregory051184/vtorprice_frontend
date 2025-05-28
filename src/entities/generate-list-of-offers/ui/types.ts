import { IWithClass } from '@types';
import {IGenerateListOfOffers} from "@box/entities/generate-list-of-offers/model";


export interface IRecyclableForGenerateListOfOffersCardCard extends IWithClass {
    recyclableApplicationPriceData: IGenerateListOfOffers,
}