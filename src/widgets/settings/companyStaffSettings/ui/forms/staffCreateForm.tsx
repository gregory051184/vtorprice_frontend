import React, {FormEventHandler} from "react";
import {useEvent, useStore} from "effector-react";
import {
    createStaffUserEvent
} from "@box/features/settings/company-staff-management/model/form.store";
import {useForm} from "@box/shared/effector-forms";
import {companyStaffCreateForm} from "@box/features/settings/company-staff-management";
import {useScreenSize} from "@box/shared/hooks";
import {BackButton, BaseInput, Button, Container} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/entities/proposal/ui/style.module.scss";
import {StaffList, StaffListRow} from "@box/widgets/settings/companyStaffSettings";
import {$authStore} from "@box/entities/auth";
import {SuspendStaffList} from "@box/widgets/settings/companyStaffSettings/ui/staffList";


export const StaffCreateForm = () => {
    const staffUserCreateEvent = useEvent(createStaffUserEvent)

    const user = useStore($authStore);
    const {fields, submit, isValid} = useForm(companyStaffCreateForm)

    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();
        staffUserCreateEvent();
        submit();
    };

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    return (
        <Container>
            <BackButton/>
            <h3 className="mt-5">
                Добавить нового сотрудника
            </h3>
            <form onSubmit={onSubmit}>
                <BaseInput
                    className='mt-4'
                    required
                    placeholder="Имя"
                    value={fields.first_name.value}
                    onChange={fields?.first_name?.onChange}
                    mode='stroke'
                />
                <BaseInput
                    className='mt-4'
                    required
                    placeholder="Фамилия"
                    value={fields.last_name.value}
                    onChange={fields?.last_name?.onChange}
                    mode='stroke'
                />
                <BaseInput
                    className='mt-4'
                    required
                    placeholder="Отчество"
                    value={fields.middle_name.value}
                    onChange={fields?.middle_name?.onChange}
                    mode='stroke'
                />
                <BaseInput
                    className='mt-4'
                    required
                    placeholder="Телефон"
                    value={fields.phone.value}
                    onChange={fields?.phone?.onChange}
                    mode='stroke'
                />
                <BaseInput
                    className='mt-4'
                    required
                    placeholder="Должность"
                    value={fields.position.value}
                    onChange={fields?.position?.onChange}
                    mode='stroke'
                />
                <div className={classNames('mt-4 flex gap-[24px] items-center ', s.block, s.footer)}>
                    <Button
                        disabled={!isValid}
                        className={classNames('w-full', s.block_input)}
                        htmlType="submit">
                        Добавить сотрудника
                    </Button>
                </div>
            </form>
            {user?.user?.id === user?.user?.company.owner?.id &&
                <>
                    <StaffList></StaffList>
                    <SuspendStaffList></SuspendStaffList>
                </>
            }
        </Container>
    )
}