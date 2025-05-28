import classNames from "classnames";

import {IRecyclableForGenerateListOfOffersCardCard} from "@box/entities/generate-list-of-offers/ui/types";
import {useRouter} from "next/router";

export const RecyclableForGenerateListOfOffersCard: React.FC<IRecyclableForGenerateListOfOffersCardCard> = ({
                                                                                                                recyclableApplicationPriceData,
                                                                                                                className
                                                                                                            }) => {
    const router = useRouter();
    return (
        <div
            onClick={() => (recyclableApplicationPriceData?.buyer && recyclableApplicationPriceData?.companiesBuyAppCount) && recyclableApplicationPriceData?.companiesBuyAppCount > 0 && router.push(`/profile/generate-list-of-offers/${recyclableApplicationPriceData.id}`)}
            className={classNames('flex gap-[10px] flex-col justify-center items-start border-r border-b border-grey-20 px-[25px] py-[30px]', className)}>
            <div className={(recyclableApplicationPriceData?.buyer && recyclableApplicationPriceData?.companiesBuyAppCount) && recyclableApplicationPriceData?.companiesBuyAppCount > 0 ? "text-sm cursor-pointer" : "text-sm opacity-50"}>
                <p>{recyclableApplicationPriceData.name}</p>
                <p className=  {(recyclableApplicationPriceData?.buyer && recyclableApplicationPriceData?.companiesBuyAppCount) && recyclableApplicationPriceData?.companiesBuyAppCount > 0 ?
                    "text-specialGreen" : ""}>{(recyclableApplicationPriceData?.buyer && recyclableApplicationPriceData?.companiesBuyAppCount) && recyclableApplicationPriceData?.companiesBuyAppCount > 0 ?
                    `Кол-во заявок на покупку: ${recyclableApplicationPriceData?.companiesBuyAppCount}` : 'Нет предложений'}</p>
            </div>
        </div>
    );
};