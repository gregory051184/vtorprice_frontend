import classNames from 'classnames';
import React, { ChangeEventHandler, useId } from 'react';
import { IFileButton } from './types';

export const FileButton: React.FC<IFileButton> = ({
  children,
  className,
  onChange,
  mimes = '',
  multiple,
  accept
}) => {
  const id = useId();
  
  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target?.files?.[0];
    if (file) {
      onChange(file);
      return;
    }
    onChange(null);
  };

  return (
    <label htmlFor={id} className={classNames('block cursor-pointer w-full', className)}>
      <input id={id} onChange={handleFileSelect} accept={mimes} type="file" className="hidden" multiple={multiple} { ...(!!accept && {accept}) } />
      {children}
    </label>
  );
};
