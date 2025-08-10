import React, {useEffect, useState} from 'react';
import {Button, ISelectValue, Select, Table} from '@box/shared/ui';
import {useRouter} from 'next/router';
import {IUsersApplicationManagementRow, IUsersEquipmentApplicationManagementRow} from './types';
import s from './style.module.scss';
import {$userApplicationlistTypeManagement} from '@box/pages/profile/applications-managment/list/model/store';
import {useStore, useUnit} from 'effector-react';
import {patchEquipmentApplicationStatusFX, updateApplicationStatusFx} from "@box/entities/application/model";
import {ApplicationStatus, CompanyStatus} from "@box/entities/deal/model";
import {IStatus} from "@box/entities/logistics/model";
import {useForm} from "@box/shared/effector-forms";
import {equipmentForm} from "@box/features/application/forms/create/equipment";
import {applicationStatusSelectValues} from "@box/entities/application";
import InfoIcon from "@assets/icons/16_info.svg";


export const ApplicationManagementRow: React.FC<IUsersApplicationManagementRow> = ({
                                                                                       application,
                                                                                       deleteButton
                                                                                   }) => {
    const router = useRouter();

    const [currentApplication, setCurrentApplication] = useState<number>(0);
    const [currentStatus, setCurrentStatus] = useState<IStatus>({
        id: application.status.id,
        label: application.status.label
    })
    const {fields} = useForm(equipmentForm);
    const update = useUnit(updateApplicationStatusFx)


    const updateApplicationStatus = (applicationId: number, status: string) => {
        update({
                id: applicationId,
                status: +status
            }
        );
        setCurrentApplication(0);
    };

    const updateHandler = (event: ISelectValue<number> | null) => {
        //@ts-ignore
        updateApplicationStatus(application.id, `${event.value}`)
        fields.status.onChange(event)
        //@ts-ignore
        setCurrentStatus({id: event?.value, label: event?.label})
    };

    const currentApplicationHandler = (companyId: number) => {
        setCurrentApplication(companyId);
    };
    useEffect(() => {
        //console.log(currentStatus)
    }, [currentApplication, currentStatus, application]);

    const listType = useStore($userApplicationlistTypeManagement);
    return (
        <Table.Row /*className="cursor-pointer" onClick={() => router.push(`/profile/applications/${application.id}`)}*/>
            <Table.Cell>
                <p>
                    {new Intl.DateTimeFormat('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour12: false,
                    }).format(new Date(application.createdAt))}
                </p>
            </Table.Cell>
            {currentApplication === 0 &&
                <Table.Cell
                    onClick={() => currentApplicationHandler(application.id)}
                    className={currentStatus.id === ApplicationStatus.ON_REVIEW
                        ? "text-orange-dark w-[180px] cursor-pointer" :
                        currentStatus.id === ApplicationStatus.PUBLISHED ?
                            "text-green-dark w-[180px] cursor-pointer" :
                            currentStatus.id === ApplicationStatus.CLOSED ?
                                "w-[180px] text-blue-2x-dark cursor-pointer" :
                                currentStatus.id === CompanyStatus.DECLINE ?
                                    "w-[180px] text-red-dark cursor-pointer"
                                    : "w-[180px] cursor-pointer"}>
                    <p>{currentStatus.label}</p>
                </Table.Cell>}
            {(currentApplication > 0 && currentApplication === application.id) &&
                < Table.Cell className="w-[180px]">
                    <div>
                        <Select
                            value={fields.status.value}
                            onSelect={updateHandler}
                            placeholder={currentStatus.label}
                            data={applicationStatusSelectValues}></Select>
                    </div>
                </Table.Cell>}
            {/*<p>{application.status.id === 3 ? 'Завершено' : application.status.id === 2 ? 'Опубликовано' : application.status.id === 4 ? 'Отклонено' : 'На модерации'}</p>*/}

            <Table.Cell className="max-w-[200px] pr-[20px]">
                {application.recyclables.name}
            </Table.Cell>
            <Table.Cell>
                <>
                    <p>
                        {listType.id === 1 ? (application.price * application.totalWeight) : application.totalPrice}
                        {' '}
                        ₽
                    </p>
                    <p className="text-sm text-grey-40">
                        {(application.price * 1000)}
                        {' '}
                        ₽ / т
                    </p>
                </>
            </Table.Cell>
            <Table.Cell>
                {listType.id === 1 ? `${(application.totalWeight / 1000).toFixed(1)} т` : `${(application.totalWeight / 1000).toFixed(1)} т`}
            </Table.Cell>
            <Table.Cell className="max-w-[220px]">
                <div className={s.address}>{`${application.address}` || 'Не указан'}</div>
            </Table.Cell>
            <Table.Cell>
                <Button
                    type="micro"
                    mode="fill"
                    onClick={() => router.push(`/profile/applications/${application.id}`)}>
                    <InfoIcon/>
                </Button>
            </Table.Cell>
            <Table.Cell className="text-end">
                {deleteButton}
            </Table.Cell>
        </Table.Row>
    );
};


export const EquipmentApplicationManagementRow: React.FC<IUsersEquipmentApplicationManagementRow> = ({
                                                                                                         application,
                                                                                                         deleteButton
                                                                                                     }) => {
    const router = useRouter();
    const [currentApplication, setCurrentApplication] = useState<number>(0);
    const [currentStatus, setCurrentStatus] = useState<IStatus>({
        id: application.status.id,
        label: application.status.label
    })
    const update = useUnit(patchEquipmentApplicationStatusFX)
    const {fields} = useForm(equipmentForm)

    const updateApplicationStatus = (applicationId: number, status: string) => {
        update({
                id: applicationId,
                status: status
            }
        );
        setCurrentApplication(0);
    };

    const updateHandler = (event: ISelectValue<number> | null) => {
        //@ts-ignore
        updateApplicationStatus(application.id, `${event.value}`)
        fields.status.onChange(event)
        //@ts-ignore
        setCurrentStatus({id: event?.value, label: event?.label})
    };

    const currentApplicationHandler = (companyId: number) => {
        setCurrentApplication(companyId);
    };
    useEffect(() => {
    }, [currentApplication, currentStatus, application]);

    return (
        <Table.Row /*className="cursor-pointer" onClick={() => {
            router.push(`/profile/equipment-applications/${application.id}`)
        }}*/>
            <Table.Cell>
                <p>
                    {new Intl.DateTimeFormat('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour12: false,
                    }).format(new Date(application.createdAt))}
                </p>
            </Table.Cell>

            {currentApplication === 0 &&
                <Table.Cell
                    onClick={() => currentApplicationHandler(application.id)}
                    className={currentStatus.id === ApplicationStatus.ON_REVIEW
                        ? "text-orange-dark w-[180px] cursor-pointer" :
                        currentStatus.id === ApplicationStatus.PUBLISHED ?
                            "text-green-dark w-[180px] cursor-pointer" :
                            currentStatus.id === ApplicationStatus.CLOSED ?
                                "w-[180px] text-blue-2x-dark cursor-pointer" :
                                currentStatus.id === CompanyStatus.DECLINE ?
                                    "w-[180px] text-red-dark cursor-pointer"
                                    : "w-[180px] cursor-pointer"}>
                    <p>{currentStatus.label}</p>
                </Table.Cell>}
            {(currentApplication > 0 && currentApplication === application.id) &&
                < Table.Cell className="w-[180px]">
                    <div>
                        <Select
                            value={fields.status.value}
                            onSelect={updateHandler}
                            placeholder={currentStatus.label}
                            data={applicationStatusSelectValues}></Select>
                    </div>
                </Table.Cell>}
            {/*<p>{application.status.id === 3 ? 'Завершено' : application.status.id === 2 ? 'Опубликовано' : application.status.id === 4 ? 'Отклонено': 'На модерации'}</p>*/}

            <Table.Cell>
                {application.dealType.id === 1 ? 'Покупка' : 'Продажа'}
            </Table.Cell>
            <Table.Cell className="max-w-[110px] pr-[20px]">
                {application.equipment.name}
            </Table.Cell>
            <Table.Cell>
                <p className="text-[14px] font-medium text-black">
                    {application.price}
                    {' '}
                    ₽ / шт
                </p>
                <p className="text-[12px] text-grey-40">
                    {application.price * application.count}
                    {' '}
                    ₽
                </p>
            </Table.Cell>
            {/*<Table.Cell>
        {application.count}
      </Table.Cell>*/}
            <Table.Cell className="max-w-[220px]">
                <div className={s.address}>{application.address || 'Не указан'}</div>
            </Table.Cell>
            <Table.Cell>
                <Button
                    type="micro"
                    mode="fill"
                    onClick={() => router.push(`/profile/equipment-applications/${application.id}`)}>
                    <InfoIcon/>
                </Button>
            </Table.Cell>
            <Table.Cell className="text-end">
                {deleteButton}
            </Table.Cell>
        </Table.Row>
    );
};
