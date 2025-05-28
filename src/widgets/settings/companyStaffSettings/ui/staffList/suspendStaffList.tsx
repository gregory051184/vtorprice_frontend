import {useEvent, useGate, useStore} from "effector-react";
import {Button} from "@box/shared/ui";
import {StaffListRow} from "@box/widgets/settings/companyStaffSettings";
import {$authStore} from "@box/entities/auth";
import React, {useEffect} from "react";
import {patchCompanyStaffFX} from "@box/features/company-management/company_info";
import {
    $companySuspendStaffOwnerOnlyFx,
    companyStaffOwnerOnlyGate, updateCompanyCurrentStaffFx, updateCompanySuspendStaffFx,

} from "@box/features/settings/company-staff-management";

export const SuspendStaffList = () => {
    const auth = useStore($authStore);
    const patchCompanyStaff = useEvent(patchCompanyStaffFX)
    const updateCurrentStaff = useEvent(updateCompanyCurrentStaffFx);
    const updateSuspendedStaff = useEvent(updateCompanySuspendStaffFx);

    const staff = useStore($companySuspendStaffOwnerOnlyFx);
    useGate(companyStaffOwnerOnlyGate);

    const returnHandler = (userId: number) => {
        const suspendList = auth?.user?.company?.suspendStaff.filter(staff => staff !== userId);
        const staffList = auth?.user?.company?.staff;
        if (!staffList?.includes(userId)) {
            staffList?.push(userId)
        }
        patchCompanyStaffFX({
            //@ts-ignore
            id: +auth.user.company.id,
            staff: staffList,
            suspend_staff: suspendList
        });
        //@ts-ignore
        updateCurrentStaff(staff.filter(user => staffList.includes(user.id)))
        //@ts-ignore
        updateSuspendedStaff(staff.filter(user => suspendList.includes(user.id)))
    }

    const dismissHandler = (userId: number) => {
        const suspendList = auth?.user?.company?.suspendStaff.filter(staff => staff !== userId);
        const staffList = auth?.user?.company?.staff.filter(staff => staff !== userId);

        patchCompanyStaff({
            //@ts-ignore
            id: +auth.user.company.id,
            staff: staffList,
            suspend_staff: suspendList
        });
        //@ts-ignore
        updateSuspendedStaff(staff.filter(user => suspendList.includes(user.id)));
    }

    const suspendedStaff = () => {
        return staff.filter(user => auth?.user?.company?.suspendStaff.includes(user?.id))
    }

    useEffect(() => {
    }, [staff, auth]);

    return (
        <div className="mt-10">
            <h3>Отстранённые сотрудники:</h3>
            {suspendedStaff().map(user => (
                <div key={user?.id} className="inline-flex">
                    <StaffListRow user={user}></StaffListRow>
                    <div className="ml-4">
                        <Button
                            mode="light"
                            onClick={() => returnHandler(user?.id)}>
                            Вернуть
                        </Button>
                    </div>
                    <div className="ml-4">
                        <Button
                            mode="light"
                            onClick={() => dismissHandler(user?.id)}>
                            Уволить
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}