import React from 'react';
import {Table, TextClamp} from '@box/shared/ui';
import {Avatar} from '@box/entities/user';
import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import {useRouter} from 'next/router';

import {ICompanyOfferRow} from "@box/entities/company/ui/rows/companyRow/types";


export const CompanyFavoritesRow: React.FC<ICompanyOfferRow> = ({
                                                                    company,
                                                                    favoriteButton,
                                                                }) => {
    const router = useRouter();
    return (
        <Table.Row
            className="cursor-pointer"
            onClick={() => {
                router.push(`/companies/${company.id}`);
            }}
        >
            <Table.Cell>
                <div className="flex items-center gap-6">
                    <Avatar className="shrink-0" size="sm" url={company?.image || null}/>
                    <p>
                        {company.name}
                        {company.status?.id === 2 && <Verified className="inline"/>}
                        {company.status?.id === 3 && (
                            <>
                                <Verified className="inline"/>
                                <Reliable className="inline"/>
                            </>
                        )}
                    </p>
                </div>
            </Table.Cell>
            <Table.Cell>{company.activities?.map((item, i) => <p key={i}>{item}</p>)}</Table.Cell>
            <Table.Cell>
                <p>{company.recyclables?.at(0)?.recyclables.name || 'Нет'}</p>
                {company.recyclables?.length > 1 && (
                    <p className="text-sm font-light text-primaryGreen-main underline">
                        И еще
                        {company.recyclablesCount - 1}
                    </p>
                )}

            </Table.Cell>
            <Table.Cell>
                <TextClamp>{company.address}</TextClamp>
            </Table.Cell>
            <Table.Cell>
                {favoriteButton}
            </Table.Cell>
        </Table.Row>
    );
};
