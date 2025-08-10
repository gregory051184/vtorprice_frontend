import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import s from "@box/pages/recyclables/ui/style.module.scss";
import classNames from "classnames";
import React from "react";
import {IRecyclableSwiper} from "@box/widgets/recyclable/recyclableSwiper/ui/types";
import {useRouter} from "next/router";


export const RecyclableSwiper: React.FC<IRecyclableSwiper> = ({
                                                                  recyclables
                                                              }) => {
    const router = useRouter();
    return (
        <div className="mt-6">
            <Swiper
                slidesPerView={1}
                spaceBetween={15}
                pagination={{
                    el: ".swiper-pagination",
                    type: "bullets"
                }}
                modules={[Pagination]}
            >
                {recyclables().map(item =>
                    <SwiperSlide
                        key={item?.recyclable?.id}
                        onClick={() => item?.totalVolume > 0 && router.push(`/applications/wastes/buy/category/recyclable/${item?.recyclable?.id}`)}
                        className={s.category_main_page_slider}>
                        <div>
                        <span>
                            <p className={classNames(s.category_main_page_slider_name, "text-3xl")}>
                                {item?.recyclable?.name}
                            </p>
                            {item?.totalVolume > 0 &&
                                <p className={classNames(s.category_main_page_slider_name, "text-lg")}>
                                    {`${item?.totalVolume} т`}
                                </p>
                            }
                        </span>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
            <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
        </div>
    )
}
