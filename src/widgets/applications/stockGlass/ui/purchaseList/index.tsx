import React from 'react';
import {IWithClass} from '@types';
import {useGate, useStore} from 'effector-react';
import {StockGlassApplicationListTemplate} from '../template';
import {purchase} from '../../model';
import s from './style.module.scss';
import {Card} from '../card';
import Empty from "@assets/icons/32_empty.svg";
import classNames from "classnames";
import {Pagination, Tip} from "@box/shared/ui";
import {useLastSaleInfo} from "@box/widgets/applications/stockGlass/hooks";

export const StockGlassPurchaseList: React.FC<IWithClass & { show?: boolean }> = ({
                                                                                      className,
                                                                                      show
                                                                                  }) => {
    const applications = useStore(purchase.store);
    const sortedApplications = applications.result
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() );
    //const lastSaleInfo = useLastSaleInfo(applications.result[0], applications.result[1]);
    const lastSaleInfo = useLastSaleInfo(sortedApplications[sortedApplications.length - 1], sortedApplications[0]);
    useGate(purchase.list.gate);
    return (
        <div className={className}>
            <StockGlassApplicationListTemplate
                title="Покупка"
                applications={applications.result}
                pagination={purchase.list.pagination}
                className={s.block}
            />

            {
                show && <div className={s.mobile_block}>
                    {!!applications.result.length ?
                        applications.result.map(s => <Card key={s.id} application={s} priceColor="green"/>) :
                        <div className="flex justify-center my-[80px]">
                            <div className="flex flex-col items-center">
                                <Empty/>
                                <p className="mt-[20px] text-grey-50 text-sm">По вашему фильтру ничего не найдено</p>
                            </div>
                            <Pagination pagination={purchase.list.pagination}/>
                        </div>
                    }

                </div>
            }
            {lastSaleInfo && (
                    <div className="mt-[30px] flex justify-end items-center gap-[20px]">
                        <p className="text-grey-40">Цена последней продажи</p>
                        <p className={classNames(lastSaleInfo.direction === 'grow' ? 'text-primaryGreen-main' : 'text-red-dark', 'text-xl font-medium')}>
                            {lastSaleInfo?.percentage.toFixed(2)}
                            %
                        </p>
                        <p className="text-2xl">
                            {lastSaleInfo.price}
                            {' '}
                            ₽
                        </p>
                    </div>
                )
            }
        </div>
    );
};
