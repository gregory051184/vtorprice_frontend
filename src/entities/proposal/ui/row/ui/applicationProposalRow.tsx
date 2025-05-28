import {Badge} from "@mantine/core";
import {Button, Rating} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/widgets/applications/applicationsListForMainPage/ui/style.module.scss";
import StarImg from "@box/shared/ui/starImg";
import React from "react";
import {useScreenSize} from "@box/shared/hooks";
import {useRouter} from "next/router";
import {ProposalRecyclableApplicationRowType} from "@box/entities/proposal";
import {useEvent, useStore, useUnit} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {
    applicationModel,
} from '@box/entities/application';
import {notAuthAlertModel} from '@box/entities/notAuthAlert/model';

export const ApplicationProposalRow: React.FC<ProposalRecyclableApplicationRowType> = ({
                                                                                           application
                                                                                       }) => {
    const router = useRouter();
    const company = useStore($authStore);
    const [screenSize, satisfies] = useScreenSize();

    const toggleIsFavorite = useUnit(applicationModel.updateIsFavoriteApplicationFx);
    const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    const handleOnClickInFavorite = (application: applicationModel.IRecyclableApplication) => {
        if (application) {
            toggleIsFavorite(application.id);
        }
        openModalNotAuth();
    };

    return (
        <div className={!isMobile ? "inline-flex mt-7" : "mt-7"}>
            <div>
                <div className="inline-flex">
                    <div
                        onClick={() => router.push(`/applications/${application.id}`)}>
                        <Badge
                            color={application.dealType.id === 2 ? "red" : "green"}
                            className="my-[10px] text-[13px]">
                            {application.dealType.id === 2 ?
                                `Продажа ${(application.totalWeight
                                    ? application.totalWeight
                                    : application.fullWeigth / 1000).toFixed(1)} т` :
                                `Покупка ${(application.totalWeight
                                    ? application.totalWeight
                                    : application.fullWeigth / 1000).toFixed(1)} т`
                            }
                        </Badge>
                    </div>
                    <div>
                        {application?.company?.id !== company.user?.company?.id ?
                            <div>
                                <Button
                                    className={classNames("shrink-0", s.favorite)}
                                    onClick={() => handleOnClickInFavorite(application)}
                                    mode="notFilled"
                                    iconLeft={<StarImg width={20}
                                                       style={{fill: `${application.isFavorite ? '' : 'none'}`}}/>}
                                >
                                </Button>
                            </div> :
                            <div>
                                <p className="text-red-dark mt-[8px] w-auto whitespace-nowrap">{"Ваша заявка"}</p>
                            </div>
                        }
                    </div>
                </div>
                <div onClick={() => router.push(`/applications/${application.id}`)}>
                    <img
                        className={!isMobile ? "rounded-[10px] w-[350px] h-[250px] object-cover cursor-pointer" :
                            "rounded-[10px] w-full h-[250px] object-cover cursor-pointer"
                        }
                        src={
                            application.images[0] ? "http://localhost:8000" + application.images[0].image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />
                </div>
            </div>
            <div
                className={!isMobile ? "ml-[80px] mt-[80px] cursor-pointer w-1/3" : "mt-5 w-full"}
                onClick={() => router.push(`/applications/${application.id}`)}>
                <h4 className="text-base font-medium">{application.recyclables.name}</h4>
                <p className="text-primaryGreen-main font-semibold mt-[10px]">
                    {application.price * 1000}
                    {' '}
                    ₽ / т
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {application.totalPrice}
                    {' '}
                    ₽ за
                    {' '}
                    {(application.totalWeight / 1000).toFixed(1)}
                    {' '}
                    т
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {application.address}
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
                <p className="text-xs mt-[6px]">
                    <Rating
                        className="ml-2"
                        rating={application.company.averageReviewRate}
                        total={application.company.dealsCount || 0}
                    />
                </p>
            </div>

        </div>
    )
}