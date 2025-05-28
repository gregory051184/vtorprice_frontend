import React, {useEffect} from 'react';
import {Button, Rating} from '@box/shared/ui';
import classNames from 'classnames';
import {IEquipCard} from './types';
import {useRouter} from "next/router";
import s from "@box/widgets/applications/applicationsListForMainPage/ui/style.module.scss";
import StarImg from "@box/shared/ui/starImg";
import {useEvent, useStore, useUnit} from "effector-react";
import {
    applicationModel,
} from '@box/entities/application';
import {notAuthAlertModel} from '@box/entities/notAuthAlert/model';
import {$authStore} from "@box/entities/auth";


export const EquipCard: React.FC<IEquipCard> = ({
                                                    equipment,

                                                }) => {
    const company = useStore($authStore);
    const toggleIsFavorite = useUnit(applicationModel.updateIsFavoriteApplicationFx);
    const openModalNotAuth = useEvent(notAuthAlertModel.openModalNotAuthEvent);
    const handleOnClickInFavorite = (equipment: applicationModel.IEquipmentApplication) => {
        if (equipment) {
            toggleIsFavorite(equipment.id);
        }
        openModalNotAuth();
    };
    const router = useRouter();
    useEffect(() => {
    }, [equipment]);
    return (
        <div className="inline-flex mt-6">
            <div>
                <div className="inline-flex">
                    <div>
                        {equipment?.company?.id !== company.user?.company?.id ?
                            <div>
                                <Button
                                    className={classNames("shrink-0", s.favorite)}
                                    onClick={() => handleOnClickInFavorite(equipment)}
                                    mode="notFilled"
                                    iconLeft={<StarImg width={20}
                                                       style={{fill: `${equipment?.isFavorite ? '' : 'none'}`}}/>}
                                >
                                </Button>
                            </div> :
                            <div>
                                <p className="text-red-dark mt-[8px] w-auto whitespace-nowrap">{"Ваша заявка"}</p>
                            </div>
                        }
                    </div>
                </div>
                <div onClick={() => router.push(`/applications/${equipment.id}`)}>
                    <img
                        className="rounded-[10px] w-[250px] h-[250px] object-cover cursor-pointer"
                        src={
                            equipment?.images[0] ? equipment?.images[0].image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />
                </div>
            </div>
            <div
                className="cursor-pointer ml-20 mt-20"
                onClick={() => router.push(`/applications/${equipment.id}`)}>
                <div className="inline-flex">
                    <h4 className="text-base font-medium">{equipment?.equipment.name}</h4>
                    <p className={s.was_in_use}>
                        {equipment?.wasInUse ? "Б/У" : "Новое"}
                    </p>
                </div>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {equipment.price}
                    {' '}
                    ₽
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {`Дата выпуска: ${(equipment?.manufactureDate.split('-').reverse().join('.'))}`}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {equipment?.address}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {`Дата публикации: ${new Date(equipment?.createdAt).toLocaleDateString()}`}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]"
                    //@ts-ignore
                   style={equipment?.withNds === true ? {color: 'green'} : {color: 'red'}}>
                    {
                        //@ts-ignore
                        `Налогообложение: ${equipment?.withNds === true ? 'НДС' : 'Без НДС'}`
                    }</p>
                <p className="text-xs mt-[6px]">
                    <Rating
                        className="ml-2"
                        rating={equipment?.company.averageReviewRate}
                        total={equipment?.company.dealsCount || 0}
                    />
                </p>
            </div>

        </div>
    )
}


