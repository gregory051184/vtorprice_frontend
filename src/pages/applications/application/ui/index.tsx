import React, { useRef } from 'react';
import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import {
  BackButton, Badge, Button, Container, Rating
} from '@box/shared/ui';
import PointerIcon from '@assets/icons/16_location.svg';
import { useEvent, useStore, useUnit } from 'effector-react';
import Check from '@assets/icons/16_checkmark.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import classNames from 'classnames';
import StarImg from '@box/shared/ui/starImg';
import { useRouter } from 'next/router';
import { applicationModel } from '@box/entities/application';
import s from './style.module.scss';
import { $applicationRecs } from '../model';
import { notAuthAlertModel } from '@box/entities/notAuthAlert/model';
import { $authStore } from '@box/entities/auth';
import { BreadCrumbs } from "@box/shared/ui/breadCrumbs";

export const ApplicationPage = () => {
  const application = useStore(applicationModel.$application);
  const toggleIsFavorite = useUnit(applicationModel.updateIsFavoriteApplicationFx);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const recs = useStore($applicationRecs);
  const router = useRouter();
  const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);
  const authStore = useStore($authStore);

  const handleOnClickInFavorite = () => {
    if (application) {
      toggleIsFavorite(application.id);
    }
    openModalNotAuth();
  };

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Container>
        <BackButton />
        {application ? (
          <>
            <div className={classNames("flex mt-[10px] mb-[20px] items-center gap-[15px]", s.header)}>
              <h1 className="text-2xl font-medium mr-[10px]">{application.recyclables.name}</h1>
              {(application.latitude && application.longitude) && <Button onClick={()=>{router.push({
                pathname: '../map',
                query: { 
                  showSingleMark: true, 
                  latitude: application?.latitude, 
                  longitude: application?.longitude,
                  adress: application?.address,
                  dealType: application?.dealType?.id,
                  price: application?.price,
                  company: application?.company?.name,
                  recyclable: application?.recyclables?.name,
                  image: application?.images[0]?.image,

                },
              });}} iconLeft={<PointerIcon width={16} height={16} />} type="mini" mode="stroke">
                Показать на карте
              </Button>}
              <Button onClick={()=>{router.push(`../exchange/${application?.recyclables.id}?type=${application?.urgencyType.id}`);}} iconLeft={<PointerIcon width={16} height={16} />} type="mini" mode="stroke">
                Показать на бирже
              </Button>
            </div>
            <BreadCrumbs
              className="mt-[10px] mb-[20px]"
              breadcrumbs={[
                {
                  text: "Биржа",
                  href: "/exchange",
                },
                {
                  text: application?.recyclables?.name,
                  href: `/exchange/${application?.recyclables?.id}?type=${application?.dealType?.id}`
                },
                {
                  text: application?.recyclables?.name,
                }
              ]}
            />
            <div className="flex flex-col gap-[24px]">
              {application.images.length > 0
                  && (
                    <div className="w-full">
                      <Swiper
                        className="w-full rounded-[10px]"
                        spaceBetween={10}
                        slidesPerView={3}
                        pagination={{
                          type: 'bullets',
                          el: paginationRef.current,
                        }}
                        navigation
                        breakpoints={
                          {
                            1: {
                              slidesPerView: 1,
                            },
                            444: {
                              slidesPerView: 2,
                            },
                            744: {
                              slidesPerView: 3,
                            },
                          }
                        }
                      >
                        {application.images.map((image) => (
                          <SwiperSlide key={image.id} className="w-full">
                            <img className="aspect-[16/9] object-cover rounded-[10px]" src={image.image} alt="" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

              <div className="grow">
                <div className="">
                  <div className={classNames("flex justify-between items-end gap-[24px]", s.title)}>
                    <div className="">
                      <p className="text-sm text-grey-40">Компания</p>
                      <h2 className="text-xl mt-[4px]">{application.company.name}</h2>
                      <Rating className="mt-[10px]" rating={application.company.averageReviewRate} total={application.company.dealsCount || 0} />
                    </div>
                    <div className="flex gap-[10px] shrink-0">
                      {application.dealType.id === 2 && (
                        <Badge color="red">
                          Продажа
                        </Badge>
                      )}
                      {application.dealType.id === 1 && (
                        <Badge color="green">
                          Покупка
                        </Badge>
                      )}
                      {application.applicationRecyclableStatus.id === 1 && (
                          <Badge color="green">
                            Отходы
                          </Badge>
                      )}
                      {application.applicationRecyclableStatus.id === 2 && (
                          <Badge color="green">
                            Гранула
                          </Badge>
                      )}
                      {application.urgencyType.id === 1 && (
                        <Badge color="green">
                          Готово к отгрузке
                        </Badge>
                      )}
                      {application.urgencyType.id === 2 && (
                        <Badge color="red">
                          Контракт на поставку
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className={classNames("mt-[20px] flex gap-[28px]", s.fields)}>
                    <div className='flex flex-col w-full'>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Цена</p>
                          <p className="text-[18px] text-grey-90 font-semibold">
                            {application.price * 1000}
                            {' '}
                            ₽ / т
                          </p>
                        </div>
                      </div>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Стоимость</p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {application.totalPrice}
                            {' '}
                            ₽
                          </p>
                        </div>
                      </div>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Вес</p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {(application.totalWeight / 1000).toFixed(1)}
                            {' '}
                            т
                          </p>
                        </div>
                      </div>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Кол–во кип</p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {application.baleCount}
                          </p>
                        </div>
                      </div>
                      <div className={classNames("flex h-[38px] items-start mt-[17px]", s.weight)}>
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">
                            Вес одной кипы
                          </p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {application.baleWeight ? (`${(application.baleWeight / 1000).toFixed(1)} т`) : ""}

                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col w-full'>

                      <div className="flex h-[38px] border-b border-b-grey-20 items-start">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Дата создания</p>
                          <p className="text-[12px] text-grey-90 font-semibold">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Работа с НДС</p>
                          {application.withNds
                              ? <Check/>
                              : <p className="text-[14px] text-grey-90 font-medium">Нет</p>}
                        </div>
                      </div>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">Упаковка</p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {!application.isPackingDeduction
                                ? 'Включена'
                                : 'Вычитается'}
                          </p>
                        </div>
                      </div>
                      <div className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                        <div className='flex justify-between items-center w-full'>
                          <p className="text-[12px] text-grey-40">
                            {
                              application.packingDeductionType?.id === 1
                                  ? 'На упаковку с каждой кипы' : 'Из общего веса'
                            }
                          </p>
                          <p className="text-[14px] text-grey-90 font-medium">
                            {application?.packingDeductionValue}
                          </p>
                        </div>
                      </div>
                      <div className="flex row-span-3 mt-[17px] items-start gap-[20px] justify-between">
                        <p className="text-[12px] text-grey-40">
                          Комментарий
                        </p>
                        <p className="break-all text-[14px] text-grey-90 font-medium">
                          {application.comment || 'Без комментариев'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={classNames("mt-[32px] flex gap-[20px]", s.buttons_container)}>
                    <div className={classNames("flex gap-[20px]", s.buttons)}>
                      <Button disabled={application.isDeleted} className="shrink-0" onClick={() => router.push(`/deals/new/${application.id}`)}>
                        Открыть сделку
                      </Button>
                      <Button
                          className={classNames("shrink-0", s.favorite)}
                          onClick={handleOnClickInFavorite}
                          mode="notFilled"
                        iconLeft={<StarImg width={20} style={{ fill: `${application.isFavorite ? '' : 'none'}` }} />}
                      >
                        {application.isFavorite ? 'Вы подписаны' : 'В избранное'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <PointerIcon width={30} height={30} className="fill-primaryGreen-main shrink-0" />
                      <div className="">
                        <p className="text-grey-40">Адрес</p>
                        <h3 className="text-xs font-normal">{authStore.isAuth ? application.address : "Недоступно для не авторизованных пользователей"}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <h3 className="text-grey-40 mt-[50px] mb-[20px] text-base font-normal">Похожие заявки</h3>
        <div className="flex flex-wrap gap-[20px]">
          {recs.map((rec) => (
            <div
              key={rec.id}
              className="cursor-pointer"
              onClick={() => router.push(`/applications/${rec.id}`)}
            >
              <img
                className={classNames("rounded-[10px] w-[180px] h-[134px] m-0", s.rec_img)}
                src={
                  rec.images[0] ? rec.images[0].image
                    : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                }
                alt=""
              />
              {rec.dealType.id === 2 && (
                <Badge color="red" className="my-[10px]">
                  Продажа
                </Badge>
              )}
              {rec.dealType.id === 1 && (
                <Badge color="green" className="my-[10px]">
                  Покупка
                </Badge>
              )}
              <h4 className="text-base font-medium">{rec.recyclables.name}</h4>
              <p className="text-primaryGreen-main font-semibold mt-[10px]">
                {rec.price * 1000}
                {' '}
                ₽ / т
              </p>
              <p className="text-xs text-grey-40 mt-[6px]">
                {rec.totalPrice}
                {' '}
                ₽ за
                {' '}
                {(rec.totalWeight / 1000).toFixed(1)}
                {' '}
                т
              </p>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
};
