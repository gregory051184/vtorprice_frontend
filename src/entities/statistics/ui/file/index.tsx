import React from 'react';
import classNames from 'classnames';
import { Skeleton, FileButton } from '@box/shared/ui';
import FileIcon from '@assets/icons/24_file.svg';
import Delete from '@assets/icons/input_wipe_icon.svg';
import Add from '@assets/icons/16_add.svg';
import { IFile } from './types';

export const FileForPayments: React.FC<IFile> = ({
  className,
  file = null,
  loading = false,
  onSelect = () => null,
  onDelete,
  name
}) => {
  if (loading) {
    return <Skeleton className={classNames('h-[56px]  rounded-[10px]', className)} />;
  }
  if (file) {
    return (
      <div className={classNames('shadow h-[56px] border-2 border-white rounded-[10px] p-[16px] bg-white cursor-pointer  flex items-center justify-between', className)}>
        <div className="flex items-center gap-2">
            <FileIcon className="fill-primaryGreen-main" />
            <p className="text-sm">{file}</p>
        </div>
        {onDelete && <Delete onClick={() => onDelete()} />}
      </div>
    );
  }
  return (
    <FileButton onChange={onSelect} className={className}>
      <div className={classNames('border-2 h-[56px] w-full cursor-pointer rounded-[10px] flex justify-center border-primaryGreen-main border-dashed')}>
        <div className="flex items-center gap-[16px]">
          <Add className="fill-primaryGreen-main" />
          <p className="text-primaryGreen-main text-sm font-medium">{name}</p>
        </div>
      </div>
    </FileButton>    
  );
};
