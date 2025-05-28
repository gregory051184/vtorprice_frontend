import { $authStore } from '@box/entities/auth';
import { BlurOverlay, Button } from '@box/shared/ui';
import classNames from 'classnames';
import { useEvent, useStore } from 'effector-react';
import { useRef } from 'react';
import s from './style.module.scss';
import { useRouter } from 'next/router';
import { $modalVisibleNotAuth, closeModalNotAuthEvent } from '../model';
import { setShowAuthModal } from '@box/widgets/authModal';


export const NotAuthAlert: React.FC<{withModelStateToShow?: boolean}> = ({
    withModelStateToShow = false,
}) => {
    const authStore = useStore($authStore);
    const bodyRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const modalVisibleNotAuth = useStore($modalVisibleNotAuth);
    const closeModalNotAuth = useEvent(closeModalNotAuthEvent);
    const setShowAuthForm = useEvent(setShowAuthModal);

    const additionalRuleToShow = withModelStateToShow === true ? modalVisibleNotAuth : true;

    let visible = false;
    if (!authStore?.isAuth && additionalRuleToShow) {
        visible = true;
    }

    return (
        <BlurOverlay childRef={bodyRef} visible={visible} animationDuration={200} close={() => {}}>
            <div ref={bodyRef} className={classNames(s.body_wrapper)}>
            <div className={classNames('bg-grey-10', s.body)}>
                <h2 className="text-2xl font-medium text-center mb-4">{"Действие недоступно"}</h2>
                <p className="text-sm text-center text-grey-90">
                {"Для совершения этого действия необходимо пройти авторизацию на сайте."}
                </p>
                <div className="flex justify-between gap-[10px] mt-[30px]">
                    <Button onClick={() => {router.push("/"); closeModalNotAuth(); setShowAuthForm(true);}}>Авторизоваться</Button>
                    <Button mode='light' onClick={() => {withModelStateToShow ? null : router.back(); closeModalNotAuth();}}>Назад</Button>
                </div>
            </div>
            </div>

        </BlurOverlay>
    );
  };