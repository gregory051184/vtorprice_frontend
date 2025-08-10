import { IRecyclableApplicationShortForAll } from "@box/entities/application/model";
import { IRecyclableColor } from "@box/pages/recyclables/ui/waste/buy";
import { IRecyclableTotalVolume } from "@box/pages/recyclables/ui/waste/buy/recyclables";





export interface IRecyclablesStatsSwiper {
    recyclables: () => IRecyclableApplicationShortForAll[],
    deviationRubles: () => string,
    deviationPercent: () => string,
    middlePrice: () => string,
    totalVolume: () => string,
}

export interface IRecyclableSwiper {
    recyclables: () =>  IRecyclableTotalVolume[]
}

export interface IRecyclablesCategorySwiper {
    categories: () => IRecyclableColor[]
}