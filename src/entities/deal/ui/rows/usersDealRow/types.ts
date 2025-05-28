export interface IUsersDealRow {
  id: number,
  route: string,
  recyclable?: string,
  equipment?: string,
  supplierCompany: string,
  createdAt: string,
  applicationPrice: number,
  price: number;
  status: {
    id: number
  }
}
