import classNames from 'classnames';
import React, { ChangeEventHandler, useId } from 'react';
import { IFileButton } from './types';

export const FilesButton: React.FC<IFileButton> = ({
  children,
  className,
  onChange,
  mimes = '',
  multiple
}) => {
  const id = useId();


  
  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const files = ev.target?.files;
    if (files) {
      onChange(files);
      return;
    }
    onChange(null);
  };

  return (
    <label htmlFor={id} className={classNames('block cursor-pointer w-full', className)}>
      <input id={id} onChange={handleFileSelect} accept={mimes} type="file" className="hidden" multiple={multiple} />
      {children}
    </label>
  );
};
