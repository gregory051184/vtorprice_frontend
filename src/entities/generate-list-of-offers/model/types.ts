
export interface IGenerateListOfOffers {
    id: number,
    description: string,
    is_deleted: boolean,
    created_at: string,
    companies_count: number,
    companiesCount?: number,

    companiesBuyAppCount?: number,
    buyer?: boolean,

    applicationsId?: [number],
    category: number,
    name: string,
}