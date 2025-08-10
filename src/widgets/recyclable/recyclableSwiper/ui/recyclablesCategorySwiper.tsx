import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import s from "@box/pages/recyclables/ui/style.module.scss";
import classNames from "classnames";
import React from "react";
import {IRecyclablesCategorySwiper} from "@box/widgets/recyclable/recyclableSwiper/ui/types";
import {useRouter} from "next/router";


export const RecyclablesCategorySwiper: React.FC<IRecyclablesCategorySwiper> = ({
                                                                                    categories
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
                {categories().map(category =>
                    <SwiperSlide
                        key={category.recyclableCategory?.id}
                        onClick={() => category?.totalVolume > 0 && router.push(`/applications/wastes/buy/category/${category?.recyclableCategory?.id}`)}
                        className={s.category_main_page_slider}>
                        <div>
                        <span>
                            <p className={classNames(s.category_main_page_slider_name, "text-3xl")}>
                                {category?.recyclableCategory?.name}
                            </p>
                            {category?.totalVolume > 0 &&
                                <p className={classNames(s.category_main_page_slider_name, "text-lg")}>
                                    {`${category?.totalVolume} т`}
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
