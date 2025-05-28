import React from 'react';
import { Button, Container } from '@box/shared/ui';
import classNames from 'classnames';
import Russia from '@assets/icons/Russia.svg';
import { DeliveryCalculator } from '@box/features';
import Img1 from '@assets/images/image 55.png';
import Img2 from '@assets/images/image 56.png';
import Img3 from '@assets/images/image 57.png';
import Img4 from '@assets/images/image 58.png';
import Feedback1 from '@assets/images/image 63.png';
import Feedback2 from '@assets/images/image 64.png';
import Feedback3 from '@assets/images/image 65.png';
import { AppShell } from '@box/layouts';
import { AdvantagesCards, StepsCards } from '@box/widgets/logistics';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { Contacts } from '@box/widgets/contacts';
import { useRouter } from 'next/router';
import s from './style.module.scss';
import { Address } from "@box/features/address";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import LeftArrow from '@assets/icons/left-arrow.svg';
import RightArrow from '@assets/icons/right-arrow.svg';
import Head from 'next/head';

function Index() {
  const router = useRouter();

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>Логистика</title>
      </Head>
      <Container>
        <div className={classNames('flex items-center justify-between gap-20 mt-[86px] mb-[126px] info_banner')}>
          <div className={classNames('hidden w-[90%] flex justify-center items-center', s.top_banner, s.showXSM, s.closeXXSM)}>
            <Russia width="90%" />
          </div>
          <div className={classNames('w-6/12', s.banner_stats, s.bottom_banner_stats)}>
            <h2 className={`info_banner_title ${s.textAdaptive}`}>
              Автоперевозки фурами по всей России, Европе
              и СНГ
            </h2>
            <div className={classNames('hidden w-[90%] py-[30px] flex justify-center items-center', s.top_banner, s.showXXSM)}>
              <Russia width="90%" />
            </div>
            <p className={`text-lg text-grey-70 mt-5 font-normal ${s.textAdaptive}`}>
              Оставьте заявку – поможем оперативно
              найти машину под ваши задачи
            </p>
          </div>
          <div className={classNames('w-6/12 flex justify-end items-center', s.top_banner, s.closeXSM)}>
            <Russia width="90%" />
          </div>
        </div>
        <DeliveryCalculator />
        <AdvantagesCards />
      </Container>
      <div className='mt-[80px] bg-grey-10 py-[40px]'>
        <Container className={classNames('flex-col flex items-center')}>
          <p className="text-grey-40 text-[18px] font-medium">
            Бесплатная консультация
          </p>
          <p className={classNames("font-medium text-black text-[32px] mt-[16px]", s.phone)}>
            +7 (962) 557–55–88
          </p>
        </Container>
      </div>
      <Container>
        <StepsCards className="mt-[80px]" />
        <div className={classNames('flex gap-[32px] mt-[60px]', s.images)}>
          <div className={classNames('w-6/12 hover:brightness-75 cursor-pointer')}>
            <img className="w-full h-full rounded-[10px]" src={Img2.src} alt="" />
          </div>
          <div className={classNames('w-6/12 flex flex-col gap-[38px]')}>
            <div className="flex gap-[32px]">
              <div className="w-6/12 hover:brightness-75 cursor-pointer">
                <img className="w-full rounded-[10px]" src={Img4.src} alt="" />
              </div>
              <div className="w-6/12 hover:brightness-75 cursor-pointer">
                <img className="w-full rounded-[10px]" src={Img3.src} alt="" />
              </div>
            </div>
            <div className="grow hover:brightness-75 cursor-pointer">
              <img className="h-full rounded-[10px]" src={Img1.src} alt="" />
            </div>
          </div>

        </div>
        <div className="mt-[80px] flex flex-col justify-center text-center mb-[24px]">
          <h3 className={classNames("text-center font-medium text-[32px] mb-[24px]", s.car)}>
            Подберем машину под ваши задачи
          </h3>
          <p className={classNames("text-grey-70 text-[18px]", s.car_description)}>
            Оставьте заявку - проконсультируем и поможем
            <br className={s.br} />
            {' '}
            организовать оптимальную доставку вашего груза
          </p>
          <Button className="self-center mt-[32px]" onClick={() => router.push('/transport-new-application')}>
            Оставить заявку
          </Button>
        </div>
      </Container>
      <div className={classNames('bg-grey-10', s.feedback)}>
        <Container className={s.feedback_container}>
          <h3 className="text-center text-3xl mb-14">Наши отзывы</h3>
          <div className={classNames('flex gap-12', s.feedback_images)}>
            <div className="grow">
              <img src={Feedback1.src} alt="" />
            </div>
            <div className="grow">
              <img src={Feedback2.src} alt="" />
            </div>
            <div className="grow">
              <img src={Feedback3.src} alt="" />
            </div>
          </div>
        </Container>
        <div className={s.slider}>
          <h3 className="text-center text-3xl mb-14">Наши отзывы</h3>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            modules={[Navigation]}
          >
              <SwiperSlide>
                <div className="grow">
                  <img src={Feedback1.src} alt="" />
                </div>
              </SwiperSlide>
            <SwiperSlide>
              <div className="grow">
                <img src={Feedback2.src} alt="" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="grow">
                <img src={Feedback3.src} alt="" />
              </div>
            </SwiperSlide>
          </Swiper>
          <div className='flex justify-center mt-[32px] gap-[32px]'>
            <div className="swiper-button swiper-button-prev cursor-pointer">
              <LeftArrow />
            </div>
            <div className='swiper-button swiper-button-next cursor-pointer'>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
      <Address latitude={55.783013} longitude={49.193766} />
      <Contacts />
    </AppShell>
  );
}

export default Index;
