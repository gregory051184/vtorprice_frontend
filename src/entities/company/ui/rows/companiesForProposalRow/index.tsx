import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from '@box/shared/ui';
import {Avatar} from '@box/entities/user';
import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import {useRouter} from 'next/router';

import {ICompanyOfferRow} from "@box/entities/company/ui/rows/companyRow/types";
import {useScreenSize} from "@box/shared/hooks";

export const CompaniesForProposalRow: React.FC<ICompanyOfferRow> = ({
                                                                        company,
                                                                        onChange
                                                                    }) => {
    const router = useRouter();

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
    if (!isMobile) {
        return (
            <Table.Row>
                <div
                    className="cursor-pointer"
                    onClick={() => {
                    router.push(`/companies/${company.id}`);
                }}>
                    <Table.Cell>
                        <div>
                            <Avatar className="shrink-0" size="sm" url={company?.image || null}/>

                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        <div>
                            {company.name}
                            {company.status?.id === 2 && <Verified className="inline"/>}
                            {company.status?.id === 3 && (
                                <>
                                    <Verified className="inline"/>
                                    <Reliable className="inline"/>
                                </>
                            )}
                        </div>
                    </Table.Cell>
                    {/*<Table.Cell>
                        <div className="ml-3">
                            {company.activities?.map((item, i) => <p key={i}>{item}</p>)}
                        </div>
                    </Table.Cell>*/}
                    <Table.Cell>
                        <div className="w-[6vw]">
                            <p>{company.recyclables?.at(0)?.recyclables.name || 'Нет'}</p>
                            {company.recyclables?.length > 1 && (
                                <p className="text-sm font-light text-primaryGreen-main underline">
                                    И еще
                                    {company.recyclablesCount - 1}
                                </p>
                            )}
                        </div>
                    </Table.Cell>
                </div>
                <Table.Cell className="pr-4">
                    <Checkbox checked={faikChecked} onChange={() => onChangeHandler(company.id)}/>
                </Table.Cell>
            </Table.Row>
        );
    } else {
        return (
            <div
                className="inline-flex"
                onClick={() => {
                router.push(`/companies/${company.id}`);
            }}>
                <div>
                    <Avatar className="shrink-0" size="sm" url={company?.image || null}/>

                </div>
                <div className="ml-3">
                    {company.name}
                    {company.status?.id === 2 && <Verified className="inline"/>}
                    {company.status?.id === 3 && (
                        <>
                            <Verified className="inline"/>
                            <Reliable className="inline"/>
                        </>
                    )}
                </div>
                <div className="ml-3">
                    <p>{company.recyclables?.at(0)?.recyclables.name || 'Нет'}</p>
                    {company.recyclables?.length > 1 && (
                        <p className="text-sm font-light text-primaryGreen-main underline">
                            И еще
                            {company.recyclablesCount - 1}
                        </p>
                    )}
                </div>
                <div className="ml-3">
                    <Checkbox checked={faikChecked} onChange={() => onChangeHandler(company.id)}/>
                </div>
            </div>
        )
    }
};
