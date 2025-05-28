import React, {useEffect, useState} from 'react';
import {Checkbox} from '@box/shared/ui';
import classNames from 'classnames';
import Link from 'next/link';
import {IEquipmentApplicationCardForEquipmentProposal} from './types';
import s from './styles.module.scss';


export const EquipmentApplicationCardForEquipmentProposal: React.FC<IEquipmentApplicationCardForEquipmentProposal> = ({
                                                                                                                          application,
                                                                                                                          className,
                                                                                                                          onChange
                                                                                                                      }) => {

    const [faikChecked, setFaikChecked] = useState(false);
    const onChangeHandler = (applicationId: number) => {
        setFaikChecked(!faikChecked)
        //@ts-ignore
        onChange(applicationId)
    }
    useEffect(() => {
    }, [faikChecked]);

    return (
        <div
            className={s.application_proposal}>
            <div>
                <Link href={`/applications/${application.id}`}
                      className={classNames('p-[16px] bg-grey-10 rounded-[10px] w-full', className)}
                      style={{/*width: '100vw'*/}}>
                    <div className="flex gap-[10px]">
                        <img
                            style={{cursor: 'pointer'}}
                            className="rounded-[10px] w-[150px] h-[150px] object-cover"
                            src={
                                application.images[0] ? application.images[0].image
                                    : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                            }
                            alt=""
                        />
                        <div className="ml-4">
                            <p>{application.equipment.name}</p>
                            <p className="text-xs text-grey-40">Б/У или Новый</p>
                            <p className="text-sm mt-[2px]">{application.wasInUse ? 'Б/У' : 'Новый'}</p>
                            <p className="text-xs text-grey-40">Цена</p>
                            <p className="text-sm mt-[2px]">{application.price}{' '}
                                ₽</p>
                            <p className="text-xs text-grey-40">Дата выпуска</p>
                            <p className="text-sm mt-[2px]">{application.manufactureDate}</p>
                        </div>

                    </div>
                </Link>
                <div>
                    <Checkbox checked={faikChecked} onChange={() => onChangeHandler(application.id)}/>
                </div>
            </div>
        </div>
    );
}