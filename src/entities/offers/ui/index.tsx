import classNames from "classnames";
import s from "@box/pages/companies/company/ui/style.module.scss";
import React from "react";
import {OffersRowType} from "@box/entities/offers/lib/types";
import {useRouter} from "next/router";

export const OfferRow: React.FC<OffersRowType> = ({
    application
                                                   }) => {
    const router = useRouter();

    return (
        <div className={classNames('cursor-pointer', s.card_view_card)}
             onClick={() => router.push(`/applications/${application?.id}`)}>

            <div className="w-full aspect-[4/3]">
                <img
                    className="rounded-[10px] w-full h-full object-cover"
                    src={
                        application?.images[0] ? process.env.NEXT_PUBLIC_API_URL + application?.images[0].image
                            : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                    }
                    alt=""
                />
            </div>
            <h4 className="text-base font-medium">{application.recyclables.name}</h4>
            <p className="text-primaryGreen-main font-semibold mt-[10px]">
                {application.price * 1000}
                {' '}
                ₽ / т
            </p>
            <p className="text-xs text-grey-40 mt-[6px]">
                {application.totalPrice}
                {' '}
                ₽ за
                {' '}
                {(application.totalWeight / 1000).toFixed(1)}
                {' '}
                т
            </p>
        </div>
    )
}