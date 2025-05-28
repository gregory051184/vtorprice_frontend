import {useEvent, useGate, useStore} from "effector-react";
import {Button} from "@box/shared/ui";
import {StaffListRow} from "@box/widgets/settings/companyStaffSettings";
import {$authStore} from "@box/entities/auth";
import {patchCompanyStaffFX} from "@box/features/company-management/company_info";
import React, {useEffect} from "react";
import {
    $companyCurrentStaffOwnerOnlyFx,
    companyStaffOwnerOnlyGate,
    updateCompanyCurrentStaffFx,
    updateCompanySuspendStaffFx
} from "@box/features/settings/company-staff-management";


export const StaffList = () => {
    const auth = useStore($authStore);
    const patchCompanyStaff = useEvent(patchCompanyStaffFX)
    const staff = useStore($companyCurrentStaffOwnerOnlyFx);
    useGate(companyStaffOwnerOnlyGate);
    const updateCurrentStaff = useEvent(updateCompanyCurrentStaffFx);
    const updateSuspendedStaff = useEvent(updateCompanySuspendStaffFx);

    const suspendHandler = (userId: number) => {
        const suspendList = auth?.user?.company?.suspendStaff;
        if (!suspendList?.includes(userId)) {
            suspendList?.push(userId);
        }
        const staffList = auth?.user?.company?.staff.filter(staff => staff !== userId);

        patchCompanyStaffFX({
            //@ts-ignore
            id: +auth.user.company.id,
            staff: staffList,
            suspend_staff: suspendList
        });
        //@ts-ignore
        updateCurrentStaff(staff.filter(user => staffList.includes(user.id)));
        //@ts-ignore
        updateSuspendedStaff(staff.filter(user => suspendList.includes(user.id)));

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
        updateCurrentStaff(staff.filter(user => staffList.includes(user.id)));

    }

    const currentStaff = () => {
        return staff.filter(user => auth?.user?.company?.staff.includes(user?.id))
    }


    useEffect(() => {
    }, [staff, auth]);

    return (
        <div className="mt-10">
            <h3>Действующие сотрудники:</h3>
            {currentStaff().map(user => (
                <div key={user?.id} className="inline-flex">
                    <StaffListRow user={user}></StaffListRow>
                    <div className="ml-4">
                        <Button
                            mode="light"
                            onClick={() => suspendHandler(user?.id)}>
                            Отстранить
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