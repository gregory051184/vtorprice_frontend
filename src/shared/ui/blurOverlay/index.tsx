import classNames from 'classnames';
import React, { MouseEventHandler, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { IBlurOverlay } from './types';
import s from './style.module.scss';

export const BlurOverlay: React.FC<IBlurOverlay> = ({
  childRef,
  children,
  animationDuration = 200,
  visible,
  close,
  disableClickOutside = false
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const onOverlayClick: MouseEventHandler<HTMLDivElement> = (ev) => {
    const target = ev.target as Node;
    if (childRef.current && !childRef.current?.contains(target)) {
      if (!disableClickOutside) {
        close();
      }
    }
  };

  useEffect(() => {
    if (visible) {
      document.body.style.height = 'calc(var(--vh, 1vh) * 100)';
      document.body.style.overflowY = 'hidden';
      return;
    }
    document.body.style.height = 'auto';
    document.body.style.overflowY = 'auto';
  }, [visible]);

  return (
    <CSSTransition in={visible} nodeRef={overlayRef} timeout={animationDuration} unmountOnExit classNames="fade">
      <div onClick={onOverlayClick} ref={overlayRef} className={classNames('backdrop-blur', s.overlay)}>
        {children}
      </div>
    </CSSTransition>
  );
};
