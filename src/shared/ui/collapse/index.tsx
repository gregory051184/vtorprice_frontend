import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ICollapse } from './types';

export const Collapse: React.FC<ICollapse> = ({
  className,
  opened,
  animate = true,
  children,
}) => {
  const childrenRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState('0');

  useEffect(() => {
    if (childrenRef.current) {
      if (opened) {
        setCurrentHeight(`${childrenRef.current.getBoundingClientRect().height}px`);
        return;
      }
      setCurrentHeight('0');
    }
  }, [opened]);
  useEffect(() => {
    const resizeCallback = () => {
      if (childrenRef.current) {
        setCurrentHeight(`${childrenRef.current.getBoundingClientRect().height}px`);
      }
    };

    const resizeObserver = new ResizeObserver(resizeCallback);
    if (childrenRef.current) {
      resizeObserver.observe(childrenRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div
      style={{
        ...(animate && { transition: '.2s' }),
        height: opened ? currentHeight : '0',
      }}
      className={classNames('overflow-hidden', className)}
    >
      <div ref={childrenRef} className="">
        {children}
      </div>
    </div>
  );
};
