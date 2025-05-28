import {IWithClass} from "@types";
import {useGate, useStore} from "effector-react";
import {gate, pagination} from "@box/widgets/generate-list-of-offers";
import classNames from "classnames";
import s from "@box/widgets/statistics/recyclables-prices/ui/style.module.scss";
import {Pagination} from "@box/shared/ui";
import {recyclableForGenerateListOfOffersModel} from "@box/entities/generate-list-of-offers";
import {RecyclableForGenerateListOfOffersCard} from "@box/entities/generate-list-of-offers/ui";
import {RecyclableForGenerateListOfOffersFilters} from "@box/features/generateListOfOffers";


export const RecyclableCompaniesList: React.FC<IWithClass> = ({className}) => {
    useGate(gate);
    const recyclables = useStore(recyclableForGenerateListOfOffersModel.$generateListOfOffers);
    return (
        <div className={classNames("", className)}>
            <div className={classNames("flex items-center mt-[30px] gap-6")}>
                <h1 className="font-normal text-2xl">Формирование предложений по результатам сделок</h1>
            </div>
            <RecyclableForGenerateListOfOffersFilters/>
            <div className={"w-full mt-[26px]"}>
                <div className={classNames("grid grid-cols-6 border-l border-t border-grey-20", s.card_view)}>
                    {recyclables.sort(function (a, b) {
                        return (a.category - b.category)
                    }).map((recyclable) => (
                        <RecyclableForGenerateListOfOffersCard
                            className={classNames("")}
                            key={recyclable.id}
                            recyclableApplicationPriceData={recyclable}/>
                    ))}
                </div>
                <Pagination pagination={pagination}/>
            </div>
        </div>
    );
};