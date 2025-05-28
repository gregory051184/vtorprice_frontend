import React, { FC } from "react";
import { IExchangeRecyclableCard } from "./types";
import ArrowUp from "@assets/icons/arrow_up.svg";
import ArrowDown from "@assets/icons/arrow_down.svg";
import { useScreenSize } from "@box/shared/hooks";
import classNames from "classnames";

const ExchangeRecyclableCard: FC<IExchangeRecyclableCard> = ({ recyclable, onClick}) => {
  const [screenSize] = useScreenSize()
  const isMobile = screenSize === 'xxsm';

  return <div className="px-[10px] py-[16px] flex flex-col gap-[16px] cursor-pointer bg-grey-10 rounded-[10px]" onClick={onClick}>
    <div
      className={classNames("flex gap-[16px]", !isMobile && ' border-b-[1px] border-b-grey-20 pb-[16px]')}
    >
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Категория</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.name}
        </span>
      </div>
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Мин. вес фуры</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.lotSize || '-'}
        </span>
      </div>
      {!isMobile && <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Текущая цена</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.latestDealPrice || '-'}
        </span>
      </div>}
    </div>
    {isMobile && <div className="flex gap-[16px]">
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Текущая цена</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.latestDealPrice || '-'}
        </span>
      </div>
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Покупка</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.purchaseApplicationsCount}
        </span>
      </div>
    </div>}
    <div
      className={classNames("flex gap-[16px]", !isMobile && 'border-b-[1px] border-b-grey-20 pb-[16px]')}
    >
      {!isMobile && <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Покупка</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.purchaseApplicationsCount}
        </span>
      </div>}
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">Продажа</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.purchaseApplicationsCount}
        </span>
      </div>
      <div className="flex flex-col w-full">
        <span className="text-[14px] text-grey-40">График</span>
        <span className="text-[16px] text-black font-medium">
          {recyclable.deviation === 1 ? <ArrowUp /> : recyclable.deviation === -1 ? <ArrowDown /> : '-'}
        </span>
      </div>
    </div>
    <div
      className={
        classNames(
          "text-[14px] text-grey-40 flex",
          isMobile ? "justify-start border-t-[1px] border-t-grey-20 pt-[16px]" : ' justify-end'
        )
      }
    >
      {
        recyclable.publishedDate ? (
          new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
          }).format(new Date(recyclable.publishedDate))
        ) :
          '-'
      }
    </div>
  </div>
}

export { ExchangeRecyclableCard }
