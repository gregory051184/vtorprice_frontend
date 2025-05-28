import React from "react";
import { Button, Rating, Separator, TextClamp } from "@box/shared/ui";
import { Avatar } from "@box/entities/user";
import Verified from "@assets/icons/16_verified.svg";
import Reliable from "@assets/icons/16_reliable.svg";
import classNames from "classnames";
import { ICompanyCard } from "./types";
import { useRouter } from "next/router";

export const CompanyCard: React.FC<ICompanyCard> = ({
  company,
  onClickInFavorite,
  className,
}) => {
  const router = useRouter();
  return (
    <div
      className={classNames("p-[16px] bg-grey-10 rounded-[10px]", className)}
      onClick={() => {
        router.push(`/companies/${company.id}`);
      }}
    >
      <div className="flex gap-[10px]">
        <Avatar className="shrink-0" size="sm" url={company?.image || null} />
        <div>
          <p className="ml-[10px]">
            {company.name}{" "}
            {company.status?.id === 2 && <Verified className="inline" />}
            {company.status?.id === 3 && (
              <>
                <Verified className="inline" />
                <Reliable className="inline" />
              </>
            )}
          </p>
          <Rating
              className="ml-2"
              rating={company.averageReviewRate}
              total={company.dealsCount || 0}
          />
        </div>
      </div>
      <Separator h={10}/>
      <div className="flex gap-[25px] flex-wrap">
        <div className="min-w-[150px]">
          <p className="text-xs text-grey-40">Тип компании</p>
          <p className="text-sm mt-[2px]">Заготовитель</p>
        </div>
        <div className="">
          <p className="text-xs text-grey-40">Тип заявок</p>
          <p className="text-sm mt-[2px] ">Покупает</p>
        </div>
      </div>
      <Separator h={10}/>
      <TextClamp>{company.address}</TextClamp>
      <Separator h={10}/>
      <Button
          fullWidth
          mode={company.isFavorite ? "notFilled" : "fill"}
          onClick={(e) => onClickInFavorite(e)}
      >
        {company.isFavorite ? "Отписаться" : "В избранное"}
      </Button>
    </div>
  );
};
