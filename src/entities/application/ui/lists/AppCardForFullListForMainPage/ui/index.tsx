import {Badge} from "@mantine/core";
import s from "@box/widgets/applications/applicationsListForMainPage/ui/style.module.scss";
import StarImg from "@box/shared/ui/starImg";
import React, {useEffect, useState} from "react";
import {
    AppCardForFullListForMainPageType
} from "@box/entities/application/ui/lists/AppCardForFullListForMainPage/types/types";
import {useGate, useStore, useUnit} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import {
    applicationModel
} from '@box/entities/application';
import {Button} from "@box/shared/ui";
import {$getFavoritesApplicationFx, gate} from "@box/widgets/applications/applicationsFavoritesList/model";


export const AppCardForMainPage: React.FC<AppCardForFullListForMainPageType> = ({
                                                                                    application,
                                                                                }) => {
    const company = useStore($authStore);
    const router = useRouter();
    const applications = useStore($getFavoritesApplicationFx);
    const toggleIsFavorite = useUnit(applicationModel.updateIsFavoriteApplicationFx);

    const [favoriteApplication, setFavoriteApplication] = useState<number>(0);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const handleOnClickInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (favoriteApplication === 0) {
            setFavoriteApplication(id)
        } else {
            setFavoriteApplication(0)
        }
        if (event) {
            event.stopPropagation();
        }
        toggleIsFavorite(id);
    };

    useGate(gate);
    useEffect(() => {
    }, [application, applications, favoriteApplication]);

    return (
        <div className={"mt-3 w-[260px] ml-5"}>
            <div>
                <div className="inline-flex">
                    <div>
                        <Badge
                            color={application?.dealType?.id === 2 ? "red" : "green"}
                            className="my-[10px] text-[13px]">
                            {application?.dealType.id === 2 ?
                                `Продажа ${(application?.totalWeight / 1000).toFixed(1)} т` :
                                `Покупка ${(application?.totalWeight / 1000).toFixed(1)} т`
                            }
                        </Badge>
                    </div>
                    <div>
                        {application?.company?.id === company.user?.company?.id &&
                            <div>
                                <p className="text-red-dark mt-[8px] w-auto whitespace-nowrap">{"Ваша заявка"}</p>
                            </div>
                        }
                    </div>
                </div>
                <div>
                    <img
                        onClick={() => router.push(`/applications/${application?.id}`)}
                        className={!isMobile ? "rounded-[4px] w-[250px] h-[250px] object-cover cursor-pointer" :
                            "rounded-[4px] w-full h-[250px] object-cover cursor-pointer"
                        }
                        src={
                            application?.images[0] ? application?.images[0].image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />

                </div>
            </div>
            <div
                className={!isMobile ? "mt-3 inline-flex" : "mt-3 w-full inline-flex"}
            >
                <tbody>
                <tr>
                    <td className="w-56">
                        <h4
                            onClick={() => router.push(`/applications/${application?.id}`)}
                            className={s.application_title}>
                            {application?.recyclables?.name}
                        </h4>

                        <p className="text-primaryGreen-main font-semibold mt-1">
                            {application?.price * 1000}
                            {' '}
                            ₽ / т
                        </p>
                        <p className="text-xs text-grey-40 mt-[6px]">
                            {application?.totalPrice}
                            {' '}
                            ₽ за
                            {' '}
                            {(application?.totalWeight / 1000).toFixed(1)}
                            {' '}
                            т
                        </p>
                        <p className="text-xs text-grey-40 mt-[6px]">
                            {application?.company?.city?.name}
                        </p>
                    </td>
                    <td className="ml-5 w-16">
                        <Button
                            type='micro'
                            onClick={(event) => handleOnClickInFavorite(application?.id, event)}
                            mode="notFilled"
                            iconLeft={<StarImg width={20}
                                               style={/*{fill: `${application?.isFavorite ? '' : 'none'}`}*/ {
                                                   fill: `${favoriteApplication === application.id ||
                                                   applications.map(app => app.id).includes(application.id) ? '' : 'none'}`
                                               }}/>}
                        >
                        </Button>
                    </td>
                    {/*<div className='mt-3 ml-28 cursor-pointer'>
                    {
                        <Button
                            className={classNames("shrink-0", s.favorite)}
                            onClick={(event) => handleOnClickInFavorite(application?.id, event)}
                            mode="notFilled"
                            iconLeft={<StarImg width={20}
                                               style={{fill: `${application?.isFavorite ? '' : 'none'}`}}/>}
                        >
                        </Button>
                    }
                </div>*/}
                </tr>
                </tbody>
            </div>
        </div>
    )
}
