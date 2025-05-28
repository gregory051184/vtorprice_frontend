import React, {useEffect, useState} from 'react';
import {Checkbox} from '@box/shared/ui';
import classNames from 'classnames';
import Link from 'next/link';
import {IApplicationCardForProposal} from './types';
import s from './styles.module.scss';
import {useScreenSize} from "@box/shared/hooks";


export const ApplicationCardForProposal: React.FC<IApplicationCardForProposal> = ({
                                                                                      application,
                                                                                      className,
                                                                                      onChange
                                                                                  }) => {
    const [faikChecked, setFaikChecked] = useState(false);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

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
                      className={classNames('p-[16px] bg-grey-10 rounded-[10px] w-full', className)} >
                    <div className="flex gap-[10px]">

                        <img
                            className="rounded-[10px] w-[150px] h-[150px] object-cover cursor-pointer"
                            src={
                                application.images[0] ? application.images[0].image
                                    : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                            }
                            alt=""
                        />
                        <div className="ml-4">
                            <p>{application.recyclables.name}</p>
                            <p className="text-xs text-grey-40">Вес, т</p><p
                            className="text-sm mt-[2px]">{(application.totalWeight / 1000).toFixed(1)}</p>
                            <p className="text-xs text-grey-40">Цена за 1 т</p><p
                            className="text-sm mt-[2px]">{application.price * 1000}</p>
                            <p className="text-xs text-grey-40">Стоимость</p><p className="text-sm mt-[2px]">
                            {application.totalPrice}
                            {' '}
                            ₽</p>
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