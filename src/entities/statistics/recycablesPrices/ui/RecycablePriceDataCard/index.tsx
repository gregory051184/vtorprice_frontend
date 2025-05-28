import classNames from "classnames";
import { IRecycablePriceDataCard } from "./types";
import s from './style.module.scss';

export const RecycablePriceDataCard: React.FC<IRecycablePriceDataCard> = ({
    recycablePriceData,
    className
  }) => { 
    let deviation = "";
    let deviationStyle = "";
    const deviationPercent = Math.abs(recycablePriceData?.deviationPercent);
    if (recycablePriceData?.deviationPercent) {
        switch (true) {
            case recycablePriceData?.deviationPercent > 0:
                deviation = `▲ ${deviationPercent}%`;
                deviationStyle = "text-specialGreen";
                break;
            case recycablePriceData?.deviationPercent === 0:
                deviation = `${deviationPercent}%`;
                break;
            default:
                deviation = `▼ ${deviationPercent}%`;
                deviationStyle = "text-specialRed";
        }
    } else {
        deviation = '--';
    }
    
    return(
        <div className={classNames('flex gap-[10px] flex-col justify-center items-start border-r border-b border-grey-20 px-[25px] py-[30px]', className)}>
            <div className="text-sm">
                <p>{recycablePriceData.name}</p>
            </div>
            <div className={`flex gap-[10px] ${s.adaptive}`}>
                <p className={classNames("text-sm", `${deviationStyle}`)}>{deviation}</p>
                <p className="text-sm font-medium">{recycablePriceData.latestDealPrice ? `${recycablePriceData.latestDealPrice} ₽` : "--"}</p>
            </div>
        </div>
   );
  };