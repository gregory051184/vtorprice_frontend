import { FC, useEffect, useState } from "react";
import { ITooltip } from "./types";
import s from './style.module.scss';
import classNames from "classnames";

const Tooltip: FC<ITooltip> = ({ content, className, children }) => {
  const [isShow, setIsShow] = useState(false);
  let timer: NodeJS.Timeout;

  const clearTimer = () => timer && clearTimeout(timer);
  const showTooltip = () => !isShow && setIsShow(true);
  const hideTooltip = () => isShow && setIsShow(false);

  const onMouseEnter = () => {
    timer = setTimeout(showTooltip, 300);
  };
  const onMouseLeave = () => {
    clearTimer();
    hideTooltip();
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  });

  return <div onMouseLeave={onMouseLeave} className={classNames(s.tooltip, className)}>
    <div className={s.trigger} onMouseEnter={onMouseEnter}>
      {children}
    </div>
    {isShow && <div className={s.message}>
      <div className={s.message_wrapper}>{content}</div>
    </div>}
  </div>
}

export { Tooltip }
