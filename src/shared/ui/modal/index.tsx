import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import ModalClose from '@assets/icons/modal_close.svg';
import { Portal } from '@box/hoc';
import { CSSTransition } from 'react-transition-group';
import { BlurOverlay } from '../blurOverlay';
import { IModal } from './types';
import s from './style.module.scss';

const animation = {
  enter: s.zoom_enter,
  enterActive: s.zoom_enter_active,
  exit: s.zoom_exit,
  exitActive: s.zoom_exit_active,
};

export const Modal: React.FC<IModal> = ({
  children,
  className,
  close,
  visible,
  title,
}) => {
  const [visibleState, setVisibleState] = useState(false);

  useEffect(() => {
    setVisibleState(visible);
  }, [visible]);

  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <Portal containerId="modals">
      <BlurOverlay childRef={bodyRef} visible={visible} animationDuration={200} close={close}>
        <CSSTransition in={visibleState} nodeRef={bodyRef} timeout={200} classNames={animation}>
          <div ref={bodyRef} className={classNames(s.body_wrapper, className)}>
            <div className={classNames('bg-grey-10', s.body)}>
              {title && <h2 className="text-2xl font-normal text-center mb-4">{title}</h2>}
              {children}
            </div>
            <div className="flex justify-center items-center mt-6 gap-[14px] cursor-pointer" onClick={close}>
              <ModalClose />
              <p className="font-semibold text-white">Закрыть</p>
            </div>
          </div>
        </CSSTransition>

      </BlurOverlay>
    </Portal>
  );
};
