import React from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import { IconCard } from '@box/shared/ui';
import { cards } from '../lib';
import s from './style.module.scss';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

export const AdvantagesCards:React.FC<IWithClass> = ({
  className
}) => {
  return (
    <div className={className}>
      <h3 className={classNames("mt-[60px] text-[32px] mb-[60px] font-medium", s.title)}>Преимущества для вас</h3>
      <div className={classNames('flex flex-wrap', s.advantages)}>
        {/* eslint-disable-next-line react/no-array-index-key */}
        {cards.map((el, num) => <IconCard className={s.advantages_card} key={num} data={el} />)}
      </div>
      <div className={s.slider}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            type: 'bullets',
            el: '.swiper-pagination',
            clickable: true,
          }}
          modules={[Pagination]}
        >
          {cards.map((el) => (
            <SwiperSlide key={el.title}>
              <IconCard className={s.advantages_card} data={el} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='swiper-pagination flex mt-[15px] justify-center gap-[15px]'></div>
      </div>
    </div>
)};
