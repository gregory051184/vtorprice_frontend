import {IDistrict} from "@box/entities/district";

export interface IRegion {
  id: number,
  isDeleted: boolean,
  createdAt: Date,
  name: string
  district: IDistrict
}
