import { Portal } from "@box/hoc";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import ModalClose from "@assets/icons/modal_close.svg";
import { BlurOverlay } from "../blurOverlay";
import { IDrawer } from "./types";
import s from "./style.module.scss";

const animation = {
  enter: s.slide_enter,
  enterActive: s.slide_enter_active,
  enterDone: s.slide_enter_done,
  exit: s.slide_exit,
  exitActive: s.slide_exit_active,
};

export const Drawer: React.FC<IDrawer> = ({
  children,
  title,
  visible,
  close,
  bottomActions,
  disableClickOutside = false,
}) => {
  const [visibleState, setVisibleState] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleState(visible);
  }, [visible]);

  return (
    <Portal containerId="modals">
      <BlurOverlay
        visible={visible}
        disableClickOutside={disableClickOutside}
        close={close}
        childRef={drawerRef}
      >
        <CSSTransition
          in={visibleState}
          nodeRef={drawerRef}
          unmountOnExit
          timeout={200}
          classNames={animation}
        >
          <div
            ref={drawerRef}
            className={classNames("flex items-start", s.drawer)}
          >
            <div
              className={classNames(
                "flex items-center mt-6 gap-[14px] cursor-pointer",
                s.close_button_out
              )}
              onClick={close}
            >
              <ModalClose />
              <p className="font-semibold text-white">Закрыть</p>
            </div>
            <div className={classNames("bg-white flex flex-col grow h-full w-full")}>
              <div
                className={classNames("bg-white px-[24px] py-[32px]", s.head)}
              >
                <p className="text-2xl">{title}</p>
              </div>
              <div className="px-[24px] pb-[32px] overflow-y-auto grow">
                {children}
              </div>
              {bottomActions && (
                <div className="border-t border-t-grey-20 px-[24px] py-[19px]">
                  {bottomActions}
                </div>
              )}
            </div>
          </div>
        </CSSTransition>
      </BlurOverlay>
    </Portal>
  );
};
