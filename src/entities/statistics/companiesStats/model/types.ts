export interface IRecycle {
    name: string,
    companyCount: number,
    activityType: number,
    color: string
}
export interface ICompaniesStatsData {
    total: number,
    recyclingCount: Array<IRecycle>
}