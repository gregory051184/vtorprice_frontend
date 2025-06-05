import React, {useEffect, useState} from 'react';
import {useEvent, useGate, useStore, useUnit} from 'effector-react';

import {Avatar} from '@box/entities/user';
import {
    BackButton,
    Button, Container, Pagination, Rating
} from '@box/shared/ui';
import Check from '@assets/icons/16_checkmark.svg';
import Varified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import StarImg from '@box/shared/ui/starImg';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {AppShell} from '@box/layouts';
import {RecyclablesCircleGraphics} from '@box/entities/recyclable';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {
    $applicationsCount,
    $company, $companyApplications, applicationsPagination, changeInFavoriteFx, fetchApplications
} from '../model';
import {ContactsSlider} from '@box/widgets/companies/contactsDrawer';
import s from './style.module.scss';
import {useBoolean} from '@box/shared/hooks';
import {openModalNotAuthEvent} from '@box/entities/notAuthAlert/model';
import {$authStore} from '@box/entities/auth';
import {Tooltip, Badge} from '@mantine/core';
import Head from 'next/head';
import {BreadCrumbs} from '@box/shared/ui/breadCrumbs';
import {$companyStaff, companyStaffGate} from "@box/features/settings/company-staff-management";

export const Company: React.FC = () => {
    useGate(companyStaffGate);
    const users = useStore($companyStaff);
    const company = useStore($company);
    const applications = useStore($companyApplications);
    const applicationsCount = useStore($applicationsCount);
    const fetchCompanyApplications = useEvent(fetchApplications);

    const changeIsFavorite = useUnit(changeInFavoriteFx);
    const router = useRouter();
    const {clickButton} = router.query;
    const [mode, setMode] = useState<'comments' | 'applications'>('applications');
    const authStore = useStore($authStore);
    const {value, toggle} = useBoolean(false);
    const openModalNotAuth = useEvent(openModalNotAuthEvent);

    const handleClickContactButton = () => {
        authStore.isAuth ? toggle() : null;
        openModalNotAuth();
    };

    if (clickButton) {
        handleClickContactButton();
    }

    const handleOnClickInFavorite = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        if (company) {
            const {id} = company;
            changeIsFavorite({id});
        }
        openModalNotAuth();
    };

    useEffect(() => {
        fetchCompanyApplications({});
    }, [company, users]);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Компания</title>
            </Head>
            <Container>
                <div>
                    {company && (
                        <>
                            <div className='flex w-full gap-[10px]'>
                                <div className="flex justify-start w-4/5">
                                    <div className="flex flex-col gap-[10px] w-4/6">
                                        <BackButton className='mb-[0px]'/>
                                        <div className="flex justify-start gap-[10px] w-full">

                                            <h1 className="text-2xl gap-[10px] font-medium">
                                                {company.name}
                                                <span className='m-0 mt-[6px]'>
                        {company.status.id === 2 &&
                            <Tooltip label="Верифицированная компания" position="top">
                                <a className="inline-block align-middle mr-2 ml-2 mt-[-4px]"><Varified
                                    className={classNames("scale-150")}/></a>
                            </Tooltip>}
                                                    {company.status.id === 4 && (
                                                        <span
                                                            className={classNames("inline-block align-middle ml-2 mt-[-4px]")}>
                            <Tooltip label="Ненадёжная компания" position="top">
                              <a className="inline-block align-middle mr-2">
                                <svg width="16" height="17" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className={classNames("scale-150")}>
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604ZM16.1925 17.6067L6.39327 7.80749C4.33767 10.5493 4.55666 14.4562 7.05025 16.9497C9.54384 19.4433 13.4507 19.6623 16.1925 17.6067ZM16.9497 7.05025C19.4433 9.54384 19.6623 13.4507 17.6067 16.1925L7.80749 6.39327C10.5493 4.33767 14.4562 4.55666 16.9497 7.05025Z"
                                        fill="red"/>
                                </svg>
                              </a>
                            </Tooltip>
                              </span>
                                                    )}
                                                    {company.status.id === 3 && (
                                                        <span
                                                            className={classNames("inline-block align-middle ml-2 mt-[-4px]")}>
                            <Tooltip label="Верифицированная компания" position="top">
                              <a className="inline-block align-middle mr-2"><Varified
                                  className={classNames("scale-150")}/></a>
                            </Tooltip>
                            <Tooltip label="Проверенная компания" position="top">
                              <a className="inline-block align-middle mr-2"><Reliable
                                  className={classNames("scale-150")}/></a>
                            </Tooltip> 
                          </span>
                                                    )}
                      </span>
                                            </h1>

                                        </div>
                                        <></>
                                        <Rating className={s.ratingAdaptive} rating={company.averageReviewRate}
                                                total={company.dealsCount || 0}/>
                                    </div>
                                </div>
                                <div className='flex justify-end w-1/5'>
                                    <Avatar size="xl" className={classNames("shrink-0 hidden", s.underheader_avatar)}
                                            url={company.image ? company.image : null}/>
                                </div>
                            </div>
                            <div className={`mt-[30px] ${s.navAdaptive}`}>
                                <BreadCrumbs
                                    className=""
                                    breadcrumbs={[
                                        {
                                            text: "Каталог компаний",
                                            href: "/companies",
                                        },
                                        {
                                            text: company.name,
                                        },
                                    ]}
                                />
                            </div>
                            <div className="mt-[32px] flex gap-[30px]">
                                <Avatar size="xxl" className={classNames("shrink-0", s.companyAvatar)}
                                        url={company.image ? company.image : null}/>
                                <div className="grow">
                                    <div className={classNames(
                                        'flex grow border gap-6 border-grey-20 p-[20px] rounded-[10px]',
                                        s.myTable
                                    )}>
                                        {company.activityTypes.map((el: any) => (
                                            <div key={el.id}
                                                 className={classNames("w-[250px] border-r border-r-grey-20 pr-[25px]", s.myTable_borders)}>
                                                <div className="">
                                                    <p className="text-sm text-grey-40">
                                                        {el.activity.label}
                                                    </p>
                                                </div>
                                                <div className="">
                                                    <div className={s.myTable_elems}>
                                                        {el.recColTypes.map((el2: any, num: number) => (
                                                            <div className="flex gap-[10px] ">
                                                                <div
                                                                    className="w-[30px] mt-[10px] shrink-0 h-[30px] rounded-full border border-secondaryGreen-dark flex items-center justify-center">
                                  <span className="text-sm text-primaryGreen-main">
                                    {num + 1}
                                  </span>
                                                                </div>
                                                                <p key={el2.id}
                                                                   className="text-md mt-[13px] flex gap-[15px]">
                                                                    {el2.name}
                                                                </p>
                                                            </div>
                                                        ))}
                                                        <div
                                                            className={classNames("mt-[25px] mb-[5px] flex gap-[15px] flex-wrap", s.myTable_elems2)}>
                                                            {el.advantages.map((el2: any) => (
                                                                <div key={el2.id}>
                                                                    <p className="text-sm px-[10px] text-primaryGreen-main py-[4px] bg-secondaryGreen-light rounded-full inline-block">{el2.name}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={classNames("grow", s.myTable_down)}>
                                            <div
                                                className={classNames("pb-[25px] border-b border-b-grey-20", s.myTable_down_elems3, s.myTable_down_border2)}>
                                                <p className="text-sm text-grey-40">Совершенных сделок </p>
                                                <h5 className="text-xl font-semibold mt-[5px]">0</h5>
                                            </div>
                                            <div
                                                className={classNames("pb-[25px] border-b border-b-grey-20 mt-[16px]", s.myTable_down_elems3, s.myTable_down_border2, s.myTable_littleMargin)}>
                                                <p className="text-sm text-grey-40">Ежемесячный объем </p>
                                                <h5 className="text-xl font-semibold mt-[5px]">
                                                    {company.monthlyVolume ? (company.monthlyVolume / 1000).toFixed(1) : '0'}
                                                    {' '}
                                                    т
                                                </h5>
                                            </div>
                                            <div
                                                className={classNames("mt-[16px]", s.myTable_down_elems3, s.myTable_littleMargin)}>
                                                <p className="text-sm text-grey-40">Работа с НДС </p>
                                                <h5 className="text-xl font-semibold mt-[10px]">{company.withNds ?
                                                    <Check/> : 'Нет'}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classNames("flex justify-between mt-[32px] ", s.sellAndBuy)}>
                                        <div className="w-6/12">
                                            <h3 className={s.block_title}>Покупает</h3>
                                            <div className={s.block_content}>
                                                <RecyclablesCircleGraphics
                                                    recyclables={applications.filter(app => app.urgencyType.id === 2 && app.dealType.id === 1)/*company.recyclables.filter((el) => el.action.id === 1)*/}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-6/12">
                                            <h3 className={s.block_title}>Продает</h3>
                                            <div className={s.block_content}>
                                                <RecyclablesCircleGraphics
                                                    recyclables={applications.filter(app => app.urgencyType.id === 2 && app.dealType.id === 2)/*company.recyclables.filter((el) => el.action.id === 2)*/}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classNames("flex", s.buttons)}>
                                        <ContactsSlider close={toggle} visible={value} company={company} users={users}/>
                                        <Button className="mt-[32px]" onClick={handleClickContactButton}>
                                            Контакты и реквизиты
                                        </Button>
                                        <Button
                                            className={classNames("w-[240px] mt-[32px]", s.buttons_toFavarite)}
                                            onClick={handleOnClickInFavorite}
                                            mode="notFilled"
                                            iconLeft={<StarImg width={20}
                                                               style={{fill: `${company.isFavorite ? '' : 'none'}`}}/>}
                                        >
                                            {company.isFavorite ? 'Вы подписанны' : 'В избранное'}
                                        </Button>
                                    </div>
                                    <p className="mt-[24px] break-all">{company.description}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-[20px] mt-[20px]">
                    <p
                        onClick={() => setMode('applications')}
                        className={classNames(
                            'text-sm font-medium cursor-pointer pb-[2px] border-b-2',
                            mode === 'comments' ? 'text-grey-40 border-b-white' : 'text-primaryGreen-main border-b-primaryGreen-main'
                        )}
                    >
                        Заявки компании
                        (
                        {applicationsCount}
                        )

                    </p>
                    <p
                        onClick={() => setMode('comments')}
                        className={classNames(
                            'text-sm font-medium cursor-pointer pb-[2px] border-b-2 ',
                            mode === 'applications' ? 'text-grey-40 border-b-white' : 'text-primaryGreen-main border-b-primaryGreen-main'
                        )}
                    >
                        Отзывы
                        (
                        {company?.reviewsCount}
                        )
                    </p>
                </div>

                {mode === 'applications'
                    && (
                        <>
                            <div className={s.card_view_block}>
                                {applications.map((rec) => (
                                    <div key={rec.id} className={classNames('cursor-pointer', s.card_view_card)}
                                         onClick={() => router.push(`/applications/${rec.id}`)}>
                                        <div className="w-full aspect-[4/3]">
                                            <img
                                                className="rounded-[10px] w-full h-full object-cover"
                                                src={
                                                    rec.images[0] ? rec.images[0].image
                                                        : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                                                }
                                                alt=""
                                            />
                                        </div>
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
                            <Pagination pagination={applicationsPagination}/>

                        </>
                    )}

                {mode === 'comments' && (
                    <div className="mt-[20px] border-b border-b-grey-20 pb-[20px] flex flex-col gap-[20px]">
                        {company?.reviews.map((review) => (
                            <div>
                                <div className='flex items-center gap-[10px]'>
                                    <Avatar className="shrink-0" size="sm"
                                            url={review.createdBy.company?.image ? `${process.env.NEXT_PUBLIC_API_URL}${review.createdBy.company?.image}` : null}/>
                                    <h4 className="font-semibold text-xl">{review.createdBy.company.name ||
                                        `${review.createdBy.last_name} ${review.createdBy.first_name}`}</h4>
                                </div>
                                <p className="mt-[20px] text-sm">
                                    {review.comment}
                                </p>
                                <div className="flex items-center justify-between">

                                    <Rating className="mt-[20px]" showOnlyStars={true} rating={review.rate} total={5}/>
                                    <p className="text-sm text-grey-30">
                                        {Intl.DateTimeFormat('ru-RU').format(new Date(review.createdAt))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </AppShell>
    );
};