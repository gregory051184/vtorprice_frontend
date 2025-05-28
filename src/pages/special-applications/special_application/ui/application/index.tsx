import {useGate, useStore} from "effector-react";
import {$specialApplication, specialApplicationGate} from "@box/entities/special-application";
import {BackButton, Button, Container, Rating} from "@box/shared/ui";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import React, {useEffect, useRef} from "react";
import {AppShell} from "@box/layouts";
import s from "@box/pages/profile/applications/application/style.module.scss";
import classNames from "classnames";
import PointerIcon from "@assets/icons/16_location.svg";
import {Swiper, SwiperSlide} from "swiper/react";
import Check from "@assets/icons/16_checkmark.svg";
import {useRouter} from "next/router";
import {$authStore} from "@box/entities/auth";
import {ChatWidget} from "@box/widgets/chats";
import {Space} from "@mantine/core";

export const SpecialApplication = () => {
    const application = useStore($specialApplication);
    const paginationRef = useRef<HTMLDivElement | null>(null);
    const authStore = useStore($authStore);
    const router = useRouter();

    useEffect(() => {
    }, [application]);
    useGate(specialApplicationGate)
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Container>
                <BackButton/>
                {application ? (
                    <>
                        <div className={classNames("flex mt-[10px] mb-[20px] items-center gap-[15px]", s.header)}>
                            <h1 className="text-2xl font-medium mr-[10px]">{'Спец. объявление'}</h1>
                            {(application.specialApplication?.latitude && application.specialApplication?.longitude) &&
                                <Button onClick={() => {
                                    router.push({
                                        pathname: '../map',
                                        query: {
                                            showSingleMark: true,
                                            latitude: application?.specialApplication?.latitude,
                                            longitude: application?.specialApplication?.longitude,
                                            address: application?.specialApplication?.address,
                                            price: application?.specialApplication?.price,
                                            company: application?.specialApplication?.companies?.[0].name,
                                            image: application?.specialApplication?.images[0]?.image,

                                        },
                                    });
                                }} iconLeft={<PointerIcon width={16} height={16}/>} type="mini" mode="stroke">
                                    Показать на карте
                                </Button>}
                        </div>
                        <div className="flex flex-col gap-[24px]">
                            {application?.specialApplication?.images.length > 0
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
                                            {application.specialApplication?.images.map((image) => (
                                                <SwiperSlide key={image.id} className="w-full">
                                                    <img className="aspect-[16/9] object-cover rounded-[10px]"
                                                         src={image.image} alt=""/>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )}
                            <div className="grow">
                                <div className="inline-flex">
                                    <div>
                                        <div
                                            className={classNames("flex justify-between items-end gap-[24px]", s.title)}>
                                            <div className="">
                                                <p className="text-sm text-grey-40">Компания</p>

                                                <h2 className="text-xl mt-[4px]">{
                                                    //@ts-ignore
                                                    application?.specialApplication?.companies[0].name
                                                }
                                                </h2>
                                                <Rating className="mt-[10px]" rating={
                                                    //@ts-ignore
                                                    application?.specialApplication?.companies[0].averageReviewRate}
                                                    //@ts-ignore
                                                        total={application?.specialApplication?.companies[0].dealsCount || 0}/>
                                            </div>
                                        </div>
                                        <div className={classNames("mt-[20px] flex gap-[28px]", s.fields)}>

                                            <div className=" flex-col w-2/3">
                                                <div className='flex flex-col w-full'>
                                                    <div
                                                        className="flex h-[38px] border-b border-b-grey-20 items-start">
                                                        <div className='flex justify-between items-center w-full'>
                                                            <p className="text-[12px] text-grey-40">Цена</p>
                                                            <p className="text-[18px] text-grey-90 font-semibold">
                                                                {application?.specialApplication?.price}
                                                                {' '}
                                                                ₽
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex row-span-3 mt-[17px] items-start gap-[20px] justify-between">
                                                    <p className="text-[12px] text-grey-40">
                                                        Описание
                                                    </p>
                                                    <p className="break-all text-[14px] text-grey-90 font-medium">
                                                        {application.specialApplication?.description}
                                                    </p>
                                                </div>
                                                <div
                                                    className="flex h-[38px] border-b border-b-grey-20 items-start mt-[17px]">
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className="text-[12px] text-grey-40">Работа с НДС</p>
                                                        {application.specialApplication?.withNds
                                                            ? <Check/>
                                                            :
                                                            <p className="text-[14px] text-grey-90 font-medium">Нет</p>}
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex row-span-3 mt-[17px] items-start gap-[20px] justify-between">
                                                    <p className="text-[12px] text-grey-40">
                                                        Комментарий
                                                    </p>
                                                    <p className="break-all text-[14px] text-grey-90 font-medium">
                                                        {application.specialApplication?.comment || 'Без комментариев'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-[10px] mt-5">
                                            <PointerIcon width={30} height={30}
                                                         className="fill-primaryGreen-main shrink-0"/>
                                            <div className="">
                                                <p className="text-grey-40">Адрес</p>
                                                <h3 className="text-xs font-normal">{authStore.isAuth ? application.specialApplication?.address : "Недоступно для не авторизованных пользователей"}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-1/3 ml-10">
                                        <ChatWidget
                                            mini
                                            name={`Чат с продавцом: ${application?.specialApplication?.id}`}
                                            chatId={application?.specialApplication?.chat}/>
                                        <Space h={20}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </Container>
        </AppShell>
    )
}