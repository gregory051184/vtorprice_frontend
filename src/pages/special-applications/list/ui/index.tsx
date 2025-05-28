import {
    ISpecialApplication,
    SpecialApplicationsListSlider
} from "@box/entities/special-application";
import React from "react";
import {useScreenSize} from "@box/shared/hooks";
import {Container} from "@box/shared/ui";
import {Pagination} from "swiper";
import {Swiper} from "swiper/react";
import {LandingSlider} from "@box/widgets/landing";

type SpecialApplicationsListType = {
    specialApplications: ISpecialApplication[];
}

export const SpecialApplications: React.FC<SpecialApplicationsListType> = ({
    specialApplications
                                                                           }) => {
    const [screenSize, satisfiess] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    return (
        <Container>
            <div>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1.47}
                    modules={[Pagination]}
                    pagination={{
                        el: '.swiper-pagination',
                        type: 'bullets'
                    }}
                >
                    <div className="inline-flex">
                        {specialApplications.length > 0 && specialApplications.map(specApp => (
                            <SpecialApplicationsListSlider specialApplications={specialApplications} specApp={specApp}
                                                           key={specApp.id}/>))}
                    </div>
                </Swiper>
                <div className='swiper-pagination flex mt-[16px] justify-center gap-[15px] pb-2'></div>
                <LandingSlider/>
            </div>
        </Container>
    )
}