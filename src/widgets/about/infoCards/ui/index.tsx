import React from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import { IconCard } from '@box/shared/ui';
import { cards } from '../lib';
import s from './style.module.scss';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LandingSlider } from '@box/widgets/landing';

export const InfoCards:React.FC<IWithClass> = ({
  className
}) => (
  <div className={className}>
    <div className={classNames('flex flex-wrap', s.advantages)}>
      {/* eslint-disable-next-line react/no-array-index-key */}
      {cards.map((el, num) => <IconCard className={s.advantages_card} key={num} data={el} />)}
    </div>
    <LandingSlider/> {/* Secret to sliding at mobile adaptive will work */}
    <div>
      <div className={classNames("mt-[36px]", s.slider)}>
        <Swiper
          spaceBetween={20}
          slidesPerView={1.12}
          modules={[Pagination]}
          pagination={{
            type: 'bullets',
            el: '.swiper-pagination',
          }}
        >
        {cards.map((el, num) => (
            <SwiperSlide key={num}>
              <div className={classNames(s.slider_slide, 'bg-grey-10')}>
                {el.icon}
                <p className="text-[24px] mt-[32px] font-medium text-black">{el.title}</p>
                <p className="text-[16px] text-grey-70 mt-[16px]">{el.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
      </div>
    </div>
  </div>

);
