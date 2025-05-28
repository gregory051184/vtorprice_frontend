import React, {useEffect, useState} from "react";
import {AppCardForFullListForMainPageType} from "@box/entities/application/ui/lists";
import {useEvent, useGate, useStore, useUnit} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import {
    applicationModel
} from '@box/entities/application';
import {notAuthAlertModel} from '@box/entities/notAuthAlert/model';
import {Badge, Button} from "@box/shared/ui";
import StarImg from "@box/shared/ui/starImg";
import {$getFavoritesApplicationFx, gate} from "@box/widgets/applications/applicationsFavoritesList/model";

export const AppCardForShortListForMainPage: React.FC<AppCardForFullListForMainPageType> = ({
                                                                                                application
                                                                                            }) => {
    const company = useStore($authStore);
    const router = useRouter();
    const applications = useStore($getFavoritesApplicationFx);
    const toggleIsFavorite = useUnit(applicationModel.updateIsFavoriteApplicationFx);

    const [favoriteApplication, setFavoriteApplication] = useState<number>(0);


    const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const handleOnClickInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if(favoriteApplication === 0) {
            setFavoriteApplication(id)
        }else {
            setFavoriteApplication(0)
        }
        if (event) {
            event.stopPropagation();
        }
        toggleIsFavorite(id);
    };

    useGate(gate);
    useEffect(() => {
    }, [applications, favoriteApplication, application]);
    return (
        <div className={!isMobile ? "inline-flex mt-6" : "mt-6"}>
            <div>
                <tr>
                    <td
                        className="w-48"
                        onClick={() => router.push(`/applications/${application?.id}`)}>
                        <Badge
                            color={application?.dealType?.id === 2 ? "red" : "green"}
                            className="my-[10px] text-[13px]">
                            {application?.dealType?.id === 2 ?
                                `Продажа ${(application?.totalWeight / 1000).toFixed(1)} т` :
                                `Покупка ${(application?.totalWeight / 1000).toFixed(1)} т`
                            }
                        </Badge>
                    </td>

                        {application?.company?.id !== company.user?.company?.id ?
                            <td className="ml-7 w-28">
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
                            </td> :
                            <td className="ml-4 w-48">
                                <p className="text-red-dark mt-[8px] w-auto whitespace-nowrap">{"Ваша заявка"}</p>
                            </td>
                        }

                </tr>
                <div onClick={() => router.push(`/applications/${application?.id}`)}>
                    <img
                        className={!isMobile ? "rounded-[10px] w-[250px] h-[250px] object-cover cursor-pointer" :
                            "rounded-[10px] w-full h-[250px] object-cover cursor-pointer"
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
                className={!isMobile ? "ml-[80px] mt-[80px] cursor-pointer w-1/3" : "mt-5 w-full"}
                onClick={() => router.push(`/applications/${application?.id}`)}>
                <h4 className="text-base font-medium">{application?.recyclables?.name}</h4>
                <p className="text-primaryGreen-main font-semibold mt-[10px]">
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
                    {application?.address}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {`Дата публикации: ${new Date(application?.createdAt).toLocaleDateString()}`}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]"
                    //@ts-ignore
                   style={application?.withNds === true ? {color: 'green'} : {color: 'red'}}>
                    {
                        //@ts-ignore
                        `Налогообложение: ${application?.withNds === true ? 'НДС' : 'Без НДС'}`
                    }</p>
                {/*<p className="text-xs mt-[6px]">
                    <Rating
                        className="ml-2"
                        rating={application?.company?.averageReviewRate}
                        total={application?.company?.dealsCount || 0}
                    />
                </p>*/}
            </div>

        </div>
    )
}