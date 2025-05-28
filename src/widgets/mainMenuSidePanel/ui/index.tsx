import {Button} from "@box/shared/ui";
import React, {useState} from "react";
import {DeliveryCalculatorVertical} from "@box/features";
import {useRouter} from "next/router";
import s from './style.module.scss'
import {useScreenSize} from "@box/shared/hooks";

interface IMainMenuSidePanel {
    onChangeShowForm: (value: any) => void;
    onChangeShowCompanies: (value: any) => void;
    onChangeShowApplications: (value: any) => void;
}


export const MainMenuSidePanel: React.FC<IMainMenuSidePanel> = ({
                                                                    onChangeShowForm,
                                                                    onChangeShowCompanies,
                                                                    onChangeShowApplications,
                                                                }) => {
    const [show, setShow] = React.useState(false);
    const router = useRouter();
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showCompanies, setShowCompanies] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const onChangeShowFormHandler = () => {
        setShow(!show)
        onChangeShowForm(show)
    };

    const onChangeShowApplicationsHandler = () => {
        setShowCategories(!showCategories)
        onChangeShowApplications(showCategories)

    };

    const onChangeShowCompaniesHandler = () => {
        setShowCompanies(!showCompanies)
        onChangeShowCompanies(showCompanies)
    };

    if (isMobile) {
        return (
            <div className='w-full mt-7'>
                <div
                    onClick={() => onChangeShowFormHandler()}
                    className={s.rightSideDivMenuForMainPage}>
                    <div className='inline-flex'>
                        <div className='w-6 h-6'>
                            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/create-new.png"
                                 alt="create-new"/>
                        </div>
                        <p className={s.rightSideTitleMenuForMainPage}>Создать новое объявление</p>
                    </div>
                </div>
                <div
                    onClick={() => onChangeShowApplicationsHandler()}
                    className={s.rightSideDivMenuForMainPage}>
                    <div className='inline-flex'>
                        <div className='w-6 h-6'>
                            <img width="50" height="50"
                                 src="https://img.icons8.com/external-prettycons-solid-prettycons/60/external-billboard-multimedia-prettycons-solid-prettycons.png"
                                 alt="external-billboard-multimedia-prettycons-solid-prettycons"/>
                        </div>
                        <p className={s.rightSideTitleMenuForMainPage}>Фильтрация объявлений</p>
                    </div>
                </div>
                <div
                    onClick={() => onChangeShowCompaniesHandler()}
                    className={s.rightSideDivMenuForMainPage}>
                    <div>
                        <div className='inline-flex'>
                            <div className='w-6 h-6'>
                                <img width="50" height="50"
                                     src="https://img.icons8.com/ios-filled/50/client-company.png"
                                     alt="client-company"/>
                            </div>
                            <p className={s.rightSideTitleMenuForMainPage}>Фильтрация компаний</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='ml-10 w-60'>
            <div
                onClick={() => onChangeShowFormHandler()}
                className={s.rightSideDivMenuForMainPage}>
                <div className='inline-flex'>
                    <div className='w-6 h-6'>
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/create-new.png"
                             alt="create-new"/>
                    </div>
                    <p className={s.rightSideTitleMenuForMainPage}>Создать новое объявление</p>
                </div>
                <p className={s.rightSideTextMenuForMainPage}>
                    Можно создать объявление по вторсырью и по оборудованию.
                    При создании объявления "Контракт на поставку" объявление
                    сразу попадает на главную страницу.
                </p>
            </div>
            <div
                onClick={() => onChangeShowApplicationsHandler()}
                className={s.rightSideDivMenuForMainPage}>
                <div className='inline-flex'>
                    <div className='w-6 h-6'>
                        <img width="50" height="50"
                             src="https://img.icons8.com/external-prettycons-solid-prettycons/60/external-billboard-multimedia-prettycons-solid-prettycons.png"
                             alt="external-billboard-multimedia-prettycons-solid-prettycons"/>
                    </div>
                    <p className={s.rightSideTitleMenuForMainPage}>Фильтрация объявлений</p>
                </div>
                <p className={s.rightSideTextMenuForMainPage}>
                    Фильтрация объявлений по сырью и оборудованию. Можно задать первичные фильтры,
                    получить первичную статистику по фракциям сырья и перейти с заданными
                    фильтрами к выбранной фракции для дальнейшей более тонкой фильтрации.
                </p>
            </div>
            <div
                onClick={() => onChangeShowCompaniesHandler()}
                className={s.rightSideDivMenuForMainPage}>
                <div>
                    <div className='inline-flex'>
                        <div className='w-6 h-6'>
                            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/client-company.png"
                                 alt="client-company"/>
                        </div>

                        <p className={s.rightSideTitleMenuForMainPage}>Фильтрация компаний</p>
                    </div>
                    <p className={s.rightSideTextMenuForMainPage}>
                        Фильтрация компаний по первичным фильтрам и перейти с заданными
                        фильтрами к компаниям работающим по выбранной фракции для дальнейшей
                        более тонкой фильтрации.
                    </p>

                </div>
            </div>
            <DeliveryCalculatorVertical/>
            <div className="m-10">
                <Button
                    fullWidth={true}
                    onClick={() => router.push('/profile/favorites')}>
                    Избранное
                </Button>
            </div>
        </div>
    )
}