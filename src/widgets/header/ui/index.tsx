import React, {useEffect} from 'react';
import classNames from 'classnames';
import Logo from '@assets/icons/logo.svg';
import Link from 'next/link';
import {Container} from '@box/shared/ui';
import {useRouter} from 'next/router';
import Burger from '@assets/icons/menu_burger.svg';
import {useBoolean, useScreenSize} from '@box/shared/hooks';
import {useEvent, useGate, useStore} from 'effector-react';
import {setShowAuthModal} from '@box/widgets/authModal';
import {AuthView} from '@box/hoc';
import {ProfileShortcut} from '@box/entities/user';
import IconUserForAuth from '@assets/icons/24_user.svg'
import s from './style.module.scss';
import {$authStore} from '@box/entities/auth';
import {RunningText} from "@box/shared/ui/running";
import {headersMain} from "@box/widgets/header/lib";
import {SpecialApplications} from "@box/pages/special-applications";
import {$specialApplications, specialApplicationsGate} from "@box/entities/special-application";
import {$notificationsUnreadCount, mainNotificationsEvent} from "@box/widgets/notifications/notificationList/model";


export const Header = () => {
    const router = useRouter();
    const specialApplications = useStore($specialApplications);

    const n_notifications = useStore($notificationsUnreadCount);
    const updateNotificaionsCount = useEvent(mainNotificationsEvent);

    const {value: menuOpened, toggle: toggleMenu} = useBoolean(false);
    const setShowAuthForm = useEvent(setShowAuthModal);
    const authStore = useStore($authStore);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    useEffect(() => {
        if (menuOpened) {
            document.body.style.height = 'calc(var(--vh, 1vh) * 100)';
            document.body.style.overflowY = 'hidden';
            return;
        }
        document.body.style.height = 'auto';
        document.body.style.overflowY = 'auto';
    }, [menuOpened, specialApplications]);

    // Управление интервалом для обновления счетчика уведомлений.
    useEffect(() => {
        updateNotificaionsCount()
        const interval = setInterval(
            () => {
                updateNotificaionsCount()
            }, 30000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    useGate(specialApplicationsGate);
    return (
        <div
            className={classNames((specialApplications.length > 0 && router.asPath != '/') ? 'border-b border-b-grey-20 backdrop-blur mb-[310px]' :
                'border-b border-b-grey-20 backdrop-blur mb-[50px]', s.header)}> {/*убрал из стилей opacity-95*/}
            <Container className="flex h-full justify-between items-center">
                <div className="flex gap-10 items-center">
                    <Link href="/">
                        <Logo/>
                    </Link>
                    <div className={classNames('flex gap-5', s.header_links)}>
                        {headersMain(isMobile).map((link) => (
                            <div key={link.id} className="">
                                <Link href={link.href}>
                                    <p className={classNames('text-sm font-medium', {'text-grey-40': router.asPath === link.href})}>{link.title}</p>
                                </Link>
                            </div>
                        ))}

                    </div>
                </div>

                <div className={classNames('flex items-center gap-6')}>
                    <AuthView
                        unauthorizedComponent={<p onClick={() => setShowAuthForm(true)}
                                                  className="text-base text-primaryGreen-main font-bold hover:text-primaryGreen-light cursor-pointer">
                            {satisfies("xsm") ? "Авторизация" : <IconUserForAuth/>}</p>}
                        authorizedComponent={<ProfileShortcut/>}
                    />
                    {
                        //@ts-ignore
                        n_notifications > 0 &&
                        <div
                            onClick={() => router.push('/profile/notifications')}
                            className='bg-[#FF2C52] rounded-full text-[#FFFFFF] text-xs cursor-pointer'>
                            <p className={`my-[0px] mx-[6px] rounded-full text-xs ${s.notification_text_color}`}>
                                {n_notifications === 0 ? "0" : n_notifications}
                            </p>
                        </div>}

                    <div onClick={toggleMenu} className={classNames(s.burger)}>
                        <Burger/>
                    </div>
                </div>
            </Container>
            <div
                style={{
                    backgroundColor: 'rgba(67, 158, 126, 1)',
                    width: '100%',
                    height: '36px',
                    zIndex: 9
                }}>
                <RunningText/>
            </div>
            {(specialApplications.length > 0 && router.asPath != '/') && <div
                className={s.offer_slider}>
                <SpecialApplications specialApplications={specialApplications}></SpecialApplications>
            </div>}
            <div className={classNames(s.menu, {[s.menu_opened]: menuOpened})}>
                <Container className={s.menu_container}>
                    {!authStore.isAuth && <p onClick={() => setShowAuthForm(true)}
                                             className="text-base mb-[40px] text-primaryGreen-main font-bold hover:text-primaryGreen-light cursor-pointer">
                        {"Авторизация"}</p>}
                    {headersMain(isMobile).map((link) => (
                        <Link key={link.id} className="mt-[24px] block" href={link.href}>
                            <p className={classNames('text-lg font-light', {'text-grey-40': router.asPath === link.href})}>{link.title}</p>
                        </Link>
                    ))}
                </Container>
            </div>
        </div>
    );
};
