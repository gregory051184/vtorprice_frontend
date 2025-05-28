import {Button} from "@box/shared/ui";
import {SwiperSlide} from "swiper/react";
import React from "react";
import {SpecialApplicationsListType} from "@box/entities/special-application/ui/types/types";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";

export const SpecialApplicationsListSlider: React.FC<SpecialApplicationsListType> = ({
    specialApplications,
    specApp
                                                                               }) => {

    const router = useRouter();
    const [screenSize, satisfiess] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    return (
        <SwiperSlide key={specApp.id}>
            <div
                className={specialApplications.length === 1 ? 'w-[700px] inline-flex mt-2 ml-80' : 'w-[700px] mt-2 inline-flex'}>
                <div>
                    <img
                        className={
                            !isMobile ?
                                "w-[500px] rounded-[3px] h-[200px] object-cover"  :
                                "rounded-[10px] w-full h-[120px] object-cover"
                        }
                        src={
                            specApp?.specialApplication?.images[0] ? specApp.specialApplication?.images[0]?.image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />
                </div>
                <div
                    className={!isMobile ? "cursor-pointer w-full ml-10" : "mt-8"}>
                    <p className="font-semibold mt-1 text-4xl text-white">
                        {specApp?.specialApplication?.price}
                        {' '}
                        ₽
                    </p>
                    <p className="mt-1 text-white">
                        {specApp?.specialApplication?.description}
                    </p>
                    <Button
                        className="mt-5"
                        onClick={() => router.push(`/special-applications/${specApp?.id}/`)}>
                        Подробнее
                    </Button>
                </div>
            </div>
        </SwiperSlide>
    )
}