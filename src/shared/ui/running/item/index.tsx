import React from "react";
import {
    IRecyclableApplicationPriceDataCard
} from "@box/entities/statistics/recyclablesApplicationsPrices/ui/RecycableApplicationPriceDataCard/types";
import classNames from "classnames";
import c from "@box/shared/ui/running/style.module.scss";

export const Running: React.FC<IRecyclableApplicationPriceDataCard> = ({recyclableApplicationPriceData}) => {

    let deviation = "";
    let deviationStyle = "";
    const deviationPercent = Math.abs(recyclableApplicationPriceData?.deviationPercent);
    if (recyclableApplicationPriceData?.deviationPercent) {
        switch (true) {
            case recyclableApplicationPriceData?.deviationPercent > 0:
                deviation = `▲ ${deviationPercent}%`;
                deviationStyle = "text-specialGreen";
                break;
            case recyclableApplicationPriceData?.deviationPercent === 0:
                deviation = `${deviationPercent}%`;
                break;
            default:
                deviation = `▼ ${deviationPercent}%`;
                deviationStyle = "text-specialRed";
        }
    } else {
        deviation = '--';
    }

    return (
        <>
            {recyclableApplicationPriceData.latestDealPrice &&
                <div className={c.slider}>
                    <span className="text-sm font-medium text-white">{recyclableApplicationPriceData.name}</span>
                    <span>  </span>
                    <span
                        className="text-sm font-medium text-white">{recyclableApplicationPriceData.latestDealPrice ? `${recyclableApplicationPriceData.latestDealPrice} ₽` : "--"}</span>
                    <span>  </span>
                    <span className={classNames("text-sm font-medium text-white", `${deviationStyle}`)}>{deviation}</span>

                </div>
            }
        </>
    )
}