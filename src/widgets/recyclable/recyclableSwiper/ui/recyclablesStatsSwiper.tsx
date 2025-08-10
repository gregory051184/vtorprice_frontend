import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import s from "@box/pages/recyclables/ui/style.module.scss";
import React from "react";
import {IRecyclablesStatsSwiper} from "@box/widgets/recyclable/recyclableSwiper/ui/types";

export const RecyclablesStatsSwiper: React.FC<IRecyclablesStatsSwiper> = ({
                                                                      recyclables,
                                                                      deviationPercent,
                                                                      deviationRubles,
                                                                      middlePrice,
                                                                      totalVolume
                                                                  }) => {
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
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div>
                        <h3>Пос. цена</h3>
                        <p className="mt-2 text-lg">
                            {recyclables()[recyclables().length - 1]?.price ?
                                `${recyclables()[recyclables().length - 1]?.price}₽` : '--'
                            }
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div className='ml-12'>
                        <h3>Контрактов</h3>
                        <p className="mt-2 text-lg">
                            {
                                recyclables().length
                            }
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div className='ml-12'>
                        <h3>Изм. ₽</h3>
                        <p className="mt-2 text-lg">
                            {
                                deviationRubles()
                            }
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div className='ml-12'>
                        <h3>Изм. %</h3>
                        <p className="mt-2 text-lg">
                            {
                                deviationPercent()
                            }
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div className='ml-12'>
                        <h3>Средняя цена</h3>
                        <p className="mt-2 text-lg">
                            {
                                middlePrice()
                            }
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    className={s.category_main_page_slider}>
                    <div className='ml-12'>
                        <h3>Объём</h3>
                        <p className="mt-2 text-lg">
                            {
                                totalVolume()
                            }
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
        </div>
    )
}