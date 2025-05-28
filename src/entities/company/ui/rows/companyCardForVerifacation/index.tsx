import React from "react";
import { Rating, Separator } from "@box/shared/ui";
import { Avatar } from "@box/entities/user";
import Verified from "@assets/icons/16_verified.svg";
import Reliable from "@assets/icons/16_reliable.svg";
import Check from "@assets/icons/16_checkmark.svg";
import classNames from "classnames";
import Link from "next/link";
import { ICompanyCard } from "./types";
import { useRouter } from "next/router";

export const CompanyCardForVerification: React.FC<ICompanyCard> = ({
  company,
  companyVerification,
  className,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        router.push(`/companies-verification/${companyVerification.id}`);
      }}
      className={classNames("p-[16px] bg-grey-10 rounded-[10px]", className)}
    >
      <div className="flex gap-[10px]">
        <Avatar className="shrink-0" size="sm" url={company?.image || null}/>
        <div>
          <p>
            {company.name}
            {company.status?.id === 2 && <Verified className="inline"/>}
            {company.status?.id === 3 && (
                <>
                  <Verified className="inline"/>
                  <Reliable className="inline"/>
                </>
            )}
          </p>
          <Rating
              rating={company.averageReviewRate}
              total={company.dealsCount || 0}
          />
        </div>
      </div>
      <Separator h={10} />
      <div className="flex gap-[25px] flex-wrap">
        <div className="">
          <p className="text-xs text-grey-40">Тип компании</p>
          <p className="text-sm mt-[2px]">Заготовитель</p>
        </div>
        <div className="">
          <p className="text-xs text-grey-40">Тип заявок</p>
          <p className="text-sm mt-[2px]">Покупает</p>
        </div>
        <div className="">
          <p className="text-xs text-grey-40">С НДС</p>
          <p className="text-sm mt-[2px]">
            {company.withNds ? <Check /> : "Нет"}
          </p>
        </div>
      </div>
      <Separator h={10} />
      <div className="flex gap-[25px] flex-wrap">
        <div className="">
          <p className="text-sm mt-[2px]">
            {company.city ? company.city.name : ""}
          </p>
          <Link passHref href={`/companies/${company.id}?clickButton=true`}>
            <p
              className="text-sm font-light text-primaryGreen-main underline"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              Адрес
            </p>
          </Link>
        </div>
        <div className="">
          <p className="text-sm mt-[2px]">
            {company.recyclables?.at(0)?.recyclables.name || "Нет"}
          </p>
          {company.recyclables?.length > 1 && (
            <Link passHref href={`/companies/${company.id}`}>
              <p
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-light text-primaryGreen-main underline z-10"
              >
                И еще {company?.recyclables.length}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
