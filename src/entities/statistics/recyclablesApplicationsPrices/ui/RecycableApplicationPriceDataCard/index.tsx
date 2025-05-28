import classNames from "classnames";
import { IRecyclableApplicationPriceDataCard } from "./types";
import s from './style.module.scss';

export const RecyclableApplicationPriceDataCard: React.FC<IRecyclableApplicationPriceDataCard> = ({
    recyclableApplicationPriceData,
    className
  }) => { 
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
    
    return(
        <div className={classNames('flex gap-[10px] flex-col justify-center items-start border-r border-b border-grey-20 px-[25px] py-[30px]', className)}>
            <div className="text-sm">
                <p>{recyclableApplicationPriceData.name}</p>
            </div>
            <div className={`flex gap-[10px] ${s.adaptive}`}>
                <p className={classNames("text-sm", `${deviationStyle}`)}>{deviation}</p>
                <p className="text-sm font-medium">{recyclableApplicationPriceData.latestDealPrice ? `${recyclableApplicationPriceData.latestDealPrice} ₽` : "--"}</p>
            </div>
        </div>
   );
  };