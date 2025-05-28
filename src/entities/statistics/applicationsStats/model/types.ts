export interface IPoint {
    value: number,
    date: string
}
export interface IGraph {
    points: Array<IPoint>
}
export interface IApplicationsStatsData {
    graph: IGraph,
    total: number
}