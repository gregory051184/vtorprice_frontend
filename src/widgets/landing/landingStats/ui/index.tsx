import React from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import Handshake from '@assets/icons/Handshake Heart.svg';
import Env from '@assets/icons/Environment.svg';
import Rate from '@assets/icons/Sample Rate.svg';
import Group from '@assets/icons/User Groups.svg';
import { useGrowValue } from '@box/shared/hooks';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import s from './style.module.scss';
import { gate } from '../model';
import { useGate, useStore } from 'effector-react';
import { companiesStatsModel, dealsStatsModel, exchangeVolumeModel, recyclablesVolumeStatsModel } from '@box/entities/statistics';

export const LandingStats:React.FC<IWithClass> = ({
  className
}) => {
  useGate(gate);
  const exchangeVolume         = useStore(exchangeVolumeModel.$exchangeVolume);
  const dealsStats             = useStore(dealsStatsModel.$dealsStats);
  const recyclablesVolumeStats = useStore(recyclablesVolumeStatsModel.$recyclablesVolumeStats);
  const сompaniesStats         = useStore(companiesStatsModel.$companiesStats);

  const tradeVol = Number(dealsStats?.total)
  const totalWeightKg = recyclablesVolumeStats?.reduce((acc, item) => acc + item.totalWeightSum, 0);

  const v1 = useGrowValue(0, exchangeVolume?.total || 0, 60);
  const v2 = useGrowValue(0, tradeVol || 0, 60);
  const v3 = useGrowValue(0, parseFloat((totalWeightKg / 1000).toFixed(1)), 60);
  const v4 = useGrowValue(0, сompaniesStats?.total || 0, 60);
  
  return (
    <div className={classNames(className)}>
      <table className={classNames('border-collapse w-full', s.table)}>
        <tbody>
          <tr className="border-b border-b-[#E6E6E6]">
            <td className="border-r border-r-[#E6E6E6] w-6/12  pb-6 pl-4">
              <Rate />
              <p className="text-3xl mt-3 mb-3">
                {v1.toLocaleString()}
                {' '}
                ₽
              </p>
              <span className="text-base text-grey-70">Объем рынка</span>
            </td>
            <td className="w-6/12 pb-6 pl-6">
              <Handshake />
              <p className="text-3xl mt-3 mb-3"> 
                {' '}
                {v2.toLocaleString()}
              </p>
              <span className="text-base text-grey-70">Количество сделок</span>
            </td>
          </tr>
          <tr>
            <td className="border-r pt-6  border-r-[#E6E6E6] w-6/12 pl-4">
              <Env />
              <p className="text-3xl mt-3 mb-3">
                {v3.toLocaleString()}
                {' '}
                т
              </p>
              <span className="text-base text-grey-70">Объем торгов</span>
            </td>
            <td className="w-6/12 pt-6 pl-6">
              <Group />
              <p className="text-3xl mt-3 mb-3"> 
                {' '}
                {v4.toLocaleString()}
                {' '}
              </p>
              <span className="text-base text-grey-70">Количество компаний</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={s.slider}>
        <Swiper
          spaceBetween={20}
          slidesPerView={1.12}
          modules={[Pagination]}
          pagination={{
            el: '.swiper-pagination',
            type: 'bullets'
          }}
        >
          <SwiperSlide>
            <div className={classNames(s.slider_slide, 'bg-grey-10')}>
              <Rate />
              <p className="text-3xl mt-3 mb-3">
                {v1.toLocaleString()}
                {' '}
                ₽
              </p>
              <span className="text-base text-grey-70">Объем рынка</span>
            </div>

          </SwiperSlide>
          <SwiperSlide>
            <div className={classNames(s.slider_slide, 'bg-grey-10')}>

              <Handshake />
              <p className="text-3xl mt-3 mb-3"> 
                {' '}
                {v2.toLocaleString()}
              </p>
              <span className="text-base text-grey-70">Количество сделок</span>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classNames(s.slider_slide, 'bg-grey-10')}>

              <Env />
              <p className="text-3xl mt-3 mb-3">
                {v3.toLocaleString()}
                {' '}
                т
              </p>
              <span className="text-base text-grey-70">Объем торгов</span>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classNames(s.slider_slide, 'bg-grey-10')}>

              <Group />
              <p className="text-3xl mt-3 mb-3"> 
                {' '}
                {v4.toLocaleString()}
                {' '}
              </p>
              <span className="text-base text-grey-70">Количество компаний</span>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
      </div>
           
    </div>
  );
};
