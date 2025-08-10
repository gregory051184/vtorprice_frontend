import React, {useEffect, useState} from 'react';
import {Button, ISelectValue, Select, Table} from '@box/shared/ui';
import {Avatar} from '@box/entities/user';
import {useRouter} from 'next/router';
import {ICompanyChangeStatusRow} from "./types";
import {BuyOrSellDeals, CompanyStatus} from "@box/entities/deal/model";
import {ROLE} from "@types";
import {companyStatusField, patchCompanyStatusFX} from "@box/features/company-management/company_info";
import {companyStatusSelectForChangeValues} from "@box/entities/company";
import {useField} from "@box/shared/effector-form-controller/hooks";
import {useUnit} from "effector-react";
import {IStatus} from "@box/entities/logistics/model";
import {ICompany} from "@box/entities/company/model";
import InfoIcon from '@assets/icons/16_info.svg'


interface ICompanyRecyclableInfo {
    lastDate: Date,
    timeIsOver: boolean,
    recyclable: string,
    deal_type: string,
}

export const CompanyChangeStatusRow: React.FC<ICompanyChangeStatusRow> = ({
                                                                              company,
                                                                              user
                                                                          }) => {
        const router = useRouter();
        const [currentCompany, setCurrentCompany] = useState<number>(0);
        const [currentCompanyContracts, setCurrentCompanyContracts] = useState<number>(0);
        const [currentStatus, setCurrentStatus] = useState<IStatus>({id: company.status.id, label: company.status.label})
        const statusField = useField(companyStatusField)
        const update = useUnit(patchCompanyStatusFX)

        const updateCompanyStatus = (companyId: number, status: string) => {
            update({
                    id: companyId,
                    status: status
                }
            );
            setCurrentCompany(0);
        };

        const currentCompanyHandler = (companyId: number) => {
            setCurrentCompany(companyId);
        };

        const updateHandler = (event: ISelectValue<number> | null) => {
            statusField.onChange(event)
            //@ts-ignore
            setCurrentStatus({id: event?.value, label: event?.label})
            //@ts-ignore
            updateCompanyStatus(company.id, `${event.value}`)
        };

        const daysBetween = (startDate: Date, endDate: Date) => {
            const diffTime = Math.abs(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
                Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
        };

        const companyRecyclableInfo = (company: ICompany): ICompanyRecyclableInfo[] => {
            const recyclables = company.recyclables
            const list = []
            for (let rec = 0; rec < recyclables.length; rec++) {
                list.push({
                    lastDate: recyclables[rec].createdAt,
                    timeIsOver: daysBetween(new Date(recyclables[rec].createdAt), new Date()) >= 29,
                    recyclable: recyclables[rec].recyclables.name,
                    deal_type: +recyclables[rec].action === +BuyOrSellDeals.BUY ? 'покупка' : 'продажа',
                })
            }
            return list
        };

        useEffect(() => {
        }, [currentCompany, company, currentStatus]);
        return (
            <Table.Row
                className="border"
            >
                <Table.Cell
                    onClick={() => {
                        router.push(`/profile/my-company/${company.id}`);
                    }}
                    className="pr-8 max-w-[300px] cursor-pointer">
                    <div className="flex items-center gap-6">

                        <Avatar className="shrink-0" size="sm" url={company?.image || null}/>
                        <p className={(companyRecyclableInfo(company)
                            .filter(item => item.timeIsOver).length > 0 || companyRecyclableInfo(company).length === 0) ?
                            "text-red-dark" : ""}>
                            {company.name}
                            {' '}
                        </p>
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <p>
                        {new Intl.DateTimeFormat('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: false,
                        }).format(new Date(company.createdAt))}
                        {' '}
                    </p>
                </Table.Cell>
                {currentCompany === 0 &&
                    <Table.Cell
                        onClick={() => currentCompanyHandler(company.id)}
                        className={currentStatus.id === CompanyStatus.NEW
                            ? "text-red-dark w-[180px] cursor-pointer" :
                            currentStatus.id === CompanyStatus.DECLINE ?
                                "text-orange-dark w-[180px] cursor-pointer" :
                                currentStatus.id === CompanyStatus.RELIABLE ?
                                    "w-[180px] text-blue-2x-dark cursor-pointer" :
                                    currentStatus.id === CompanyStatus.FOR_DELETE ?
                                        "w-[180px] text-violet-dark cursor-pointer"
                                        : "w-[180px] text-green-dark cursor-pointer"}>
                        <p>{currentStatus.label}</p>
                    </Table.Cell>}
                {(currentCompany > 0 && currentCompany === company.id) &&
                    < Table.Cell className="w-[180px]">
                        <div>
                            <Select
                                value={statusField.store.$value}
                                onSelect={updateHandler}
                                placeholder={currentStatus.label}
                                data={companyStatusSelectForChangeValues}></Select>
                        </div>
                    </Table.Cell>}
                {user.role.id < ROLE.MANAGER &&
                    < Table.Cell className="w-[150px]">
                        <p>{company?.manager ? company?.manager?.lastName : 'Не назначен'}</p>
                    </Table.Cell>}
                < Table.Cell
                    onClick={() => setCurrentCompanyContracts(currentCompanyContracts === 0 ? company.id : 0)}
                    className="w-[100px] cursor-pointer">
                    {currentCompanyContracts != company.id ?
                        <div className='inline-flex'>
                            <p className={companyRecyclableInfo(company).length > 0 ?
                                "" : "text-red-dark"}>
                                {companyRecyclableInfo(company).length > 0 ? company?.recyclables?.length : 'Нет'}
                            </p>
                            /
                            <p className={companyRecyclableInfo(company).filter(item => item.timeIsOver).length > 0 ?
                                "text-red-dark" : "text-green-dark"}>
                                {companyRecyclableInfo(company).length > 0 && companyRecyclableInfo(company).filter(item => item.timeIsOver).length}
                            </p>
                        </div> :
                        <div className='w-[300px] p-3 z-20 rounded-[5px] bg-grey-20 absolute'>
                            {companyRecyclableInfo(company).filter(item => item.timeIsOver).length > 0 ?
                                companyRecyclableInfo(company).filter(item => item.timeIsOver).map(item => (
                                    <p className="mt-4">
                                        {`${item.recyclable} ${item.deal_type}`}
                                    </p>
                                )) :
                                'Просроченные отсутствуют'
                            }
                        </div>
                    }
                </Table.Cell>
                <Table.Cell>
                    <Button
                        type="micro"
                        mode="fill"
                        onClick={() => router.push(`/companies/${company.id}`)}>
                        <InfoIcon/>
                    </Button>
                </Table.Cell>
            </Table.Row>

        )
            ;
    }
;
