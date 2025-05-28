export type ExternalListParams = {
  ordering: string,
  page: number,
  size: number
};

export type TStatus = {
  id: number,
  label: string
};

export type Paginationable = {
  pageCount: number,
  next: string,
  previous: string,
  count: number
};

export enum ROLE {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  MANAGER = 3,
  LOGIST = 4,
  COMPANY_ADMIN = 5,
  COMPANY_STAFF = 6,
}
