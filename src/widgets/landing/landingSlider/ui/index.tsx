import React from 'react';
import { IWithClass } from '@types';
import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import Image from 'next/image';
import Arrow from '@assets/icons/slider_nav_arrow.svg';
import { slides } from '../lib';
import 'swiper/css';
import s from './style.module.scss';

export const LandingSlider: React.FC<IWithClass> = ({
  className
}) => (
  <div className={classNames('flex items-center gap-3', s.slider, className)}>
    {/* ---------- Это сделал Савва. Если это убрать, то сломаются слайды стат 
    сверху лендинга для мобильного адаптива. ---------- */}
    {/*<div className={classNames(s.arrow, s.arrow_desktop)} id="slider_prev">
      <Arrow />
    </div>
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      modules={[Navigation]}
      navigation={{
        nextEl: '#slider_next',
        prevEl: '#slider_prev'
      }}
      breakpoints={{
        0: {
          slidesPerView: 1
        },
        755: {
          slidesPerView: 3
        }
      }}
    >
      {slides.map((slide, num) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide key={num}>
          <div className="text-center flex flex-col h-full">
            <Image src={slide.image} className="m-auto grow" alt={slide.title} />
            <h5 className="font-medium text-2xl mb-2 mt-5">{slide.title}</h5>
            <p className="text-lg text-grey-70 leading-normal font-normal">{slide.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className={classNames(s.arrow, s.arrow_desktop)} id="slider_next">
      <Arrow />
    </div>

    <div className={s.mobile_arrows}>
      <div className={classNames(s.arrow)} id="slider_prev">
        <Arrow />
      </div>
      <div className={classNames(s.arrow)} id="slider_next">
        <Arrow />
      </div>
      </div>*/}
  </div>
);
