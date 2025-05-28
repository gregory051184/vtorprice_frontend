import React from 'react';
import {useRouter} from 'next/router';

import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';

import {Table, TextClamp} from '@box/shared/ui';
import {Avatar} from '@box/entities/user';

import {IApplicationsFavoriteRow} from './types';

export const ApplicationFavoriteRow: React.FC<IApplicationsFavoriteRow> = ({
                                                                               application,
                                                                               favoriteButton
                                                                           }) => {
    const router = useRouter();
    return (
        <Table.Row
            className="cursor-pointer"
            onClick={() => {
                router.push(`/applications/${application.id}`);
            }}
        >
            <Table.Cell className="pr-4 w-[200px]">
                <div className="flex items-center  gap-6">
                    <Avatar className="shrink-0" size="sm" url={application?.company.image || null}/>
                    <p>
                        {application.company.name}
                        {application.company.status?.id === 2 && <Verified className="inline"/>}
                        {application.company.status?.id === 3 && (
                            <>
                                <Verified className="inline"/>
                                <Reliable className="inline"/>
                            </>
                        )}
                    </p>
                </div>
            </Table.Cell>
            <Table.Cell className="max-w-[110px] pr-[20px]">
                <p>{application.recyclables.name}</p>
            </Table.Cell>
            <Table.Cell className="pr-[20px]">
                <p className="whitespace-nowrap">
                    {application.price * 1000}
                    {' '}
                    ₽ / т
                </p>
                <p className="text-xs text-grey-40 whitespace-nowrap">
                    {application.totalPrice}
                    {' '}
                    ₽
                    {' '}
                </p>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {(application.totalWeight / 1000).toFixed(1)}
                    {' '}
                    т
                </p>
            </Table.Cell>
            <Table.Cell>
                <TextClamp>
                    {application.address}
                </TextClamp>
            </Table.Cell>
            <Table.Cell>
                {favoriteButton}
            </Table.Cell>
        </Table.Row>

    );
};
