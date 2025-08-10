import {Button, Table} from '@box/shared/ui';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import {IUsersDealRow} from './types';
import {ColorStatus} from "@box/shared/ui/colorStatus";
import {DealStatus} from "@box/entities/deal/model";
import {useStore} from "effector-react";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@types";


export const UsersDealRow: React.FC<IUsersDealRow> = ({
                                                          route,
                                                          id,
                                                          recyclable,
                                                          equipment,
                                                          supplierCompany,
                                                          createdAt,
                                                          applicationPrice,
                                                          price,
                                                          status
                                                      }) => {
    const router = useRouter();
    const auth = useStore($authStore)
    useEffect(() => {
    }, [auth]);
    if (auth.user && auth?.user?.role.id > ROLE.MANAGER) {
        return (
            <Table.Row
                className="cursor-pointer"
                onClick={() => {
                    router.push(`/${route}/${id}`);
                }}
            >
                <Table.Cell className="max-w-[110px]">
                    <p>{recyclable || equipment}</p>
                </Table.Cell>
                <Table.Cell className="max-w-[200px]">
                    <p>{supplierCompany}</p>
                </Table.Cell>

                <Table.Cell className="max-w-[110px] pr-[20px]">
                    <p>
                        {new Intl.DateTimeFormat('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour12: false,
                        }).format(new Date(createdAt))}
                        {' '}
                    </p>
                </Table.Cell>
                <Table.Cell>
                    <p>
                        {route === "deals" ? (applicationPrice * 1000) : applicationPrice}
                        {` ₽ / ${route === "deals" ? "т" : "шт"}`}
                    </p>
                    <p className="text-sm text-grey-40">
                        {price}
                        {' '}
                        ₽
                    </p>
                </Table.Cell>
                <Table.Cell>
                        {/* @ts-ignore */}
                        <ColorStatus status={status}/>
                </Table.Cell>
            </Table.Row>
        );
    }
    return (
        <Table.Row>
            <Table.Cell className="max-w-[110px]">
                <p>{recyclable || equipment}</p>
            </Table.Cell>
            <Table.Cell className="max-w-[200px]">
                <p>{supplierCompany}</p>
            </Table.Cell>

            <Table.Cell className="max-w-[110px] pr-[20px]">
                <p>
                    {new Intl.DateTimeFormat('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour12: false,
                    }).format(new Date(createdAt))}
                    {' '}
                </p>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {route === "deals" ? (applicationPrice * 1000) : applicationPrice}
                    {` ₽ / ${route === "deals" ? "т" : "шт"}`}
                </p>
                <p className="text-sm text-grey-40">
                    {price}
                    {' '}
                    ₽
                </p>
            </Table.Cell>
            <Table.Cell>
                    {/* @ts-ignore */}
                    <ColorStatus status={status}/>
            </Table.Cell>
            <Table.Cell>
                {status.id >= DealStatus.LOGIST_ASSIGNMENT &&
                    <Button
                        type="micro"
                        mode="light"
                        onClick={() => router.push(`/profile/logistics/${id}`)}>
                        Логистика
                    </Button>
                }
                <Button
                    className="mt-2"
                    type="micro"
                    mode="light"
                    onClick={() => router.push(`/deals/${id}`)}>
                    Сделка
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};
