import React, { useMemo, useRef } from "react";
import { AppShell } from "@box/layouts";
import { Header } from "@box/widgets/header";
import { Footer } from "@box/widgets/footer";
import { BackButton, Badge, Button, Container, Rating } from "@box/shared/ui";
import PointerIcon from "@assets/icons/16_location.svg";
import { useEvent, useGate, useStore, useUnit } from "effector-react";
import Check from "@assets/icons/16_checkmark.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper";
import classNames from "classnames";
import StarImg from "@box/shared/ui/starImg";
import {
  $equipmentApplication,
  $equipmentApplications,
  gate,
  updateIsFavoriteEquipmentApplicationFx,
} from "../model";
import s from "./style.module.scss";
import { useRouter } from "next/router";
import { notAuthAlertModel } from "@box/entities/notAuthAlert/model";
import { $authStore } from "@box/entities/auth";
import { useScreenSize } from "@box/shared/hooks";
import { BreadCrumbs } from "@box/shared/ui/breadCrumbs";

export const EquipmentApplicationPage = () => {
  const application = useStore($equipmentApplication);
  const anotherSimilarApplications = useStore($equipmentApplications);
  const changeIsFavorite = useUnit(updateIsFavoriteEquipmentApplicationFx);

  const paginationRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const isItHaveGeoData = application?.latitude && application?.longitude;
  const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);
  const authStore = useStore($authStore);

  useGate(gate, {
    id: Number(router.query["id"]),
  });

  const [, satisfies] = useScreenSize();

  const slidesPerView = useMemo(() => {
    if (satisfies("sm")) {
      return 3;
    }
    if (satisfies("xsm")) {
      return 2;
    }
    if (satisfies("xxsm")) {
      return 1;
    }
  }, [satisfies]);

  const handleOnClickInFavorite = () => {
    if (application) {
      changeIsFavorite(application.id);
    }
    openModalNotAuth();
  };

  const showOnMapClick = () => {
    router.push({
      pathname: "../map",
      query: {
        showSingleMark: true,
        latitude: application?.latitude,
        longitude: application?.longitude,
        adress: application?.address,
        dealType: application?.dealType?.id,
        price: application?.price,
        company: application?.company?.name,
        equipment: application?.equipment?.name,
        image: application?.images[0]?.image,
      },
    });
  };

  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Container>
        <BackButton />
        {application ? (
          <>
            <div
              className={classNames(
                "flex mt-[10px] mb-[15px] items-center gap-[15px]",
                s.titles
              )}
            >
              <h1 className="text-2xl font-medium mr-[10px]">
                {application.equipment.name}
              </h1>
              {isItHaveGeoData && (
                <Button
                  className={s.buttonShowOnMap}
                  onClick={showOnMapClick}
                  iconLeft={<PointerIcon width={16} height={16} />}
                  type="mini"
                  mode="stroke"
                >
                  Показать на карте
                </Button>
              )}
            </div>
            <BreadCrumbs
              className="mb-6"
              breadcrumbs={[
                {
                  text: "Оборудование",
                  href: "/equipments-applications",
                },
                {
                  text: application.equipment.name,
                },
              ]}
            />
            <div>
              {application.images.length > 0 && (
                <div className="w-full shrink-0">
                  <Swiper
                    className="w-full rounded-[10px]"
                    spaceBetween={0}
                    slidesPerView={slidesPerView}
                    pagination={{
                      type: "bullets",
                      el: paginationRef.current,
                    }}
                    navigation
                    modules={[Pagination]}
                  >
                    {application.images.map((image) => (
                      <SwiperSlide key={image.id} className="w-full">
                        <img
                          className="aspect-[16/9] object-cover"
                          src={image.image}
                          alt=""
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* eslint-disable react/self-closing-comp */}
                  <div
                    ref={paginationRef}
                    className={classNames(
                      "flex mt-[14px] justify-center gap-[14px]",
                      s.pagination
                    )}
                  ></div>
                </div>
              )}

              <div className="grow">
                <div className="">
                  <div
                    className={classNames(
                      "flex justify-between items-end",
                      s.companyBox
                    )}
                  >
                    <div className="">
                      <p className="text-sm text-grey-40">Компания</p>
                      <h2 className="text-xl mt-[4px]">
                        {application.company.name}
                      </h2>
                      <Rating
                        className="mt-[6px]"
                        rating={application.company.averageReviewRate}
                        total={application.company.dealsCount || 0}
                      />
                    </div>
                    <div className="flex gap-[10px] shrink-0">
                      {application.dealType.id === 2 && (
                        <Badge color="red">Продажа</Badge>
                      )}
                      {application.dealType.id === 1 && (
                        <Badge color="green">Покупка</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div
                      className={classNames(
                        "grid grid-cols-2 grid-rows-1 gap-[28px]",
                        s.row
                      )}
                    >
                      <div className="flex py-[17px] border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">Цена</p>
                        <p className="text-2xl font-medium">
                          {application.price} ₽ / шт
                        </p>
                      </div>
                      <div className="flex py-[17px] border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">Работа с НДС</p>
                        {application.withNds ? <Check /> : <p>Нет</p>}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        "grid grid-cols-2 grid-rows-1 gap-[28px]",
                        s.row
                      )}
                    >
                      <div className="flex py-[17px] shrink-0 border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">Кол-во</p>
                        <p>{application.count}</p>
                      </div>
                      <div className="flex py-[17px] border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">Состояние</p>
                        <p>{application.wasInUse ? "Б/У" : "Новое"}</p>
                      </div>
                    </div>
                    <div
                      className={classNames(
                        "grid grid-cols-2 grid-rows-1 gap-[28px]",
                        s.row
                      )}
                    >
                      <div className="flex py-[17px] shrink-0 border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">Тип оборудования</p>
                        <p>{application.equipment.name}</p>
                      </div>
                      <div className="flex py-[17px] border-b border-b-grey-20 items-center justify-between">
                        <p className="text-sm text-grey-40">
                          Дата производства
                        </p>
                        <p>
                          {new Intl.DateTimeFormat("ru-RU", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour12: false,
                          }).format(new Date(application.manufactureDate))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "mt-[32px] flex gap-[20px] flex-wrap",
                      s.buttonsBox
                    )}
                  >
                    <Button
                      className={s.btnOpenDeal}
                      onClick={() =>
                        router.push(`/equipment-deals/new/${application.id}`)
                      }
                    >
                      Открыть сделку
                    </Button>
                    <Button
                      className={s.btnFav}
                      onClick={handleOnClickInFavorite}
                      mode="notFilled"
                      iconLeft={
                        <StarImg
                          width={20}
                          style={{
                            fill: `${application.isFavorite ? "" : "none"}`,
                          }}
                        />
                      }
                    >
                      {application.isFavorite ? "Вы подписаны" : "В избранное"}
                    </Button>
                    <div className="flex items-center gap-[10px]">
                      <PointerIcon
                        width={30}
                        height={30}
                        className="fill-primaryGreen-main shrink-0"
                      />
                      <div className="">
                        <p className="text-grey-40">Адрес</p>
                        <h3 className="text-xs font-normal">
                          {authStore.isAuth
                            ? application.address
                            : "Недоступно для не авторизованных пользователей"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <h3 className="text-grey-40 mt-[50px] mb-[20px] text-base font-normal">
          Похожие заявки
        </h3>
        {anotherSimilarApplications.length > 0 ? (
          <div className="flex flex-wrap gap-[20px]">
            {anotherSimilarApplications.map((application) => (
              <div
                key={application.id}
                className="cursor-pointer"
                onClick={() => router.push(`/equip-apps/${application.id}`)}
              >
                <img
                  className={classNames(
                    "rounded-[10px] w-[180px] h-[134px] m-0",
                    s.rec_img
                  )}
                  src={
                    application.images[0]
                      ? application.images[0].image
                      : "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                  }
                  alt=""
                />
                {application.dealType.id === 2 && (
                  <Badge color="red" className="my-[10px]">
                    Продажа
                  </Badge>
                )}
                {application.dealType.id === 1 && (
                  <Badge color="green" className="my-[10px]">
                    Покупка
                  </Badge>
                )}
                <h4 className="text-base font-medium">
                  {application.equipment.name}
                </h4>
                <p className="text-primaryGreen-main font-semibold mt-[10px]">
                  {application.price} ₽ / шт
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-grey-40 mt-[20px] mb-[20px] text-base font-normal">
            Oтсутствуют
          </p>
        )}
      </Container>
    </AppShell>
  );
};
