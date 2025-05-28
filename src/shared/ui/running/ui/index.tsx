import React from "react";
import {
    IRecyclableApplicationPriceDataCard
} from "@box/entities/statistics/recyclablesApplicationsPrices/ui/RecycableApplicationPriceDataCard/types";
import c from "@box/shared/ui/running/style.module.scss";
import classNames from "classnames";
import {useRouter} from "next/router";



export const FavouriteRecyclables: React.FC<IRecyclableApplicationPriceDataCard> = ({recyclableApplicationPriceData}) => {
    const router = useRouter();
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
        <div onClick={() => router.push(`/exchange/${recyclableApplicationPriceData.id}`)} style={{cursor: 'pointer', width: '100%'}}>
            {recyclableApplicationPriceData.latestDealPrice &&
                <div className={c.slider} style={{display: "inline-block", height: "20px", width: "380px", marginBottom: '10px'}}>
                    <span className="text-sm font-medium text-white"
                          style={{position: "absolute", left: '2%', wordWrap: 'break-word', maxWidth: '100px'}}>{recyclableApplicationPriceData.name}</span>

                    <span className="text-sm font-medium text-white" style={{
                        position: "absolute", right: '2%', whiteSpace: 'nowrap',
                    }}>{recyclableApplicationPriceData.latestDealPrice ? `${recyclableApplicationPriceData.latestDealPrice} ₽` : "--"}
                    </span>

                    <span className={classNames("text-sm font-medium text-white", `${deviationStyle}`)}
                          style={{position: "absolute", left: '95%'}}>{deviation}</span>

                </div>
            }
        </div>
    )
}