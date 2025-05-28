import { $authStore } from '@box/entities/auth';
import { BlurOverlay, Button } from '@box/shared/ui';
import classNames from 'classnames';
import { useStore } from 'effector-react';
import { useEvent } from 'effector-react/scope';
import { useRef } from 'react';
import s from './style.module.scss';
import { useRouter } from 'next/router';
import { ROLE } from '@box/types';
import { $modalVisibleNotVerif, closeModalNotVerifEvent } from '../model';


export const NotVerificatedAlert: React.FC<{withModelStateToShow?: boolean}> = ({
    withModelStateToShow = false,
}) => {
    const authStore = useStore($authStore);
    const bodyRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const modalVisibleNotVerif = useStore($modalVisibleNotVerif);
    const closeModalNotVerif = useEvent(closeModalNotVerifEvent);

    const additionalRuleToShow = withModelStateToShow === true ? modalVisibleNotVerif : true;

    let visible = false;
    if ((authStore?.user?.role.id as ROLE === ROLE.MANAGER || 
        authStore?.user?.role.id as ROLE === ROLE.COMPANY_ADMIN) && 
        authStore?.user?.company?.status?.label === "Не проверенная" &&
        authStore?.isAuth &&
        additionalRuleToShow) {
        visible = true;
    }

    return (
        // @ts-ignore
        <BlurOverlay childRef={bodyRef} visible={visible} animationDuration={200} close={console.log(" ")}>

            <div ref={bodyRef} className={classNames(s.body_wrapper)}>
            <div className={classNames('bg-grey-10', s.body)}>
                <h2 className="text-2xl font-medium text-center mb-4">{"Действие недоступно"}</h2>
                <p className="text-sm text-center text-grey-90">
                {"Для совершения этого действия необходимо отправить заявку на верифицикацию Вашей компании в личном кабинете в разделе “Настройки”."}
                </p>
                <div className="flex justify-between gap-[10px] mt-[30px]">
                    <Button onClick={() => {router.push("/profile/settings"); closeModalNotVerif();}}>Верифицировать</Button>
                    <Button mode='light' onClick={() => {withModelStateToShow ? null : router.back(); closeModalNotVerif();}}>Назад</Button>
                </div>
            </div>
            </div>

        </BlurOverlay>
    );
  };