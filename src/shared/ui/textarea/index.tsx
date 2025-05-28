import React, { useRef } from 'react';
import classNames from 'classnames';
import ArrowBottom from '@assets/icons/select_arrow_bottom.svg';
import { ITextArea } from './types';

export const TextArea: React.FC<ITextArea> = ({
  className, sx, onChange = () => null, ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollDown = () => {
    if (textAreaRef.current) {
      textAreaRef.current?.scrollTo({
        top: textAreaRef.current?.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div style={sx} className={classNames('p-[14px] rounded-[10px] border border-grey-20 flex bg-white', className)}>
      <textarea onChange={(ev) => onChange(ev.target.value)} ref={textAreaRef} className="w-full resize-none placeholder-grey-30" {...props} />
      <div onClick={scrollDown} className="self-stretch flex items-center px-[5px] cursor-pointer">
        <ArrowBottom width={20} height={20} />

      </div>
    </div>
  );
};
