import React, {useEffect} from "react";
import {IRecyclableCategory} from "@box/entities/recyclable/model";
import {IRecyclableApplicationPrice} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {useForm} from "@box/shared/effector-forms";
import {IRecyclableApplication, IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import {
    ApplicationCardForContextPanel
} from "@box/widgets/applications/applicationContextMenuForMainPageApplicationsFilters";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";

type ApplicationContextMenuForMainPageApplicationsFiltersType = {
    recyclableCategory: IRecyclableCategory;
    recyclables: IRecyclableApplicationPrice[];
    applications: IRecyclableApplicationShortForAll[]//IRecyclableApplication[];
    priceFrom: string;
    priceTo: string;
    volumeFrom: string;
    volumeTo: string;
}

export const ApplicationContextMenuForMainPageApplicationsFilters: React.FC<ApplicationContextMenuForMainPageApplicationsFiltersType> = ({
                                                                                                                                             recyclableCategory,
                                                                                                                                             recyclables,
                                                                                                                                             applications,
                                                                                                                                             priceTo,
                                                                                                                                             priceFrom,
                                                                                                                                             volumeFrom,
                                                                                                                                             volumeTo
                                                                                                                                         }) => {
    const {fields} = useForm(mainMenuApplicationFilters);
    const showFractionsHandler = (categoryId: number) => {
        if (fields.search?.value.length === 0) {
            return recyclables.filter(recyclable =>
                recyclable.category === categoryId
            )
        } else {
            return recyclables.filter(recyclable =>
                recyclable.name.indexOf(fields.search?.value) > -1
            )
        }
    };
    useEffect(() => {
    }, [applications, priceTo, priceFrom, volumeFrom, recyclableCategory, recyclables, volumeTo]);
    return (
        <div>
            <h2 className="text-white">{recyclableCategory?.name}</h2>
            {showFractionsHandler(recyclableCategory?.id).map((fraction) => (
                <ApplicationCardForContextPanel
                    applications={applications}
                    fraction={fraction}
                    priceFrom={priceFrom}
                    priceTo={priceTo}
                    volumeFrom={volumeFrom}
                    volumeTo={volumeTo}
                    key={fraction.id}/>))}
        </div>
    )
}