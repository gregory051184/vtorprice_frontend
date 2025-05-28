import React from 'react';
import {IWithClass} from '@box/types';
import classNames from 'classnames';
import Handshake from '@assets/icons/Handshake Heart.svg';
import Env from '@assets/icons/Environment.svg';
import Rate from '@assets/icons/Sample Rate.svg';
import Group from '@assets/icons/User Groups.svg';
import {useGrowValue, useScreenSize} from '@box/shared/hooks';
import {Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import s from './style.module.scss';
import {gate} from '../model';
import {useGate, useStore} from 'effector-react';
import {
    companiesStatsModel,
    dealsStatsModel,
    exchangeVolumeModel,
    recyclablesVolumeStatsModel
} from '@box/entities/statistics';

export const NewLandingStats: React.FC<IWithClass> = ({
                                                          className
                                                      }) => {
    useGate(gate);
    const exchangeVolume = useStore(exchangeVolumeModel.$exchangeVolume);
    const dealsStats = useStore(dealsStatsModel.$dealsStats);
    const recyclablesVolumeStats = useStore(recyclablesVolumeStatsModel.$recyclablesVolumeStats);
    const сompaniesStats = useStore(companiesStatsModel.$companiesStats);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const tradeVol = Number(dealsStats?.total)
    const totalWeightKg = recyclablesVolumeStats?.reduce((acc, item) => acc + item.totalWeightSum, 0);

    const v1 = useGrowValue(0, exchangeVolume?.total || 0, 60);
    const v2 = useGrowValue(0, tradeVol || 0, 60);
    const v3 = useGrowValue(0, parseFloat((totalWeightKg / 1000).toFixed(1)), 60);
    const v4 = useGrowValue(0, сompaniesStats?.total || 0, 60);

    return (
        <div className={classNames(className)}>
            {!isMobile && <div className="inline-flex mt-5">
                <div className="ml-5 p-3">
                    <Rate/>
                    <p className="mt-3 mb-3">
                        {v1.toLocaleString()}
                        {' '}
                        ₽
                    </p>
                    <span className="text-base text-grey-70">Объем рынка</span>
                </div>
                <div className="ml-36 p-3">
                    <Handshake/>
                    <p className="mt-3 mb-3">
                        {' '}
                        {v2.toLocaleString()}
                    </p>
                    <span className="text-base text-grey-70">Количество сделок</span>
                </div>
                <div className="ml-36 p-3">
                    <Env/>
                    <p className="mt-3 mb-3">
                        {v3.toLocaleString()}
                        {' '}
                        т
                    </p>
                    <span className="text-base text-grey-70">Объем торгов</span>
                </div>
                <div className="ml-36 p-3">
                    <Group/>
                    <p className="mt-3 mb-3">
                        {' '}
                        {v4.toLocaleString()}
                        {' '}
                    </p>
                    <span className="text-base text-grey-70">Количество компаний</span>
                </div>
            </div>}
            {isMobile && <div className={s.slider}>
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
                            <Rate/>
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

                            <Handshake/>
                            <p className="text-3xl mt-3 mb-3">
                                {' '}
                                {v2.toLocaleString()}
                            </p>
                            <span className="text-base text-grey-70">Количество сделок</span>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={classNames(s.slider_slide, 'bg-grey-10')}>

                            <Env/>
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

                            <Group/>
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
            </div>}
        </div>
    );
};
