import {IRegion} from "@box/entities/region/model";

export interface ICityShortForAll {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export interface ICity {
  id: number;
  isDeleted: boolean;
  createdAt: Date;
  latitude: number;
  longitude: number;
  name: string;
  region: IRegion
}
